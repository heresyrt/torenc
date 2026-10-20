let kakaoMapPromise: Promise<KakaoMapsApi> | null = null;

export function loadKakaoMapSdk(appKey: string): Promise<KakaoMapsApi> {
  if (kakaoMapPromise) {
    return kakaoMapPromise;
  }

  kakaoMapPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>("script[data-kakao-map-sdk]");
    const script = existingScript ?? document.createElement("script");
    const rejectSdk = () => {
      reject(new Error("카카오맵 SDK를 불러오지 못했습니다."));
    };
    const initializeKakao = () => {
      script.dataset.kakaoMapSdkState = "loaded";

      try {
        const maps = window.kakao?.maps;
        if (!maps || typeof maps.load !== "function") {
          rejectSdk();
          return;
        }

        maps.load(() => resolve(maps));
      } catch {
        rejectSdk();
      }
    };

    if (existingScript && window.kakao?.maps) {
      initializeKakao();
      return;
    }

    const scriptReadyState = (script as HTMLScriptElement & { readyState?: string }).readyState;
    if (
      existingScript
      && (
        script.dataset.kakaoMapSdkState === "loaded"
        || script.dataset.kakaoMapSdkState === "error"
        || scriptReadyState === "loaded"
        || scriptReadyState === "complete"
      )
    ) {
      rejectSdk();
      return;
    }

    script.onload = initializeKakao;
    script.onerror = () => {
      script.dataset.kakaoMapSdkState = "error";
      rejectSdk();
    };

    if (!existingScript) {
      script.dataset.kakaoMapSdk = "true";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false&libraries=services`;
      document.head.appendChild(script);
    }
  });

  return kakaoMapPromise;
}
