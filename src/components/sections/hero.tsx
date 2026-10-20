import { siteData } from "@/data/site-data";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[var(--navy-950)] pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="absolute -right-32 top-24 size-[32rem] rounded-full border border-white/10" />
      <div className="container-shell relative grid items-end gap-14 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <p className="mb-7 text-sm font-bold tracking-[0.22em] text-[var(--brand-gold-light)]">CIVIL ENGINEERING · CONSTRUCTION</p>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.08] tracking-[-0.055em] sm:text-7xl lg:text-[5.7rem]">
            기술로 세우고,<br /><span className="text-white/35">신뢰로 연결합니다</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/60">{siteData.company.description}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a className="focus-ring bg-[var(--brand-gold)] px-7 py-4 font-bold text-[var(--navy-950)] transition hover:bg-white" href="#business">사업 분야 보기 <span aria-hidden="true">→</span></a>
            <a className="focus-ring border border-white/25 px-7 py-4 font-bold transition hover:bg-white hover:text-[var(--navy-950)]" href="#projects">시공 실적 보기</a>
          </div>
        </div>
        <div className="border-l border-white/15 pl-6 lg:mb-2">
          <p className="text-xs tracking-[0.2em] text-white/35">OUR STANDARD</p>
          <p className="mt-4 text-xl font-bold leading-8">안전과 품질을 타협하지 않는<br />현장 중심의 엔지니어링</p>
          <div className="mt-8 h-1 w-24 bg-[var(--brand-gold)]" />
        </div>
      </div>
    </section>
  );
}
