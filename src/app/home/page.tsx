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
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// daftar logo teknologi
const techLogos = [
  {
    node: <img src="Satufin.png" alt="MOFI" className="h-18" />,
    title: "MOFI",
  },
  {
    node: <img src="Satufin.png" alt="MOFI" className="h-18" />,
    title: "CIMB Niaga",
  },
  {
    node: <img src="Satufin.png" alt="MOFI" className="h-18" />,
    title: "KB Bank",
  },  
];

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const router = useRouter()
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("token")

        if (!token) {
          router.replace("/login")
          return
        }

        const res = await fetch(
          "https://satufin.satufin.id/api/v1/auth/me",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        )

        if (!res.ok) {
          // Handle token expired / unauthorized
          if (res.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            router.replace("/login")
            return
          }
          throw new Error(`Gagal mengambil data user: ${res.statusText}`)
        }

        const result = await res.json()
        
        if (result.success && result.data) {
          setUserName(result.data.name || "User")
          // Optional: simpan data user di localStorage
          localStorage.setItem("user", JSON.stringify(result.data))
        } else {
          throw new Error(result.message || "Gagal mendapatkan data user")
        }

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <NavbarHome />
      
      <section className="relative pt-38 flex flex-col items-center justify-center text-center px-6 md:px-12 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
         <h1 className="text-balance text-3xl font-medium sm:text-4xl md:text-6xl font-extrabold leading-tight">
          Halo 👋 Selamat Datang, <br/>
          <span className="text-black">{userName || "User"}</span>
        </h1>

        <p className="text-black mt-4 text-base sm:text-l max-w-2xl">
          Ayo {userName || "User"}, ambil langkah cerdas untuk tujuan Anda!
        </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href={"/home/credit-form"}>
              <Button className="rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-6 px-8 text-lg shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform active:scale-95 transition-all duration-150">
                Ajukan Pendanaan
                <div className="ml-2 space-x-1 hidden sm:inline-flex">
                  <FingerprintIcon className="w-5 h-5" />
                </div>
              </Button>
            </Link>

            <Link href={"/monitor-status-kredit"}>
              <Button
                variant="outline"
                className="rounded-2xl py-6 px-8 text-lg font-bold shadow-[0_4px_0_0_theme(colors.gray.300),0_8px_20px_theme(colors.gray.300/0.25)] hover:shadow-[0_6px_0_0_theme(colors.gray.400),0_10px_25px_theme(colors.gray.300/0.3)] hover:bg-gray-50 active:shadow-[0_2px_0_0_theme(colors.gray.300),0_4px_10px_theme(colors.gray.300/0.2)] active:translate-y-0.5 transform active:scale-95 transition-all duration-150 dark:shadow-[0_4px_0_0_theme(colors.gray.600),0_8px_20px_theme(colors.gray.700/0.25)] dark:hover:shadow-[0_6px_0_0_theme(colors.gray.500),0_10px_25px_theme(colors.gray.700/0.3)] dark:hover:bg-gray-100"
              >
                Monitor Status
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="mt-12 max-w-5xl w-full">
            <div className="bg-white rounded-2xl shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
              {[
                { icon: "coin", title: "Up to 80 Mio", desc: "Jumlah Insetif yang Dibayarkan" },
                { icon: "chart", title: "4 +", desc: "Jumlah Customer yang Terbantu" },
                { icon: "dollar", title: "Up to 5 Bio", desc: "Jumlah Pinjaman yang Tersalurkan" },
                { icon: "loading", title: "8 +", desc: "Mitra Lembaga Partner" },
              ].map((item, i) => (
                <div key={i} className="p-8 flex flex-col items-center text-center">
                  <Image
                    src={`/${item.icon}.svg`}
                    alt={`${item.title} Icon`}
                    width={48}
                    height={48}
                    className="w-12 h-12 mb-4"
                  />
                  <h2 className="font-bold text-[#0081FF]">{item.title}</h2>
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
          pauseOnHover={false}
          fadeOutColor="#ffffff"
          ariaLabel="Technology partners"
        />
      </div>
      
      <ProductSection />
      <span className="block h-32"></span>
      <Footer />
    </>
  );
}
