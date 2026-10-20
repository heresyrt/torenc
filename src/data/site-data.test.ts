import { describe, expect, it } from "vitest";

import { siteData } from "./site-data";

describe("사이트 데이터", () => {
  it("공식 회사명을 제공한다", () => {
    expect(siteData.company.name).toBe("더오름 이앤씨");
    expect(siteData.company.nameEnglish).toBe("The Oreum E&C");
  });

  it("모든 주요 내비게이션과 섹션을 한국어로 제공한다", () => {
    expect(siteData.navigation.map((item) => item.label)).toEqual([
      "회사 소개",
      "사업 분야",
      "시공 실적",
      "인증현황",
      "오시는 길",
    ]);
    expect(siteData.businesses).toHaveLength(6);
    expect(siteData.projects).toHaveLength(6);
    expect(siteData.certificates).toHaveLength(3);
  });

  it("사업분야마다 고유 상세 경로와 사진 자료를 제공한다", () => {
    expect(siteData.businesses.map((item) => item.slug)).toEqual([
      "tor-self-supporting-wall", "cut-slope-wall", "reinforced-soil-wall",
      "gravity-wall", "landscape-wall", "natural-stone-wall",
    ]);
    for (const item of siteData.businesses) {
      expect(item.overview.length).toBeGreaterThan(0);
      expect(item.detailImages.length).toBeGreaterThan(0);
    }
  });

  it("랜딩페이지 사업분야는 상세 사진이 아닌 전용 대표사진을 사용한다", () => {
    expect(siteData.businesses.map(({ media }) => media.src)).toEqual([
      "/images/business/tor-self-supporting-wall.jpg",
      "/images/business/tor-cut-slope-wall.jpg",
      "/images/business/reinforced-soil-wall.jpg",
      "/images/business/gravity-wall.png",
      "/images/business/landscape-wall.png",
      "/images/business/natural-stone-wall.jpg",
    ]);
  });

  it("중력식은 사진 없이 설치 영역을, 경관은 설명 없는 사진 갤러리를 제공한다", () => {
    const gravityWall = siteData.businesses.find(({ slug }) => slug === "gravity-wall");
    const landscapeWall = siteData.businesses.find(({ slug }) => slug === "landscape-wall");

    expect(gravityWall).toMatchObject({ detailPresentation: "placeholders" });
    expect(gravityWall?.detailImages.map(({ step }) => step)).toEqual([
      "기초 터파기 및 다짐", "기초 블록 설치", "본체 블록 설치",
      "뒷채움 및 배수 시설 설치", "마감블럭 설치", "정리 및 마감",
    ]);
    expect(landscapeWall).toMatchObject({ detailPresentation: "gallery" });
  });

  it("경관 옹벽은 각 사진의 블록 종류와 실제 이미지 확장자를 제공한다", () => {
    const landscapeWall = siteData.businesses.find(({ slug }) => slug === "landscape-wall");

    expect(landscapeWall?.detailImages.map(({ step }) => step)).toEqual([
      "보차도 블록", "보차도 블록", "보차도 블록",
      "조경·토목용 블록", "조경·토목용 블록", "조경·토목용 블록",
      "조경용 블록", "조경용 블록", "조경용 블록", "조경용 블록", "조경용 블록", "조경용 블록",
      "토목용 블록", "토목용 블록", "토목용 블록",
    ]);
    expect(landscapeWall?.detailImages.map((image) => "src" in image ? image.src : undefined)).toEqual([
      "/images/business/details/landscape-wall/image-01.jpg",
      "/images/business/details/landscape-wall/image-02.png",
      "/images/business/details/landscape-wall/image-03.png",
      "/images/business/details/landscape-wall/image-04.png",
      "/images/business/details/landscape-wall/image-05.png",
      "/images/business/details/landscape-wall/image-06.png",
      "/images/business/details/landscape-wall/image-07.png",
      "/images/business/details/landscape-wall/image-08.jpg",
      "/images/business/details/landscape-wall/image-09.png",
      "/images/business/details/landscape-wall/image-10.png",
      "/images/business/details/landscape-wall/image-11.png",
      "/images/business/details/landscape-wall/image-12.png",
      "/images/business/details/landscape-wall/image-13.png",
      "/images/business/details/landscape-wall/image-14.png",
      "/images/business/details/landscape-wall/image-15.jpg",
    ]);
  });

  it("시공실적마다 현장에 맞는 공법명을 제공한다", () => {
    expect(siteData.projects.map(({ title }) => title)).toEqual([
      "거제 상동2지구 현장",
      "정읍 내장산 리조트 현장",
      "화성 석포리 현장",
      "곤지암 한씨주어종중 현장",
      "공주 월송 현장",
      "평택 가재지구 자연석(산석)옹벽",
    ]);
    expect(siteData.projects.map(({ meta }) => meta)).toEqual([
      "TOR 자립식 옹벽",
      "절토부옹벽",
      "절토부옹벽",
      "보강토 옹벽",
      "보강토 옹벽",
      "산석 옹벽",
    ]);
  });

  it("직접 연락할 수 있는 전화번호와 이메일을 제공한다", () => {
    expect(siteData.contact.phoneHref).toBe("tel:031-869-3453");
    expect(siteData.contact.emailHref).toBe("mailto:torenc3453@naver.com");
    expect(siteData.contact.fax).toBe("031-869-3454");
    expect(siteData.contact.address).toContain("다산순환로 20");
  });

  it("이미지 항목에 한국어 대체 텍스트와 크기를 제공한다", () => {
    for (const item of [...siteData.businesses.map(({ media }) => media), ...siteData.projects, ...siteData.certificates]) {
      expect(item.alt).not.toHaveLength(0);
      expect(item.width).toBeGreaterThan(0);
      expect(item.height).toBeGreaterThan(0);
      expect(item.src).toMatch(/^\/images\//);
    }
  });

  it("인증서마다 원본 PDF를 연결한다", () => {
    for (const item of siteData.certificates) expect(item.documentHref).toMatch(/\.pdf$/);
  });
});
