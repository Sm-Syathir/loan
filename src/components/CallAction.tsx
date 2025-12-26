"use client"
import Modal from "@/components/ui/Modal"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { FingerprintIcon } from "lucide-react"

export default function CallToAction() {

  return (
    <section className="w-full py-16 md:py-24 bg-white flex flex-col items-center justify-center text-center px-6">
      {/* Judul */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 md:mb-6">
        Siap mengambil langkah baru?
      </h2>

      {/* Deskripsi */}
      <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl md:max-w-2xl mb-8 md:mb-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
      </p>

      {/* Tombol */}
      <div className="flex gap-4 md:gap-6">
      <Link href={"/register"}>
                    <Button className="rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-6 px-8 text-lg shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform active:scale-95 transition-all duration-150">
                      Daftar Sekarang
                      {/* <div className="ml-2 space-x-1 hidden sm:inline-flex">
                        <FingerprintIcon className="w-5 h-5" />
                      </div> */}
                    </Button>
                  </Link>
      </div>
    </section>
  )
}