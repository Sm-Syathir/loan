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
    node: <Image src="/Mofi.png" alt="MOFI" width={100} height={72} className="h-18" />,
    title: "MOFI",
  },
  {
    node: <Image src="/CIMB-Niaga.svg" alt="CIMB Niaga" width={100} height={40} className="h-10" />,
    title: "CIMB Niaga",
  },
  {
    node: <Image src="/kb-bank.png" alt="KB Bank" width={100} height={40} className="h-10" />,
    title: "KB Bank",
  },
  {
    node: <Image src="/bpr.png" alt="BPR" width={100} height={72} className="h-18" />,
    title: "BPR",
  },
  {
    node: <Image src="/bank-dki.png" alt="Bank DKI" width={100} height={36} className="h-9" />,
    title: "Bank DKI",
  },
  {
    node: <Image src="/mandiri-taspen.png" alt="Mandiri Taspen" width={100} height={72} className="h-18" />,
    title: "Mandiri Taspen",
  },
  {
    node: <Image src="/kredit-plus.webp" alt="Kredit Plus" width={100} height={48} className="h-12" />,
    title: "Kredit Plus",
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