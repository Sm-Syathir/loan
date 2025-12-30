"use client"

import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"

/* ======================
   TYPES
====================== */

type Status = {
  status: "DIAJUKAN" | "DIPROSES" | "DITERIMA" | "DITOLAK"
  catatan?: string | null
  created_at: string
}

type CreditApplication = {
  kode_pengajuan: string
  nama_lengkap: string
  jenis_kredit: string
  plafond: number
  statuses: Status[]
}

/* ======================
   PAGE
====================== */

export default function MonitorStatusKredit() {
  const [items, setItems] = useState<CreditApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.replace("/login")
          return
        }

        // 2️⃣ fetch ke BACKEND (port 4000)
        const res = await fetch(
          "http://localhost:4000/credit-applications",
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        )

        const json = await res.json()

        if (!res.ok) {
          throw new Error(json.message || "Gagal mengambil data")
        }

        setItems(json.data ?? [])
      } catch (err: any) {
        console.error("MONITOR FETCH ERROR:", err)
        setError(err.message ?? "Terjadi kesalahan")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="p-6 lg:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            Monitor Status Kredit
          </h1>

          {/* Loading */}
          {loading && <p>Memuat...</p>}

          {/* Error */}
          {error && (
            <p className="text-red-500 font-medium">
              {error}
            </p>
          )}

          {/* Content */}
          {!loading && !error && (
            <div className="space-y-4">
              {items.length === 0 && (
                <p className="text-gray-500">
                  Belum ada pengajuan kredit.
                </p>
              )}

              {items.map((it) => {
                const latestStatus =
                  it.statuses.length > 0
                    ? it.statuses[0]
                    : null

                return (
                  <div
                    key={it.kode_pengajuan}
                    className="border rounded-xl p-4 shadow-sm bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-500">
                          Kode Pengajuan
                        </div>
                        <div className="text-lg font-semibold">
                          {it.kode_pengajuan}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Status Terakhir
                        </div>
                        <div className="font-semibold">
                          {latestStatus?.status ?? "—"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-700 space-y-1">
                      <div>Nama: {it.nama_lengkap}</div>
                      <div>
                        Jenis Kredit: {it.jenis_kredit}
                      </div>
                      <div>
                        Plafond:{" "}
                        {new Intl.NumberFormat("id-ID").format(
                          it.plafond
                        )}
                      </div>

                      {latestStatus?.catatan && (
                        <div className="mt-2 text-gray-600">
                          Catatan: {latestStatus.catatan}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
