import Image from "next/image";

import type { MediaItem } from "@/types/site";

interface ImageMediaProps {
  item: MediaItem;
  sizes: string;
  fit?: "cover" | "contain";
  priority?: boolean;
}

export function ImageMedia({ item, sizes, fit = "cover", priority = false }: ImageMediaProps) {
  const aspectRatio = `${item.width} / ${item.height}`;

  return (
    <div
      className="group relative isolate overflow-hidden bg-[var(--navy-900)]"
      style={{ aspectRatio }}
    >
      {item.src ? (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          priority={priority}
          quality={90}
          sizes={sizes}
          placeholder={item.blurDataURL ? "blur" : "empty"}
          blurDataURL={item.blurDataURL}
          className={`transition-transform duration-700 group-hover:scale-[1.025] ${fit === "contain" ? "object-contain p-5" : "object-cover"}`}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 text-center text-white">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:36px_36px]" />
          <div className="relative">
            <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full border border-white/30 text-xl" aria-hidden="true">＋</span>
            <p className="font-semibold">이미지 준비 중</p>
            <p className="mt-1 text-sm text-white/60">권장 {item.width} × {item.height}px</p>
          </div>
        </div>
      )}
    </div>
  );
}
