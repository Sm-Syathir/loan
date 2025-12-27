"use client"

import Navbar, { NavbarHome } from "@/components/NavbarHome";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import LogoLoop from "@/components/LogoLoop";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FingerprintIcon } from "lucide-react";
import Image from "next/image";

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
    <NavbarHome />
    
    <section className="relative pt-38 flex flex-col items-center justify-center text-center px-6 md:px-12 pb-16 md:pb-24">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Heading */}
      <h1 className="text-balance text-3xl font-medium sm:text-4xl md:text-6xl font-extrabold leading-tight">
        Halo 👋 Selamat Datang, <br />
        Firas Prabawa
      </h1>

      {/* Subheading */}
      <p className="text-black mt-4 text-base sm:text-l max-w-2xl">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

      <Link href={"/"}>
                    <Button className="rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-6 px-8 text-lg shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform active:scale-95 transition-all duration-150">
                      Ajukan Pendanaan
                      <div className="ml-2 space-x-1 hidden sm:inline-flex">
                        <FingerprintIcon className="w-5 h-5" />
                      </div>
                    </Button>
                  </Link>

                  <Link href={"/dashboard"}>
                    <Button
                      variant="outline"
                      className="rounded-2xl py-6 px-8 text-lg font-bold shadow-[0_4px_0_0_theme(colors.gray.300),0_8px_20px_theme(colors.gray.300/0.25)] hover:shadow-[0_6px_0_0_theme(colors.gray.400),0_10px_25px_theme(colors.gray.300/0.3)] hover:bg-gray-50 active:shadow-[0_2px_0_0_theme(colors.gray.300),0_4px_10px_theme(colors.gray.300/0.2)] active:translate-y-0.5 transform active:scale-95 transition-all duration-150 dark:shadow-[0_4px_0_0_theme(colors.gray.600),0_8px_20px_theme(colors.gray.700/0.25)] dark:hover:shadow-[0_6px_0_0_theme(colors.gray.500),0_10px_25px_theme(colors.gray.700/0.3)] dark:hover:bg-gray-100"
                    >
                      <div className="mr-1 space-x-1 hidden sm:inline-flex justify-center items-center">
                        <span className="w-5 h-5 text-xs rounded-sm border">
                          ⌘
                        </span>
                        <span className="w-5 h-5 text-xs rounded-sm border">
                          /
                        </span>
                      </div>
                      ke Dashboard
                    </Button>
                  </Link>
      </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Feature cards */}
      <div className="mt-12 max-w-5xl w-full">
        <div className="bg-white rounded-2xl shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {[
            { icon: "coin", title: "Up to 95%", desc: "Tingkat keberhasilan pinjaman" },
            { icon: "chart", title: "Up to Rp1M", desc: "Limit pinjaman maksimum" },
            { icon: "dollar", title: "24 Jam", desc: "Proses pencairan cepat" },
            { icon: "loading", title: "Tanpa Batas", desc: "Fleksibilitas peminjaman" },
          ].map((item, i) => (
            <div key={i} className="p-8 flex flex-col items-center text-center">
              <Image
                src={`/${item.icon}.svg`}
                alt={`${item.title} Icon`}
                width={48}
                height={48}
                className="w-12 h-12 mb-4"
              />
              <h3 className="font-bold text-[#0081FF]">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      </motion.div>
      
    </section>

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
    <Footer />
    </>
  );
}
