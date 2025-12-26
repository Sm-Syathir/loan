import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import LogoLoop from "@/components/LogoLoop";
import CallToAction from "@/components/CallAction";

// import icons dari react-icons
// import {
//   SiReact,
//   SiNextdotjs,
//   SiTypescript,
//   SiTailwindcss,
// } from "react-icons/si";

// daftar logo teknologi
const techLogos = [
  {
    node: <img src="/Mandiri.png" alt="Mandiri Bank" className="h-12" />,
    title: "Mandiri Bank",
  },
  {
    node: <img src="/Mofi.png" alt="MOFI" className="h-12" />,
    title: "MOFI",
  },
   {
    node: <img src="/Bfi.png" alt="BFI Finance" className="h-12" />,
    title: "BFI Finance",
  },
   {
    node: <img src="/Bca.png" alt="Bca" className="h-12" />,
    title: "CIMB Niaga",
  },
];

export default function Home() {
  return (
    <>
    <Navbar />
    <Hero />
    <div className="relative h-[200px] overflow-hidden">
          <LogoLoop
            logos={techLogos}
            speed={120}
            direction="left"
            logoHeight={48}
            width="100%"
            gap={40}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Technology partners"
          />
        </div>
    <ProductSection />
    <CallToAction />
    <Footer />
    </>
  );
}
