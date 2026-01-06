"use client"

import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"

// types
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
  jaminan?: string   
  statuses: Status[]
}


export default function MonitorStatusKredit() {
  const [items, setItems] = useState<CreditApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: sessionError } =
          await supabase.auth.getSession()

        if (sessionError || !data.session) {
          router.replace("/login")
          return
        }

        const token = data.session.access_token

        const res = await fetch(
          "https://be-loan-production.up.railway.app/credit-applications/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        )

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || "Gagal mengambil data")
        }

        const json = await res.json()

        if (isMounted) {
          setItems(Array.isArray(json.data) ? json.data : [])
        }
      } catch (err: any) {
        console.error("MONITOR FETCH ERROR:", err)
        if (isMounted) {
          setError(err.message || "Terjadi kesalahan")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [router])

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Monitor Status Kredit
        </h1>

        {loading && (
          <p className="text-gray-500">Memuat data...</p>
        )}

        {error && (
          <p className="text-red-500 font-medium">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {items.length === 0 && (
              <p className="text-gray-500">
                Belum ada pengajuan kredit.
              </p>
            )}

            {items.map((it) => {
              const latestStatus =
                it.statuses
                  ?.slice()
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )[0] ?? null

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
                        {latestStatus?.status ?? "-"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    <div>Nama: {it.nama_lengkap}</div>
                    <div>Jenis Kredit: {it.jenis_kredit}</div>
                    <div>
                      Plafond: Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        it.plafond
                      )}
                    </div>
                     <div>Jaminan: {it.jaminan}</div>

                    {latestStatus?.catatan && (
                      <div className="mt-2 text-gray-600">
                        Catatan: {latestStatus.catatan}
                      </div>
                    )}
                  </div>

                  {/* BUTTON DOWNLOAD EXCEL */}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
