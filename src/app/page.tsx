import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import LogoLoop from "@/components/LogoLoop";
import CallToAction from "@/components/CallAction";
import About from "@/components/About";
import GradientBackground from "@/components/Background";

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
    node: <img src="under maintencance.png" alt="MOFI" className="h-18" />,
    title: "MOFI",
  },
   {
    node: <img src="/under maintencance.png" alt="CIMB Niaga" className="h-18" />,
    title: "CIMB Niaga",
  },
   {
    node: <img src="/under maintencance.png" alt="KB Bank" className="h-18" />,
    title: "KB Bank",
  },  
];

export default function LandingPage() {
  return (
    <>
    {/* <GradientBackground/> */}
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
            pauseOnHover={false}
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Technology partners"
          />
        </div>
    <About />
    <ProductSection />
    <CallToAction />
    <Footer />
    </>
  );
}
