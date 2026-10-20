import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { About } from "@/components/sections/about";
import { Business } from "@/components/sections/business";
import { Certificates } from "@/components/sections/certificates";
import { ContactCta } from "@/components/sections/contact-cta";
import { Hero } from "@/components/sections/hero";
import { Location } from "@/components/sections/location";
import { Projects } from "@/components/sections/projects";
import { Reveal } from "@/components/ui/reveal";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Reveal><About /></Reveal>
        <Reveal><Business /></Reveal>
        <Reveal><Projects /></Reveal>
        <Reveal><Certificates /></Reveal>
        <Reveal><Location /></Reveal>
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
