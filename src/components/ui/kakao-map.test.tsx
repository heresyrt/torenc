import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { loadKakaoMapSdkMock } = vi.hoisted(() => ({
  loadKakaoMapSdkMock: vi.fn(),
}));

vi.mock("./kakao-map-sdk", () => ({
  loadKakaoMapSdk: loadKakaoMapSdkMock,
}));

import { KakaoMap } from "./kakao-map";

const companyName = "더오름 이앤씨";
const address = "경기도 테스트로 1";

function createMapsApi(
  status = "OK",
  result: KakaoAddressResult[] = [{ x: "127", y: "37.5" }],
) {
  const map = { setCenter: vi.fn() };
  const marker = {};
  const infoWindow = { open: vi.fn() };
  const customOverlay = {};
  const latLng = {};

  return {
    Map: vi.fn(function Map() { return map; }),
    LatLng: vi.fn(function LatLng() { return latLng; }),
    Marker: vi.fn(function Marker() { return marker; }),
    InfoWindow: vi.fn(function InfoWindow(options: KakaoInfoWindowOptions) {
      void options;
      return infoWindow;
    }),
    CustomOverlay: vi.fn(function CustomOverlay(options: KakaoCustomOverlayOptions) {
      void options;
      return customOverlay;
    }),
    load: vi.fn(),
    services: {
      Geocoder: vi.fn(function Geocoder() { return {
        addressSearch: vi.fn((_: string, callback: (result: KakaoAddressResult[], responseStatus: string) => void) => {
          callback(result, status);
        }),
      }; }),
      Status: { OK: "OK" },
    },
    map,
    marker,
    infoWindow,
    customOverlay,
    latLng,
  };
}

describe("KakaoMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  });

  it("shows configuration guidance and the address when an app key is missing", () => {
    render(<KakaoMap companyName={companyName} address={address} />);

    expect(screen.getByText("카카오맵 설정이 필요합니다")).toBeInTheDocument();
    expect(screen.getByText(address)).toBeInTheDocument();
    expect(loadKakaoMapSdkMock).not.toHaveBeenCalled();
  });

  it("shows a loading message while the configured SDK is loading", () => {
    process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY = "test-key";
    loadKakaoMapSdkMock.mockReturnValue(new Promise(() => undefined));

    render(<KakaoMap companyName={companyName} address={address} />);

    expect(screen.getByText("지도를 불러오는 중입니다")).toBeInTheDocument();
    expect(screen.getByLabelText(`${companyName} 위치 지도`)).toBeInTheDocument();
  });

  it("keeps the full-size overlay transparent to pointer input and restores it on the visible card", () => {
    process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY = "test-key";
    loadKakaoMapSdkMock.mockReturnValue(new Promise(() => undefined));

    render(<KakaoMap companyName={companyName} address={address} />);

    const card = screen.getByText(address).parentElement;
    expect(card).toHaveClass("pointer-events-auto");
    expect(card?.parentElement).toHaveClass("pointer-events-none");
  });

  it("shows a wider map with only a slim branded company overlay after geocoding", async () => {
    process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY = "test-key";
    const maps = createMapsApi();
    loadKakaoMapSdkMock.mockResolvedValue(maps);

    render(<KakaoMap companyName={companyName} address={address} />);

    await waitFor(() => expect(maps.Map).toHaveBeenCalledOnce());

    expect(maps.Map).toHaveBeenCalledWith(expect.any(HTMLElement), {
      center: maps.latLng,
      level: 4,
    });
    expect(maps.LatLng).toHaveBeenCalledWith(37.5, 127);
    expect(maps.Marker).not.toHaveBeenCalled();
    expect(maps.InfoWindow).not.toHaveBeenCalled();
    expect(maps.CustomOverlay).toHaveBeenCalledOnce();
    const overlayOptions = maps.CustomOverlay.mock.calls[0]?.[0];
    expect(overlayOptions).toMatchObject({ map: maps.map, position: maps.latLng, xAnchor: 0.5, yAnchor: 1 });
    expect(overlayOptions?.content).toBeInstanceOf(HTMLElement);
    const overlayContent = overlayOptions?.content as HTMLElement;
    expect(overlayContent).toHaveTextContent(companyName);
    const pin = overlayContent.querySelector<SVGElement>("svg[data-company-map-pin]");
    expect(pin).not.toBeNull();
    expect(pin).toHaveAttribute("viewBox", "0 0 24 32");
    expect(pin?.querySelector("path[data-company-map-pin-shape]")).not.toBeNull();
    expect(pin?.querySelector("circle[data-company-map-pin-center]")).not.toBeNull();
    expect(overlayContent.querySelector("[data-company-map-pin-tip]")).toBeNull();
    expect(overlayContent.querySelector("[data-company-map-label]")).not.toBeNull();
    expect(screen.queryByText(address)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /길찾기/ })).not.toBeInTheDocument();
  });

  it("marks the map container as a labelled region", () => {
    process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY = "test-key";
    loadKakaoMapSdkMock.mockReturnValue(new Promise(() => undefined));

    render(<KakaoMap companyName={companyName} address={address} />);

    expect(screen.getByRole("region", { name: `${companyName} 위치 지도` })).toBeInTheDocument();
  });

  it("does not initialize a map after unmounting before the SDK resolves", async () => {
    process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY = "test-key";
    const maps = createMapsApi();
    let resolveSdk: (maps: ReturnType<typeof createMapsApi>) => void;
    loadKakaoMapSdkMock.mockReturnValue(new Promise((resolve) => {
      resolveSdk = resolve;
    }));

    const { unmount } = render(<KakaoMap companyName={companyName} address={address} />);
    await waitFor(() => expect(loadKakaoMapSdkMock).toHaveBeenCalledOnce());
    unmount();
    resolveSdk!(maps);

    await Promise.resolve();
    expect(maps.Map).not.toHaveBeenCalled();
  });

  it("shows an SDK failure message while keeping the address visible", async () => {
    process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY = "test-key";
    loadKakaoMapSdkMock.mockRejectedValue(new Error("network"));

    render(<KakaoMap companyName={companyName} address={address} />);

    expect(await screen.findByText("지도를 불러오지 못했습니다")).toBeInTheDocument();
    expect(screen.getByText(address)).toBeInTheDocument();
  });

  it("shows an address-search failure message while keeping the address visible", async () => {
    process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY = "test-key";
    const maps = createMapsApi("ZERO_RESULT");
    loadKakaoMapSdkMock.mockResolvedValue(maps);

    render(<KakaoMap companyName={companyName} address={address} />);

    expect(await screen.findByText("주소를 찾지 못했습니다")).toBeInTheDocument();
    expect(screen.getByText(address)).toBeInTheDocument();
  });

  it("shows the address-search fallback for non-finite geocoder coordinates", async () => {
    process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY = "test-key";
    const maps = createMapsApi("OK", [{ x: "not-a-number", y: "37.5" }]);
    loadKakaoMapSdkMock.mockResolvedValue(maps);

    render(<KakaoMap companyName={companyName} address={address} />);

    expect(await screen.findByText("주소를 찾지 못했습니다")).toBeInTheDocument();
    expect(maps.Map).not.toHaveBeenCalled();
    expect(screen.getByText(address)).toBeInTheDocument();
  });

  it("shows the address-search fallback when a map constructor throws", async () => {
    process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY = "test-key";
    const maps = createMapsApi();
    maps.LatLng.mockImplementation(() => {
      throw new Error("constructor failure");
    });
    loadKakaoMapSdkMock.mockResolvedValue(maps);

    render(<KakaoMap companyName={companyName} address={address} />);

    expect(await screen.findByText("주소를 찾지 못했습니다")).toBeInTheDocument();
    expect(screen.getByText(address)).toBeInTheDocument();
  });
});
