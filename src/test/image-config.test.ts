import { describe, expect, it } from "vitest";
import sharp from "sharp";

import nextConfig from "../../next.config";

const businessImages = [
  "public/images/business/tor-self-supporting-wall.jpg",
  "public/images/business/tor-cut-slope-wall.jpg",
  "public/images/business/reinforced-soil-wall.jpg",
];

describe("이미지 최적화 설정", () => {
  it("실기기 개발 테스트에 사용하는 Mac 네트워크 주소를 허용한다", () => {
    expect(nextConfig.allowedDevOrigins).toEqual(
      expect.arrayContaining(["macbook", "macbook.local", "192.168.0.160"]),
    );
  });

  it("컴포넌트에서 사용하는 이미지 품질값을 허용한다", () => {
    expect(nextConfig.images?.qualities).toEqual(expect.arrayContaining([90, 95]));
  });

  it("사업분야 JPG를 모바일 전송에 적합한 크기로 준비한다", async () => {
    for (const image of businessImages) {
      const metadata = await sharp(image).metadata();
      expect(metadata.width).toBeLessThanOrEqual(2400);
      expect(metadata.height).toBeLessThanOrEqual(2400);
    }
  });

  it("투명 배경에서 심볼을 파비콘 영역에 크게 표시한다", async () => {
    const icon = sharp("src/app/icon.png");
    const metadata = await icon.metadata();

    expect(metadata.width).toBe(512);
    expect(metadata.height).toBe(512);
    expect(metadata.hasAlpha).toBe(true);

    const { data, info } = await icon.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let minX = info.width;
    let minY = info.height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < info.height; y += 1) {
      for (let x = 0; x < info.width; x += 1) {
        if (data[(y * info.width + x) * info.channels + 3] > 8) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    expect(maxX - minX + 1).toBeGreaterThanOrEqual(470);
    expect(maxY - minY + 1).toBeGreaterThanOrEqual(340);
  });
});
