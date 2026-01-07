"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import { User, Phone, Mail, Calendar, Shield, Key, Edit2, X } from "lucide-react"

interface UserData {
  name: string
  email: string
  no_phone: string
  role_id: number
  created_at: string
  updated_at: string
  agent_code?: string
  nasabah_code?: string
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State edit nama
  const [editingName, setEditingName] = useState(false)
  const [editNameValue, setEditNameValue] = useState("")
  const [isSavingName, setIsSavingName] = useState(false)
  const [saveNameError, setSaveNameError] = useState<string | null>(null)
  const [saveNameSuccess, setSaveNameSuccess] = useState(false)

  // State kode agent untuk nasabah
  const [agentReferralCode, setAgentReferralCode] = useState("")
  const [isSavingAgentCode, setIsSavingAgentCode] = useState(false)
  const [agentCodeError, setAgentCodeError] = useState<string | null>(null)
  const [agentCodeSuccess, setAgentCodeSuccess] = useState(false)

  const router = useRouter()

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.replace("/login")
          return
        }

        const token = session.access_token
        const userEmail = session.user?.email

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
          agent_code: currentUser.agent_code || undefined,
          nasabah_code: currentUser.nasabah_code || undefined,
        })

        // Jika role nasabah dan ada nasabah_code, set ke input kode agent
        if (currentUser.role_id === 3 && currentUser.nasabah_code) {
          setAgentReferralCode(currentUser.nasabah_code)
        }

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  // --- Edit Nama ---
  const handleEditNameClick = () => {
    if (!user) return
    setEditingName(true)
    setEditNameValue(user.name)
    setSaveNameError(null)
    setSaveNameSuccess(false)
  }

  const handleCancelEditName = () => {
    setEditingName(false)
    setEditNameValue("")
    setSaveNameError(null)
  }

  const handleSaveName = async () => {
    if (!user) return

    try {
      setIsSavingName(true)
      setSaveNameError(null)

      if (!editNameValue.trim()) {
        throw new Error("Nama tidak boleh kosong")
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Session tidak ditemukan")

      const token = session.access_token
      const userId = session.user?.id

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
      if (!res.ok) throw new Error(result.message || "Gagal memperbarui nama")

      setUser({
        ...user,
        name: editNameValue.trim(),
        updated_at: new Date().toISOString()
      })

      setSaveNameSuccess(true)
      setEditingName(false)
      setEditNameValue("")

      setTimeout(() => setSaveNameSuccess(false), 3000)
    } catch (err) {
      setSaveNameError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsSavingName(false)
    }
  }

  // --- Save Kode Agent (hanya nasabah) ---
  const handleSaveAgentCode = async () => {
    if (!user) return

    try {
      setIsSavingAgentCode(true)
      setAgentCodeError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Session tidak ditemukan")

      const token = session.access_token
      const userId = session.user?.id

      const res = await fetch(`https://be-loan-production.up.railway.app/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nasabah_code: agentReferralCode.trim() || null
        })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || "Gagal memperbarui kode agent")

      setUser({
        ...user,
        nasabah_code: agentReferralCode.trim() || undefined,
        updated_at: new Date().toISOString()
      })

      setAgentCodeSuccess(true)
      setTimeout(() => setAgentCodeSuccess(false), 3000)
    } catch (err) {
      setAgentCodeError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsSavingAgentCode(false)
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
            <p className="text-gray-500">Kelola informasi profil Anda di sini</p>
          </div>

          {/* Success Message Nama */}
          {saveNameSuccess && (
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

            <div className="space-y-8">
              {/* Row 1: Nama & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                          disabled={isSavingName || !editNameValue.trim()}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSavingName ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                          onClick={handleCancelEditName}
                          disabled={isSavingName}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {saveNameError && (
                        <p className="text-red-600 mt-1">{saveNameError}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-900 font-semibold text-lg pl-6">{user.name}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="font-medium">Email</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg pl-6">{user.email}</p>
                </div>
              </div>

              {/* Row 2: No. HP & Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-8">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="font-medium">No. HP</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg pl-6">{user.no_phone}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="font-medium">Role</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg pl-6">{roleName}</p>
                </div>
              </div>

              {/* Row 3: Agent Code untuk Agent */}
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

              {/* Row 4: Form Kode Agent Nasabah */}
              {user.role_id === 3 && (
                <div className="border-t border-gray-200 pt-8">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-500">
                      <Key className="w-4 h-4 mr-2" />
                      <span className="font-medium">Kode Agent</span>
                    </div>

                    <div className="pl-6 space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Masukkan Kode Agent (Opsional)
                      </label>
                      <input
                        type="text"
                        value={agentReferralCode}
                        onChange={(e) => setAgentReferralCode(e.target.value.toUpperCase())}
                        placeholder="Contoh: AG-MJKYP2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />

                      <button
                        onClick={handleSaveAgentCode}
                        disabled={isSavingAgentCode}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSavingAgentCode ? "Menyimpan..." : "Simpan Kode"}
                      </button>

                      {agentCodeSuccess && (
                        <p className="text-green-600 font-medium mt-1">Kode agent berhasil disimpan!</p>
                      )}
                      {agentCodeError && (
                        <p className="text-red-600 font-medium mt-1">{agentCodeError}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Row 5: Created & Updated */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-8">
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
