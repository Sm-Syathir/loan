import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import LogoLoop from "@/components/LogoLoop";
import CallToAction from "@/components/CallAction";
import About from "@/components/About";
import Image from "next/image";

// daftar logo teknologi
const techLogos = [
  {
    node: <img src="under maintencance.png" alt="MOFI" className="h-18" />,
    title: "MOFI",
  },
  {
    node: <img src="under maintencance.png" alt="MOFI" className="h-18" />,
    title: "CIMB Niaga",
  },
  {
    node: <img src="under maintencance.png" alt="MOFI" className="h-18" />,
    title: "KB Bank",
  },  
];

export default function LandingPage() {
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
          pauseOnHover={false}
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