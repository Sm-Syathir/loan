"use client"
import { useState } from "react"
import Link from "next/link"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function Modal({ isOpen, onClose }: ModalProps) {
  const [showResult, setShowResult] = useState(false)
  const [formData, setFormData] = useState({
    produkPinjaman: "Pinjaman Modal Kerja",
    pekerjaan: "Saya Wiraswasta/Pengusaha",
    pendapatanBulanan: "",
  })

  if (!isOpen) return null

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl relative p-8 md:p-10 overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#0081FF] mb-4 sm:mb-6">
          Self Assessment
        </h2>

        {/* Form - Two dropdowns side by side, then one input below */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
          {/* Bottom Field - Full Width Input */}
<div>
            <label className="block text-sm mb-2.5">
              Jumlam Pinjaman yang diinginkan (Rp)
            </label>
            <input
              type="text"
              value={formData.pendapatanBulanan}
              onChange={(e) => handleInputChange("pendapatanBulanan", e.target.value)}
              placeholder="Contoh: 50.000.000"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 sm:px-4 sm:py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfe1ff] transition"
            />
          </div>
          {/* Top Row - Two Dropdowns Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Produk Pinjaman */}
            <div>
              <label className="block text-sm mb-2.5">
                Produk Pinjaman
              </label>
              <select
                value={formData.produkPinjaman}
                onChange={(e) => handleInputChange("produkPinjaman", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 sm:px-4 sm:py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfe1ff] transition appearance-none"
              >
                <option value="Pinjaman Modal Kerja">Pinjaman Modal Kerja</option>
                <option value="Pinjaman Investasi">Pinjaman Investasi</option>
                <option value="Pinjaman Konsumtif">Pinjaman Konsumtif</option>
              </select>
            </div>

            {/* Pekerjaan */}
            <div>
              <label className="block text-sm mb-2.5">
                Pekerjaan
              </label>
              <select
                value={formData.pekerjaan}
                onChange={(e) => handleInputChange("pekerjaan", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 sm:px-4 sm:py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfe1ff] transition appearance-none"
              >
                <option value="Saya Wiraswasta/Pengusaha">Saya Wiraswasta/Pengusaha</option>
                <option value="Karyawan Swasta">Karyawan Swasta</option>
                <option value="Pegawai Negeri Sipil">Pegawai Negeri Sipil</option>
                <option value="Profesional">Profesional</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Bottom Field - Full Width Input */}
          <div>
            <label className="block text-sm mb-2.5">
              Pendapatan Bulanan (Rp)
            </label>
            <input
              type="text"
              value={formData.pendapatanBulanan}
              onChange={(e) => handleInputChange("pendapatanBulanan", e.target.value)}
              placeholder="Contoh: 50.000.000"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 sm:px-4 sm:py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfe1ff] transition"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => setShowResult(true)}
          className="mt-8 w-full rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg shadow-lg transition-all duration-200"
        >
          Lihat Estimasi Pinjaman
        </button>

        {/* Result */}
        {showResult && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 mb-2">
              Estimasi pinjaman yang bisa Anda dapatkan:
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">Rp 0</p>
            <p className="text-gray-400 text-sm mb-4">Profil Risiko: Medium Risk</p>
            <p className="mt-2 text-sm text-gray-400 mb-6">
              Jika sesuai dengan estimasi Anda, silahkan lanjutkan dengan registrasi.
            </p>
            <Link href="/register" className="w-full">
              <span className="block bg-gray-700 py-3 rounded-lg font-semibold text-white hover:bg-gray-600 transition text-center">
                Lanjutkan dengan Registrasi
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
