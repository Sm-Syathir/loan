"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import { User, Phone, Mail, Calendar, Shield, Key, Edit2, Save, X } from "lucide-react"

interface UserData {
  name: string
  email: string
  no_phone: string
  role_id: number
  created_at: string
  updated_at: string
  agent_code?: string
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [editNameValue, setEditNameValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)

        // Ambil session Supabase
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.replace("/login")
          return
        }

        const token = session.access_token
        const userEmail = session.user?.email

        // Fetch user dari backend
        const res = await fetch("https://be-loan-production.up.railway.app/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error("Gagal mengambil data user")

        const json = await res.json()
        const currentUser = json.data.find((u: any) => u.email === userEmail)

        if (!currentUser) throw new Error("User tidak ditemukan")

        setUser({
          name: currentUser.name,
          email: currentUser.email,
          no_phone: currentUser.no_phone,
          role_id: currentUser.role_id,
          created_at: currentUser.created_at,
          updated_at: currentUser.updated_at,
          agent_code: currentUser.agent_code || undefined
        })
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleEditNameClick = () => {
    if (!user) return
    setEditingName(true)
    setEditNameValue(user.name)
    setSaveError(null)
    setSaveSuccess(false)
  }

  const handleCancelEdit = () => {
    setEditingName(false)
    setEditNameValue("")
    setSaveError(null)
  }

  const handleSaveName = async () => {
    if (!user) return

    try {
      setIsSaving(true)
      setSaveError(null)

      // Validasi
      if (!editNameValue.trim()) {
        throw new Error("Nama tidak boleh kosong")
      }

      // Ambil session untuk token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error("Session tidak ditemukan")
      }

      const token = session.access_token
      const userId = session.user?.id

      // Kirim update nama ke backend
      const res = await fetch(`https://be-loan-production.up.railway.app/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editNameValue.trim()
        })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || "Gagal memperbarui nama")
      }

      // Update state user
      setUser({
        ...user,
        name: editNameValue.trim(),
        updated_at: new Date().toISOString()
      })

      setSaveSuccess(true)
      setEditingName(false)
      setEditNameValue("")

      // Reset success message setelah 3 detik
      setTimeout(() => setSaveSuccess(false), 3000)

    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-500 text-sm">Memuat profil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-gray-400 mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:text-blue-700 text-sm underline"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Map role_id ke nama role
  const getRoleName = (roleId: number) => {
    switch(roleId) {
      case 1: return "Admin"
      case 2: return "Agent"
      case 3: return "Nasabah"
      default: return "User"
    }
  }

  const roleName = getRoleName(user.role_id)

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
            <p className="text-gray-500">Kelola informasi profil Anda di sini</p>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-green-700 font-medium">Nama berhasil diperbarui!</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                Informasi User
              </h3>
            </div>

            {/* Grid Informasi */}
            <div className="space-y-8">
              {/* Row 1: Nama dan Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* NAMA (BISA DIEDIT) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-medium">Nama</span>
                    </div>
                    {!editingName && (
                      <button
                        onClick={handleEditNameClick}
                        className="flex items-center text-black hover:text-blue-800 text-sm font-medium"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {editingName ? (
                    <div className="pl-6 space-y-3">
                      <input
                        type="text"
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveName}
                          disabled={isSaving || !editNameValue.trim()}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-900 font-semibold text-lg pl-6">{user.name}</p>
                  )}
                </div>

                {/* EMAIL (TIDAK BISA DIEDIT) */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="font-medium">Email</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg pl-6">{user.email}</p>
                </div>
              </div>

              {/* Row 2: No. HP dan Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-8">
                {/* NO. HP (TIDAK BISA DIEDIT) */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="font-medium">No. HP</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg pl-6">{user.no_phone}</p>
                </div>

                {/* ROLE (TIDAK BISA DIEDIT) */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="font-medium">Role</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg pl-6">{roleName}</p>
                </div>
              </div>

              {/* Row 3: Agent Code (Hanya untuk Agent) */}
              {user.role_id === 2 && user.agent_code && (
                <div className="border-t border-gray-200 pt-8">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-500">
                      <Key className="w-4 h-4 mr-2" />
                      <span className="font-medium">Kode Agent</span>
                    </div>
                    <div className="pl-6">
                      <div className="inline-block border border-blue-200 rounded-lg px-4 py-3">
                        <p className="text-black font-bold text-lg tracking-wider">
                          {user.agent_code}
                        </p>
                      </div>
                      <p className="text-gray-500 text-sm mt-2">
                       Kode ini digunakan untuk mengajak nasabah bergabung melalui Anda.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {saveError && (
                <div className="border-t border-gray-200 pt-8">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <X className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-red-700">{saveError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Row 4: Dibuat Pada dan Terakhir Update */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-8">
                {/* Dibuat Pada */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">Dibuat Pada</span>
                  </div>
                  <div className="pl-6">
                    <p className="text-gray-900 font-semibold">
                      {new Date(user.created_at).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(user.created_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Terakhir Update */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">Terakhir Update</span>
                  </div>
                  <div className="pl-6">
                    <p className="text-gray-900 font-semibold">
                      {new Date(user.updated_at).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(user.updated_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}