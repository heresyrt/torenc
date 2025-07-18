import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      <section id="features" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="사업분야"
            paragraph="지형과 토질을 고려하여 다양한 종류의 옹벽을 설계하고 시공합니다. 또한, 기존 옹벽의 유지보수 및 보강 작업도 수행하며, 필요에 따라 기술 개발이나 자재 납품, 컨설팅 등의 부가적인 사업도 진행합니다."
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
