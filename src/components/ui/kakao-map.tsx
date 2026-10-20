"use client";

import { type JSX, useEffect, useRef, useState } from "react";

import { loadKakaoMapSdk } from "./kakao-map-sdk";

export interface KakaoMapProps {
  companyName: string;
  address: string;
}

type MapStatus = "loading" | "ready" | "missing-key" | "sdk-error" | "geocode-error";

const statusMessage: Record<Exclude<MapStatus, "ready">, string> = {
  loading: "지도를 불러오는 중입니다",
  "missing-key": "카카오맵 설정이 필요합니다",
  "sdk-error": "지도를 불러오지 못했습니다",
  "geocode-error": "주소를 찾지 못했습니다",
};

export function KakaoMap({ companyName, address }: KakaoMapProps): JSX.Element {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MapStatus>(appKey ? "loading" : "missing-key");

  useEffect(() => {
    let active = true;

    if (!appKey) {
      return () => {
        active = false;
      };
    }

    Promise.resolve()
      .then(() => {
        if (!active) {
          return null;
        }

        setStatus("loading");
        return loadKakaoMapSdk(appKey);
      })
      .then((maps) => {
        const mapContainer = mapContainerRef.current;
        if (!active || !mapContainer || !maps) {
          return;
        }

        const showGeocodeError = () => {
          if (active) {
            setStatus("geocode-error");
          }
        };

        try {
          const geocoder = new maps.services.Geocoder();
          geocoder.addressSearch(address, (result, geocodeStatus) => {
            if (!active) {
              return;
            }

            try {
              if (geocodeStatus !== maps.services.Status.OK || result.length === 0) {
                showGeocodeError();
                return;
              }

              const [location] = result;
              const latitude = Number.parseFloat(location.y);
              const longitude = Number.parseFloat(location.x);
              if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
                showGeocodeError();
                return;
              }

              const position = new maps.LatLng(latitude, longitude);
              const map = new maps.Map(mapContainer, { center: position, level: 4 });
              const overlayContent = document.createElement("div");
              overlayContent.className = "flex flex-col items-center pb-2";

              const label = document.createElement("strong");
              label.dataset.companyMapLabel = "true";
              label.className = "whitespace-nowrap rounded-full border border-white/70 bg-[var(--navy-950)] px-3 py-1.5 text-xs font-bold text-white shadow-lg";
              label.textContent = companyName;

              const svgNamespace = "http://www.w3.org/2000/svg";
              const pin = document.createElementNS(svgNamespace, "svg");
              pin.dataset.companyMapPin = "true";
              pin.setAttribute("viewBox", "0 0 24 32");
              pin.setAttribute("width", "24");
              pin.setAttribute("height", "32");
              pin.classList.add("mt-1.5", "drop-shadow-md");
              pin.setAttribute("aria-hidden", "true");

              const pinShape = document.createElementNS(svgNamespace, "path");
              pinShape.dataset.companyMapPinShape = "true";
              pinShape.setAttribute("d", "M12 1C5.925 1 1 5.925 1 12c0 8.25 11 19 11 19s11-10.75 11-19C23 5.925 18.075 1 12 1Z");
              pinShape.setAttribute("fill", "var(--brand-gold-deep)");
              pinShape.setAttribute("stroke", "white");
              pinShape.setAttribute("stroke-width", "1.5");

              const pinCenter = document.createElementNS(svgNamespace, "circle");
              pinCenter.dataset.companyMapPinCenter = "true";
              pinCenter.setAttribute("cx", "12");
              pinCenter.setAttribute("cy", "11.5");
              pinCenter.setAttribute("r", "3.5");
              pinCenter.setAttribute("fill", "white");

              pin.append(pinShape, pinCenter);
              overlayContent.append(label, pin);
              new maps.CustomOverlay({
                map,
                position,
                content: overlayContent,
                xAnchor: 0.5,
                yAnchor: 1,
              });
              setStatus("ready");
            } catch {
              showGeocodeError();
            }
          });
        } catch {
          showGeocodeError();
        }
      })
      .catch(() => {
        if (active) {
          setStatus("sdk-error");
        }
      });

    return () => {
      active = false;
    };
  }, [address, appKey, companyName]);

  const message = status === "ready" ? null : statusMessage[status];

  return (
    <div className="relative min-h-80 overflow-hidden bg-[var(--concrete-100)]">
      {appKey ? (
        <div ref={mapContainerRef} className="absolute inset-0" role="region" aria-label={`${companyName} 위치 지도`} />
      ) : null}
      {message ? <div className="pointer-events-none absolute inset-0 flex items-end p-6 sm:p-8">
        <div className="pointer-events-auto max-w-md rounded-sm border border-black/10 bg-white/95 px-5 py-4 shadow-xl shadow-black/5">
          <p role="status" aria-live="polite" className="font-bold text-[var(--navy-950)]">{message}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--navy-950)]">{address}</p>
        </div>
      </div> : null}
    </div>
  );
}
