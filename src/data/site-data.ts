import type { SiteData } from "@/types/site";

const detailImages = (slug: string, steps: string[], extensions: string[], fit: "cover" | "contain" = "cover") => steps.map((step, index) => ({
  id: `${slug}-${index + 1}`,
  step,
  title: step,
  description: "",
  alt: `${step} 공정 사진`,
  width: 1600,
  height: 1200,
  src: `/images/business/details/${slug}/image-${String(index + 1).padStart(2, "0")}.${extensions[index] ?? "jpg"}`,
  fit,
}));

const detailPlaceholders = (slug: string, steps: string[]) => steps.map((step, index) => ({
  id: `${slug}-${index + 1}`,
  step,
  title: step,
  description: "",
  alt: "",
  width: 1600,
  height: 1200,
  fit: "cover" as const,
}));

export const siteData = {
  company: {
    name: "더오름 이앤씨",
    nameEnglish: "The Oreum E&C",
    tagline: "기술로 세우고, 신뢰로 연결합니다",
    description:
      "토지의 안정성을 확보하고 주변 환경과 조화를 이루는 옹벽 구조물을 설계, 시공, 유지보수하는 전문 기업으로, 다양한 옹벽 종류와 공법에 대한 전문적인 기술과 노하우를 바탕으로 사업을 영위합니다.",
    registrationNumber: "",
  },
  navigation: [
    { label: "회사 소개", href: "/#about" },
    { label: "사업 분야", href: "/#business" },
    { label: "시공 실적", href: "/#projects" },
    { label: "인증현황", href: "/#certificates" },
    { label: "오시는 길", href: "/#location" },
  ],
  businesses: [
    {
      number: "01",
      slug: "tor-self-supporting-wall",
      title: "TOR 자립식 옹벽",
      description: "TOR 자립식옹벽은 협소한 공간에서도 구조적으로 안전한 시공이 가능하고 경제성과 시공성을 동시에 충족하는 옹벽시스템입니다.",
      media: { id: "business-01", title: "TOR 자립식 옹벽", description: "", alt: "TOR 자립식 옹벽 시공 사례", width: 2400, height: 1351, src: "/images/business/tor-self-supporting-wall.jpg" },
      overview: ["타인의 토지를 침범하지 않으면서 용지 경계 지역에 인접하여 옹벽을 시공 할 수 있는 공법", "연직형 지중삽입체(H-Pile)에 프리캐스트 패널을 설치하고 H-Pile파일을 보강하여 지지력이 보강되도록 함으로서 옹벽의 내구성 및 안정성을 향상시킨 옹벽", "굴착면에 위치한 H-Pile을 보강하여 토압에 충분히 견딜 수 있는 H-Pile 변위 저항 구조"],
      detailSectionTitle: "설치 순서",
      detailImages: detailImages("tor-self-supporting-wall", ["장비 작업로 개설", "선형 측량 및 천공", "H-Pile 근입 후 속채움 콘크리트 타설", "계획 터파기 및 토류판 설치", "형강 및 PC패널 설치", "설치마감"], ["jpg", "jpg", "jpg", "jpg", "jpg", "jpg"]),
    },
    {
      number: "02",
      slug: "cut-slope-wall",
      title: "절토부옹벽",
      description: "보강재(철근 또는 네일)를 원지반에 삽입, 그라우팅에 의해 지반과 일체화하고 숏크리트, PC패널 등으로 절토면을 보호하는 표면보호공을 시공하는 비탈면 안정화 공법입니다.",
      media: { id: "business-02", title: "절토부옹벽", description: "", alt: "절토부 옹벽 시공 사례", width: 2400, height: 1351, src: "/images/business/tor-cut-slope-wall.jpg" },
      overview: ["원지반을 보강하여 전단강도증가 → 안정성 확보", "공종단순, 시공관리 간편 → 공기단축", "기성제작 패널 사용으로 동절기 시공 가능"],
      detailSectionTitle: "설치 순서",
      detailImages: detailImages("cut-slope-wall", ["지반굴착", "천공 및 네일링 삽입", "그라우팅", "기초블럭 및 배수시설 설치", "PC패널 설치", "설치마감"], ["jpeg", "jpg", "jpg", "jpg", "jpg", "jpg"]),
    },
    {
      number: "03",
      slug: "reinforced-soil-wall",
      title: "보강토 옹벽",
      description: "보강토 옹벽은 토양과 보강재가 일체화되어 안정성을 높이고, 다양한 지형에 적용할 수 있는 경제적인 옹벽 시스템입니다.",
      media: { id: "business-03", title: "보강토 옹벽", description: "", alt: "보강토 옹벽 시공 사례", width: 2400, height: 1800, src: "/images/business/reinforced-soil-wall.jpg" },
      overview: ["보강토 옹벽은 흙 속에 보강재를 넣어 흙의 전단 강도를 증가시켜 옹벽과 같은 구조물을 만드는 기술 또는 그 구조물을 의미 합니다.", "수직에 가까운 벽면을 만들수 있어 좁은 공간에도 효율적으로 활용 가능합니다.", "다양한 형태와 높이의 옹벽을 만들 수 있습니다."],
      detailSectionTitle: "설치 순서",
      detailImages: detailImages("reinforced-soil-wall", ["기초 터파기 및 다짐", "기초 콘크리트 타설", "보강토 블록 설치", "보강재 설치 및 뒷채움 흙 포설", "다짐", "설치마감"], ["jpg", "jpg", "jpg", "jpg", "jpg", "jpg"]),
    },
    {
      number: "04",
      slug: "gravity-wall",
      title: "중력식 옹벽",
      description: "중력식 옹벽은 중력에 의한 안정성을 이용하여 시공이 간편하고, 다양한 환경에서 적용 가능한 전통적인 옹벽 시스템입니다.",
      media: { id: "business-04", title: "중력식 옹벽", description: "", alt: "중력식 옹벽 시공 사례", width: 765, height: 611, src: "/images/business/gravity-wall.png" },
      overview: ["옹벽 자체의 무게와 토압의 합력이 바닥면에 작용하여 옹벽자체의 중량과 무게로 흙이 흘러내리는 것을 막을 수 있도록 만든 옹벽 구조물", "조립식 공법으로 공종이 단순하여 시공속도가 빠름.", "그리드 없이 높이 5M까지 시공이 가능함.", "자연석과 같은 질감과 색상으로 경관이 매우 우수함"], detailSectionTitle: "설치 순서",
      detailPresentation: "placeholders",
      detailImages: detailPlaceholders("gravity-wall", ["기초 터파기 및 다짐", "기초 블록 설치", "본체 블록 설치", "뒷채움 및 배수 시설 설치", "마감블럭 설치", "정리 및 마감"]),
    },
    {
      number: "05",
      slug: "landscape-wall",
      title: "경관 옹벽",
      description: "경관 옹벽은 미적 요소를 강조하여 자연 환경과 조화를 이루며, 도시 경관을 개선하는 동시에 기능성을 갖춘 옹벽 시스템입니다.",
      media: { id: "business-05", title: "경관 옹벽", description: "", alt: "경관 옹벽 블록 사례", width: 812, height: 590, src: "/images/business/landscape-wall.png" },
      overview: ["다양한 색상, 질감, 형태의 블록이나 마감재를 사용하여 주변 환경과 조화롭게 디자인됩니다.", "중력식, 보강토식 등 다양한 공법을 활용하여 안정성을 확보합니다.", "옹벽의 기본적인 기능인 토압 지지 및 붕괴 방지 외에, 배수 기능이나 식생 기능 등을 추가하여 효율성을 높이기도 합니다.", "조립식 시공이 가능하여 공사 기간을 단축하고, 시공성을 높이는 경우도 있습니다.", "아파트 단지나 택지 개발 지역에서 미관을 중요하게 고려하여 설치되는 옹벽은 대부분 경관옹벽의 형태를 띕니다.", "자연석 질감의 블록이나 친환경적인 공법을 사용하여 주변 자연환경과 어울리도록 디자인된 옹벽도 경관옹벽에 해당됩니다."], detailSectionTitle: "경관 옹벽 종류",
      detailPresentation: "gallery",
      detailImages: detailImages("landscape-wall", ["보차도 블록", "보차도 블록", "보차도 블록", "조경·토목용 블록", "조경·토목용 블록", "조경·토목용 블록", "조경용 블록", "조경용 블록", "조경용 블록", "조경용 블록", "조경용 블록", "조경용 블록", "토목용 블록", "토목용 블록", "토목용 블록"], ["jpg", "png", "png", "png", "png", "png", "png", "jpg", "png", "png", "png", "png", "png", "png", "jpg"], "contain"),
    },
    {
      number: "06",
      slug: "natural-stone-wall",
      title: "산석 옹벽",
      description: "자연 발파석(산석)에 ANCHOR와 STAINLESS WIRE로 고정하여 전도의 위험이 없고 안정적이며 견고한 옹벽의 기능을 수행함과 동시에 내구성 및 조경효과를 더하여 훼손된 자연의 생태를 복원하고 미적 경관을 창출하는 옹벽설치 공법입니다.",
      media: { id: "business-06", title: "산석 옹벽", description: "", alt: "산석 옹벽 시공 사례", width: 2400, height: 1800, src: "/images/business/natural-stone-wall.jpg" },
      overview: ["자연 발파석(산석)에 ANCHOR와 STAINLESS WIRE로 고정하여 전도의 위험이 없고 안정적이며 견고한 옹벽의 기능을 수행함과 동시에 내구성 및 조경효과를 더하여 훼손된 자연의 생태를 복원하고 미적 경관을 창출하는 옹벽설치 공법입니다.", "자연석·발파석 등을 중력식으로 쌓는 경관옹벽으로, 높은 흙깎기구간에 적용 및 설치높이에 제한이 없음.", "기존 선석의 겹침시공에 비해 평면시공으로 미관이 수려하고 자재비가 절감.", "돌틈식재와 중간 소단에 식재가 가능하여 관광지 경관성 및 미관성 증대."], detailSectionTitle: "설치 순서",
      detailImages: detailImages("natural-stone-wall", ["사면천공", "기초 콘크리트 타설", "배수관 및 서스펜션 철근 설치", "하단 뒷채움 및 빔 설치", "상단쌓기", "식재·사면공 완료 및 마감"], ["png", "png", "jpg", "jpg", "jpg", "jpg"]),
    },
  ],
  projects: [
    {
      id: "project-01",
      title: "거제 상동2지구 현장",
      description: "거제 상동2지구 옹벽 시공 현장",
      alt: "거제 상동2지구 옹벽 시공 현장",
      width: 2400, height: 1351, src: "/images/projects/geoje-sangdong-2.jpg", meta: "TOR 자립식 옹벽",
    },
    {
      id: "project-02",
      title: "정읍 내장산 리조트 현장", description: "정읍 내장산 리조트 옹벽 시공 현장", alt: "정읍 내장산 리조트 옹벽 시공 현장",
      width: 1280, height: 960, src: "/images/projects/jeongeup-naejangsan-resort.jpg", meta: "절토부옹벽",
    },
    {
      id: "project-06", title: "화성 석포리 현장", description: "화성 석포리 절토부옹벽 시공 현장", alt: "화성 석포리 절토부옹벽 시공 현장",
      width: 4032, height: 3024, src: "/images/projects/hwaseong-seokpo-ri.jpg", meta: "절토부옹벽",
    },
    {
      id: "project-03",
      title: "곤지암 한씨주어종중 현장", description: "곤지암 한씨주어종중 옹벽 시공 현장", alt: "곤지암 한씨주어종중 옹벽 시공 현장",
      width: 2400, height: 1800, src: "/images/projects/gonjiam-han-clan.jpg", meta: "보강토 옹벽",
    },
    {
      id: "project-04", title: "공주 월송 현장", description: "공주 월송 옹벽 시공 현장", alt: "공주 월송 옹벽 시공 현장",
      width: 1800, height: 2400, src: "/images/projects/gongju-wolsong.jpg", meta: "보강토 옹벽",
    },
    {
      id: "project-05", title: "평택 가재지구 자연석(산석)옹벽", description: "평택 가재지구 자연석(산석)옹벽 시공 현장", alt: "평택 가재지구 자연석 산석 옹벽 시공 현장",
      width: 2400, height: 1800, src: "/images/projects/pyeongtaek-gajae-stone-wall.jpg", meta: "산석 옹벽",
    },
  ],
  certificates: [
    {
      id: "certificate-01",
      title: "결속구 디자인등록증", description: "H형강과 패널의 결속구 디자인등록", alt: "결속구 디자인등록증",
      width: 1654, height: 2339, src: "/images/certificates/h-beam-fastener-design-registration.png", meta: "등록 제30-1304722호", documentHref: "/documents/certificates/h-beam-fastener-design-registration.pdf",
    },
    {
      id: "certificate-02",
      title: "조립식옹벽패널 디자인등록증", description: "조립식 옹벽 패널 디자인등록", alt: "조립식옹벽패널 디자인등록증",
      width: 1654, height: 2339, src: "/images/certificates/prefabricated-wall-panel-design-registration.png", meta: "등록 제30-1332169호", documentHref: "/documents/certificates/prefabricated-wall-panel-design-registration.pdf",
    },
    {
      id: "certificate-03",
      title: "자립식 옹벽 특허증", description: "자립식 옹벽 구조 및 시공 기술 특허", alt: "자립식 옹벽 특허증",
      width: 1654, height: 2339, src: "/images/certificates/self-supporting-wall-patent.png", meta: "특허 제10-2890118호", documentHref: "/documents/certificates/self-supporting-wall-patent.pdf",
    },
  ],
  contact: {
    phone: "031-869-3453",
    phoneHref: "tel:031-869-3453",
    fax: "031-869-3454",
    email: "torenc3453@naver.com",
    emailHref: "mailto:torenc3453@naver.com",
    address: "경기도 남양주시 다산순환로 20, 2층 B-C-02-019호 (다산동, 현대프리미어캠퍼스)",
    businessHours: "평일 09:00–18:00 · 주말 및 공휴일 휴무",
  },
} satisfies SiteData;
