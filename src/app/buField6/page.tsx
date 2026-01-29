"use client";

import VideoModal from "@/components/video-modal";
import Image from "next/image";
import { useState } from "react";
import Features from "@/components/BuField6/index";

import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "더오름이앤씨 | 031-869-3453",
//   description: "",
//   // other metadata
// };
const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const BlogDetailsPage = () => {
  const [isOpen, setOpen] = useState(false);
  const List = ({ text }) => (
    <p className="text-body-color mb-5 flex items-center text-lg font-medium">
      <span className="bg-primary/10 text-primary mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
        {checkIcon}
      </span>
      {text}
    </p>
  );
  return (
    <>
      <section className="pt-[150px] pb-[120px]">

        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div>
                <h2 className="mb-8 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight dark:text-white">
                  산석옹벽이란?
                </h2>
                <div>
                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    - 자연 발파석(산석)에 ANCHOR와 STAINLESS WIRE로 고정하여 전도의 위험이 없고 안정적이며 견고한 옹벽의 기능을 수행함과 동시에
                     내구성 및 조경효과를 더하여 훼손된 자연의 생태를 복원하고 미적 경관을 창출하는 옹벽설치 공법입니다.
                  </p>
                </div>
                <h2 className="mb-8 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight dark:text-white">
                  산석 옹벽 장점
                </h2>
                <div>
                  <p className="text-body-color mb-10 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    -자연석.발파석 등을 중력식으로 쌓는 경관옹벽으로, 높은 흙깍기구간에 적용 및 설치놓에에 제한이 없음.<br/>
                    - 기존 선석의 겹침시공에 비해 평면시공으로 미관이 수려하고 자재비가 절감.<br/>
                    - 돌틈식재와 중간 소단에 식재가 가능하여 관광지 경관성 및 미관성 증대.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-4">
                <div className="mx-auto max-w-[770px] overflow-hidden rounded-md">
                  <div className="relative aspect-77/40 items-center justify-center">
                    <Image
                      src="/images/buField/buField6-6.jpg"
                      alt="video image"
                      className="object-cover"
                      fill
                    />
                    <div className="absolute top-0 right-0 flex h-full w-full items-center justify-center">
                      <button
                        aria-label="video play button"
                        onClick={() => setOpen(true)}
                        className="text-primary flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white/75 transition hover:bg-white"
                      >
                        <svg
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                          className="fill-current"
                        >
                          <path d="M15.5 8.13397C16.1667 8.51888 16.1667 9.48112 15.5 9.86602L2 17.6603C1.33333 18.0452 0.499999 17.564 0.499999 16.7942L0.5 1.20577C0.5 0.43597 1.33333 -0.0451549 2 0.339745L15.5 8.13397Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <Features />

      </section>
      
      <VideoModal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        channel="youtube"
        videoId="He2leoOJEug"
      />
    </>
  );
};

export default BlogDetailsPage;
