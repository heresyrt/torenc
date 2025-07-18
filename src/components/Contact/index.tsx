import { Map, MapMarker } from "react-kakao-maps-sdk";
import KakaoMap from "../KakaoMap/KakaoMap";

const Contact = () => {
  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[800px] text-center">
              <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                 오시는 길
              </h1>
              <p className="mb-12 text-base leading-relaxed! text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
                경기도 남양주시 다산순환로 20, 2층 B-C-02-019호 (다산동, 현대프리미어캠퍼스)
              </p>
            </div>
          </div>
        </div>
        <KakaoMap />
      </div>
    </section>
  );
};

export default Contact;
