declare global {
  interface KakaoMapOptions {
    center: KakaoLatLng;
    level: number;
  }

  interface KakaoMarkerOptions {
    map?: KakaoMap;
    position: KakaoLatLng;
  }

  interface KakaoInfoWindowOptions {
    content: string | HTMLElement;
  }

  interface KakaoCustomOverlayOptions {
    map?: KakaoMap;
    position: KakaoLatLng;
    content: string | HTMLElement;
    xAnchor?: number;
    yAnchor?: number;
  }

  interface KakaoAddressResult {
    x: string;
    y: string;
  }

  interface KakaoMap {
    setCenter(position: KakaoLatLng): void;
  }

  type KakaoLatLng = object;

  type KakaoMarker = object;

  interface KakaoInfoWindow {
    open(map: KakaoMap, marker: KakaoMarker): void;
  }

  interface KakaoGeocoder {
    addressSearch(
      address: string,
      callback: (result: KakaoAddressResult[], status: string) => void,
    ): void;
  }

  interface KakaoMapsApi {
    Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
    LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
    Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
    InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindow;
    CustomOverlay: new (options: KakaoCustomOverlayOptions) => object;
    load(callback: () => void): void;
    services: {
      Geocoder: new () => KakaoGeocoder;
      Status: {
        OK: string;
      };
    };
  }

  interface Window {
    kakao?: {
      maps?: KakaoMapsApi;
    };
  }
}

export {};
