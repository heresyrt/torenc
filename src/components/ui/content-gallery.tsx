"use client";

import Image from "next/image";
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { DetailImageItem, MediaItem } from "@/types/site";
import {
  changeScale,
  clampPan,
  clampScale,
  MAX_SCALE,
  MIN_SCALE,
  type Point,
  SCALE_STEP,
  type ViewerTransform,
} from "./image-viewer-transform";

interface ContentGalleryProps {
  items: MediaItem[];
  variant: "business" | "projects" | "certificates" | "detail";
  numbers?: string[];
  showDetails?: boolean;
}

export function ContentGallery({ items, variant, numbers, showDetails = true }: ContentGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [transform, setTransform] = useState<ViewerTransform>({ scale: MIN_SCALE, x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const transformLayerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchLastRef = useRef<Point | null>(null);
  const touchCancelledRef = useRef(false);
  const pinchRef = useRef<{ distance: number; center: Point; transform: ViewerTransform } | null>(null);
  const mouseDragRef = useRef<{ start: Point; transform: ViewerTransform } | null>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];

  const clearGestureRefs = useCallback(() => {
    touchStartRef.current = null;
    touchLastRef.current = null;
    touchCancelledRef.current = false;
    pinchRef.current = null;
    mouseDragRef.current = null;
  }, []);

  const close = useCallback(() => {
    const index = activeIndex;
    clearGestureRefs();
    setActiveIndex(null);
    setTransform({ scale: MIN_SCALE, x: 0, y: 0 });
    requestAnimationFrame(() => index !== null && triggerRefs.current[index]?.focus());
  }, [activeIndex, clearGestureRefs]);

  const move = useCallback((direction: number) => {
    clearGestureRefs();
    setActiveIndex((current) => current === null ? null : (current + direction + items.length) % items.length);
    setTransform({ scale: MIN_SCALE, x: 0, y: 0 });
  }, [clearGestureRefs, items.length]);

  const selectItem = (index: number) => {
    clearGestureRefs();
    setActiveIndex(index);
    setTransform({ scale: MIN_SCALE, x: 0, y: 0 });
  };

  const setScale = (scale: number) => {
    setTransform((current) => {
      const next = changeScale(current, scale);
      return { ...next, ...clampToViewport(next, next.scale) };
    });
  };

  const resetTouch = () => {
    clearGestureRefs();
  };

  const getTouchPoint = (touch: ReactTouchEvent<HTMLDivElement>["touches"][number]): Point => ({
    x: touch.clientX,
    y: touch.clientY,
  });

  const getTouchDistance = (event: ReactTouchEvent<HTMLDivElement>) => {
    const first = event.touches[0];
    const second = event.touches[1];
    return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
  };

  const getTouchCenter = (event: ReactTouchEvent<HTMLDivElement>): Point => {
    const rect = viewportRef.current?.getBoundingClientRect();
    return {
      x: (event.touches[0].clientX + event.touches[1].clientX) / 2
        - ((rect?.left ?? 0) + (rect?.width ?? 0) / 2),
      y: (event.touches[0].clientY + event.touches[1].clientY) / 2
        - ((rect?.top ?? 0) + (rect?.height ?? 0) / 2),
    };
  };

  const clampToViewport = (point: Point, scale: number) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect || !activeItem) return scale <= MIN_SCALE ? { x: 0, y: 0 } : point;
    const layer = transformLayerRef.current;
    const availableSize = layer && layer.clientWidth > 0 && layer.clientHeight > 0
      ? { width: layer.clientWidth, height: layer.clientHeight }
      : rect;
    return clampPan(point, scale, availableSize, { width: activeItem.width, height: activeItem.height });
  };

  const onTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      touchStartRef.current = null;
      touchCancelledRef.current = true;
      pinchRef.current = {
        distance: getTouchDistance(event),
        center: getTouchCenter(event),
        transform,
      };
      return;
    }
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchLastRef.current = getTouchPoint(touch);
    touchCancelledRef.current = false;
    pinchRef.current = null;
  };

  const onTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      touchCancelledRef.current = true;
      const pinch = pinchRef.current;
      if (!pinch || pinch.distance === 0) return;
      const center = getTouchCenter(event);
      const scale = clampScale(pinch.transform.scale * (getTouchDistance(event) / pinch.distance));
      const ratio = scale / pinch.transform.scale;
      const nextPoint = {
        x: center.x - (pinch.center.x - pinch.transform.x) * ratio,
        y: center.y - (pinch.center.y - pinch.transform.y) * ratio,
      };
      const point = clampToViewport(nextPoint, scale);
      setTransform({ scale, ...point });
      return;
    }

    if (event.touches.length === 1 && transform.scale > MIN_SCALE && touchLastRef.current) {
      event.preventDefault();
      const point = getTouchPoint(event.touches[0]);
      const delta = { x: point.x - touchLastRef.current.x, y: point.y - touchLastRef.current.y };
      touchLastRef.current = point;
      setTransform((current) => ({
        ...current,
        ...clampToViewport({ x: current.x + delta.x, y: current.y + delta.y }, current.scale),
      }));
    }
  };

  const onTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (pinchRef.current && event.touches.length === 1) {
      pinchRef.current = null;
      touchStartRef.current = null;
      touchLastRef.current = getTouchPoint(event.touches[0]);
      touchCancelledRef.current = true;
      return;
    }
    if (pinchRef.current || transform.scale > MIN_SCALE) {
      resetTouch();
      return;
    }
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    if (!start || touchCancelledRef.current || !touch) {
      resetTouch();
      return;
    }

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    resetTouch();
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    move(deltaX < 0 ? 1 : -1);
  };

  const onMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || transform.scale <= MIN_SCALE) return;
    event.preventDefault();
    mouseDragRef.current = {
      start: { x: event.clientX, y: event.clientY },
      transform,
    };
  };

  const onMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const drag = mouseDragRef.current;
    if (!drag || (event.buttons & 1) !== 1) return;
    const point = clampToViewport({
      x: drag.transform.x + event.clientX - drag.start.x,
      y: drag.transform.y + event.clientY - drag.start.y,
    }, drag.transform.scale);
    setTransform({ ...drag.transform, ...point });
  };

  const stopMouseDrag = () => {
    mouseDragRef.current = null;
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const isDesktop = window.matchMedia?.("(min-width: 768px)").matches ?? false;
    (isDesktop ? closeButtonRef.current : dialogRef.current)?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, move]);

  useEffect(() => {
    if (activeIndex === null) return;
    thumbnailRefs.current[activeIndex]?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [activeIndex]);

  const gridClass = variant === "business" || variant === "detail"
    ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    : variant === "projects"
      ? "grid gap-6 md:grid-cols-2"
      : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={gridClass}>
        {items.map((item, index) => {
          const isCertificate = variant === "certificates";
          const isContained = isCertificate || (variant === "detail" && "fit" in item && item.fit === "contain");
          return (
            <article key={item.id} className={isCertificate ? "border border-white/10 bg-white/[.03] p-4" : "group bg-white shadow-[0_14px_40px_rgba(44,63,79,.08)]"}>
              <button
                ref={(node) => { triggerRefs.current[index] = node; }}
                type="button"
                onClick={() => selectItem(index)}
                className={`focus-ring relative block w-full cursor-zoom-in overflow-hidden ${isCertificate ? "bg-white" : "bg-[var(--navy-900)]"}`}
                style={{ aspectRatio: isCertificate ? "4 / 5" : "16 / 10" }}
                aria-label={`${item.title} 크게 보기`}
              >
                <Image src={item.src!} alt={item.alt} fill quality={90} sizes={isCertificate ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"} className={`${isContained ? "object-contain p-3" : "object-cover"} transition duration-500 group-hover:scale-[1.02]`} />
                <span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-[var(--navy-950)]/85 text-xl text-white" aria-hidden="true">＋</span>
              </button>
              {showDetails && <div className={isCertificate ? "px-2 pb-3 pt-6" : "p-6"}>
                <p className={`${variant === "projects" ? "text-sm" : "text-xs"} font-bold ${isCertificate ? "text-[var(--brand-gold-light)]" : "text-[var(--brand-gold-deep)]"}`}>{numbers?.[index] ?? item.meta}</p>
                <h3 className={`mt-2 text-xl font-bold ${isCertificate ? "text-white" : "text-[var(--navy-950)]"}`}>{variant === "detail" ? (item as DetailImageItem).step : item.title}</h3>
                {item.description && <p className={`mt-3 text-sm leading-6 ${isCertificate ? "text-white/60" : "text-[var(--muted)]"}`}>{item.description}</p>}
              </div>}
            </article>
          );
        })}
      </div>

      {activeItem && createPortal((
        <div ref={dialogRef} tabIndex={-1} className="overlay-screen z-[100] flex flex-col overflow-hidden bg-black p-3 outline-none sm:p-6" role="dialog" aria-modal="true" aria-label={`${activeItem.title} 확대 보기`}>
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 text-white">
            <div className="min-w-0"><p className="truncate font-bold">{activeItem.title}</p><p className="text-xs text-white/60">{activeIndex! + 1} / {items.length}</p></div>
            <button ref={closeButtonRef} type="button" onClick={close} className="focus-ring ml-1 shrink-0 rounded bg-white px-3 py-2 font-bold text-[var(--navy-950)]" aria-label="확대 보기 닫기">닫기</button>
          </div>
          <div className="relative mx-auto mt-3 flex min-h-0 w-full max-w-[96rem] flex-1 items-center gap-3">
            {items.length > 1 && <button type="button" onClick={() => move(-1)} className="focus-ring hidden size-14 shrink-0 place-items-center rounded-full bg-black/55 text-4xl font-light text-white md:grid" aria-label="이전 이미지">‹</button>}
            <div
              ref={viewportRef}
              className={`relative flex min-h-0 min-w-0 flex-1 self-stretch overflow-hidden rounded [touch-action:none] ${transform.scale > MIN_SCALE ? "cursor-grab active:cursor-grabbing" : ""}`}
              aria-label="사진 스와이프 영역"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onTouchCancel={resetTouch}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={stopMouseDrag}
              onMouseLeave={stopMouseDrag}
            >
              <div
                ref={transformLayerRef}
                data-testid="viewer-image-transform"
                className="absolute inset-3 flex items-center justify-center will-change-transform"
                style={{ transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})` }}
              >
                <Image src={activeItem.src!} alt={activeItem.alt} width={activeItem.width} height={activeItem.height} unoptimized className="h-auto max-h-full w-auto max-w-full select-none object-contain" priority draggable={false} />
              </div>
            </div>
            {items.length > 1 && <button type="button" onClick={() => move(1)} className="focus-ring hidden size-14 shrink-0 place-items-center rounded-full bg-black/55 text-4xl font-light text-white md:grid" aria-label="다음 이미지">›</button>}
          </div>
          <div className="mx-auto mt-3 hidden items-center justify-center gap-2 md:flex">
            <div className="flex items-center rounded-full bg-black/85 p-1 text-white shadow-xl">
              <button type="button" onClick={() => setScale(transform.scale - SCALE_STEP)} disabled={transform.scale <= MIN_SCALE} className="focus-ring grid size-11 place-items-center rounded-full text-2xl disabled:cursor-not-allowed disabled:opacity-35" aria-label="축소">−</button>
              <button type="button" onClick={() => setScale(transform.scale + SCALE_STEP)} disabled={transform.scale >= MAX_SCALE} className="focus-ring grid size-11 place-items-center rounded-full text-2xl disabled:cursor-not-allowed disabled:opacity-35" aria-label="확대">＋</button>
              <button type="button" onClick={() => setScale(MIN_SCALE)} disabled={transform.scale === MIN_SCALE && transform.x === 0 && transform.y === 0} className="focus-ring grid size-11 place-items-center rounded-full text-lg disabled:cursor-not-allowed disabled:opacity-35" aria-label="화면 맞춤">⛶</button>
            </div>
          </div>
          {items.length > 1 && <div className="mx-auto mt-3 hidden max-w-full gap-2 overflow-x-auto px-1 pb-1 md:flex" aria-label="사진 썸네일 목록">
            {items.map((item, index) => (
              <button
                key={item.id}
                ref={(node) => { thumbnailRefs.current[index] = node; }}
                type="button"
                onClick={() => selectItem(index)}
                aria-label={`${item.title} 썸네일`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`focus-ring relative h-16 w-20 shrink-0 overflow-hidden border-2 bg-black/40 ${activeIndex === index ? "border-[var(--brand-gold)]" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <Image src={item.src!} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>}
          {activeItem.documentHref && <div className="mx-auto mt-3 flex w-full max-w-7xl justify-center gap-2"><a href={activeItem.documentHref} target="_blank" rel="noreferrer" className="focus-ring rounded bg-[var(--brand-gold)] px-4 py-2 text-sm font-bold text-[var(--navy-950)]">원본 PDF 열기</a><a href={activeItem.documentHref} download className="focus-ring hidden rounded border border-white/30 px-4 py-2 text-sm text-white sm:block">PDF 다운로드</a></div>}
        </div>
      ), document.body)}
    </>
  );
}
