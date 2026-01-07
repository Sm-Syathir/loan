"use client"

import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Download } from "lucide-react"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"



// Helper format tanggal + jam
const formatDateTime = (isoString?: string) => {
  if (!isoString) return "-"
  const date = new Date(isoString)
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

// FORMAT TIMELINE


// Timeline components
const TimelineItem = ({
  title,
  time,
  active = false,
  danger = false,
}: {
  title: string
  time?: string
  active?: boolean
  danger?: boolean
}) => (
  <div className="flex flex-col items-center text-center w-24">
    <div
      className={`w-4 h-4 rounded-full mb-2 ${danger ? "bg-red-500" : active ? "bg-blue-500" : "bg-gray-300"
        }`}
    />
    <div className="text-xs font-semibold">{title}</div>
    <div className="text-[10px] text-gray-500 mt-1">{time || "-"}</div>
  </div>
)

const TimelineLine = ({ active = false }: { active?: boolean }) => (
  <div className={`flex-1 h-0.5 mt-2 ${active ? "bg-blue-500" : "bg-gray-300"}`} />
)

// Types
type Status = {
  status: "DIAJUKAN" | "DIPROSES" | "DITERIMA" | "DITOLAK"
  catatan?: string | null
  created_at: string
}

type CreditApplication = {
  kode_pengajuan: string
  nama_lengkap: string
  jenis_kredit: string
  plafond: string | number
  jaminan?: string
  statuses: Status[]
}

// Main Component
export default function MonitorStatusKredit() {
  const [items, setItems] = useState<CreditApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openMap, setOpenMap] = useState<{ [key: string]: boolean }>({})

  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: sessionError } = await supabase.auth.getSession()

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

  const toggleOpen = (kode: string) => {
    setOpenMap((prev) => ({ ...prev, [kode]: !prev[kode] }))
  }

  const handleDownload = async (item: CreditApplication) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Pengajuan Kredit")

    const applyBorder = (cell: ExcelJS.Cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    }

    // HEADER ATAS
    worksheet.mergeCells("A1:B1")
    worksheet.mergeCells("C1:E1")
    worksheet.mergeCells("F1:G1")
    worksheet.mergeCells("H1:J1")

    worksheet.getCell("A1").value = "DATA NASABAH"
    worksheet.getCell("C1").value = "DATA KREDIT"
    worksheet.getCell("F1").value = "STATUS"
    worksheet.getCell("H1").value = "WAKTU"

    // HEADER BAWAH
    worksheet.getRow(2).values = [
      "Kode Pengajuan",
      "Nama Lengkap",
      "Jenis Kredit",
      "Plafond",
      "Jaminan",
      "Status Terakhir",
      "Catatan",
      "Tanggal Pengajuan",
      "Tanggal Diproses",
      "Tanggal Hasil",
    ]

      ;[1, 2].forEach((row) => {
        worksheet.getRow(row).eachCell((cell) => {
          cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
          cell.alignment = { horizontal: "center", vertical: "middle" }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF2563EB" },
          }
          applyBorder(cell)
        })
      })

    const latestStatus =
      item.statuses
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )[0] ?? null

    const row = worksheet.addRow([
      item.kode_pengajuan,
      item.nama_lengkap,
      item.jenis_kredit,
      Number(item.plafond),
      item.jaminan ?? "-",
      latestStatus?.status ?? "-",
      latestStatus?.catatan ?? "-",
      formatDateTime(
        item.statuses.find((s) => s.status === "DIAJUKAN")?.created_at
      ),
      formatDateTime(
        item.statuses.find((s) => s.status === "DIPROSES")?.created_at
      ),
      formatDateTime(
        item.statuses.find(
          (s) => s.status === "DITERIMA" || s.status === "DITOLAK"
        )?.created_at
      ),
    ])

    row.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" }
      applyBorder(cell)
    })

    if (latestStatus?.status === "DITOLAK") {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFECACA" },
        }
        cell.font = { color: { argb: "FF991B1B" } }
      })
    }

    row.getCell(4).numFmt = '"Rp" #,##0'

    worksheet.columns.forEach((col, colIndex) => {
      let maxLength = 12

      worksheet.eachRow({ includeEmpty: true }, (row) => {
        const cell = row.getCell(colIndex + 1)
        const value = cell.value ? String(cell.value) : ""
        maxLength = Math.max(maxLength, value.length)
      })

      col.width = maxLength + 2
    })



    worksheet.views = [{ state: "frozen", ySplit: 2 }]

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(
      new Blob([buffer]),
      "Pengajuan Peminjaman Satufin.xlsx"
    )
  }







  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Monitor Status Kredit</h1>

        {loading && <p className="text-gray-500">Memuat data...</p>}

        {error && <p className="text-red-500 font-medium">{error}</p>}

        {!loading && !error && (
          <div className="space-y-4">
            {items.length === 0 && <p className="text-gray-500">Belum ada pengajuan kredit.</p>}

            {items.map((it) => {
              const latestStatus =
                it.statuses?.slice().sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )[0] ?? null

              const open = openMap[it.kode_pengajuan] || false

              // Ambil waktu setiap step dari statuses dan format tanggal+jam
              const waktuPengajuan = formatDateTime(
                it.statuses.find((s) => s.status === "DIAJUKAN")?.created_at
              )
              const waktuProses = formatDateTime(
                it.statuses.find((s) => s.status === "DIPROSES")?.created_at
              )
              const waktuHasil = formatDateTime(
                it.statuses.find(
                  (s) => s.status === "DITERIMA" || s.status === "DITOLAK"
                )?.created_at
              )

              return (
                <div key={it.kode_pengajuan} className="border rounded-xl p-4 shadow-sm bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-500">Kode Pengajuan</div>
                      <div className="text-lg font-semibold">{it.kode_pengajuan}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500">Status Terakhir</div>
                      <div className="font-semibold">{latestStatus?.status ?? "-"}</div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    <div>Nama: {it.nama_lengkap}</div>
                    <div>Jenis Kredit: {it.jenis_kredit}</div>
                    <div>
                      Plafond: Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(Number(it.plafond))}
                    </div>
                    <div>Jaminan: {it.jaminan}</div>

                    {latestStatus?.catatan && (
                      <div className="mt-2 text-gray-600">Catatan: {latestStatus.catatan}</div>
                    )}
                  </div>

                  {/* BUTTON DOWNLOAD EXCEL */}
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => handleDownload(it)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow cursor-pointer hover:bg-blue-700 transition"
                    >
                      <Download size={16} />
                      Download
                    </button>

                  </div>

                  {/* BUTTON SHOW MORE */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => toggleOpen(it.kode_pengajuan)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
                    >
                      {open ? (
                        <>
                          Show Less <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          Show More <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 mt-4" : "max-h-0"
                      }`}
                  >
                    {/* Timeline */}
                    <h3 className="text-center items-center mb-6 font-semibold">Detail Status</h3>
                    <div className="flex items-start justify-between px-2 mt-12">
                      <TimelineItem title="Pengajuan" time={waktuPengajuan} active />
                      <TimelineLine active={!!waktuProses} />
                      <TimelineItem title="" time={waktuProses} active={!!waktuProses} />
                      <TimelineLine active={!!waktuHasil} />
                      <TimelineItem
                        title={latestStatus?.status === "DITOLAK" ? "Ditolak" : ""}
                        time={waktuHasil}
                        active={!!waktuHasil}
                        danger={latestStatus?.status === "DITOLAK"}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
