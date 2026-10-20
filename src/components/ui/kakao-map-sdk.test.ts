import { beforeEach, describe, expect, it, vi } from "vitest";

describe("loadKakaoMapSdk", () => {
  beforeEach(() => {
    vi.resetModules();
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    window.kakao = {
      maps: {
        load: vi.fn((callback: () => void) => callback()),
      },
    } as unknown as typeof window.kakao;
  });

  it("loads the SDK once and resolves both callers after Kakao initializes", async () => {
    const { loadKakaoMapSdk } = await import("./kakao-map-sdk");

    const first = loadKakaoMapSdk("test key&/");
    const second = loadKakaoMapSdk("test key&/");
    const script = document.querySelector<HTMLScriptElement>("script[data-kakao-map-sdk]");

    expect(script?.src).toContain("appkey=test%20key%26%2F");
    expect(script?.src).toContain("autoload=false");
    expect(script?.src).toContain("libraries=services");
    expect(document.querySelectorAll("script[data-kakao-map-sdk]")).toHaveLength(1);
    expect(first).toBe(second);

    script?.dispatchEvent(new Event("load"));

    await expect(first).resolves.toBe(window.kakao?.maps);
    expect(window.kakao?.maps?.load).toHaveBeenCalledOnce();
  });

  it("initializes immediately when an existing SDK script has already loaded", async () => {
    const existingScript = document.createElement("script");
    existingScript.dataset.kakaoMapSdk = "true";
    document.head.appendChild(existingScript);
    const { loadKakaoMapSdk } = await import("./kakao-map-sdk");

    const promise = loadKakaoMapSdk("test-key");

    expect(document.querySelectorAll("script[data-kakao-map-sdk]")).toHaveLength(1);
    expect(window.kakao?.maps?.load).toHaveBeenCalledOnce();

    await expect(promise).resolves.toBe(window.kakao?.maps);
  });

  it("uses an existing SDK script and rejects when it fails to load", async () => {
    Reflect.deleteProperty(window, "kakao");
    const existingScript = document.createElement("script");
    existingScript.dataset.kakaoMapSdk = "true";
    document.head.appendChild(existingScript);
    const { loadKakaoMapSdk } = await import("./kakao-map-sdk");

    const promise = loadKakaoMapSdk("test-key");

    expect(document.querySelectorAll("script[data-kakao-map-sdk]")).toHaveLength(1);
    existingScript.dispatchEvent(new Event("error"));

    await expect(promise).rejects.toThrow("카카오맵 SDK를 불러오지 못했습니다.");
  });

  it("rejects when the script loads without a usable Kakao Maps API", async () => {
    Reflect.deleteProperty(window, "kakao");
    const { loadKakaoMapSdk } = await import("./kakao-map-sdk");

    const promise = loadKakaoMapSdk("test-key");
    const script = document.querySelector<HTMLScriptElement>("script[data-kakao-map-sdk]");

    script?.dispatchEvent(new Event("load"));

    await expect(promise).rejects.toThrow("카카오맵 SDK를 불러오지 못했습니다.");
  });

  it("rejects an existing completed script when the Kakao Maps API is unusable", async () => {
    Reflect.deleteProperty(window, "kakao");
    const existingScript = document.createElement("script");
    existingScript.dataset.kakaoMapSdk = "true";
    Object.defineProperty(existingScript, "readyState", { value: "complete" });
    document.head.appendChild(existingScript);
    const { loadKakaoMapSdk } = await import("./kakao-map-sdk");

    await expect(loadKakaoMapSdk("test-key")).rejects.toThrow("카카오맵 SDK를 불러오지 못했습니다.");
  });
});
