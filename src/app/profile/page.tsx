"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import { User, Phone, Mail, Calendar, Shield } from "lucide-react"

interface UserData {
  name: string
  email: string
  no_phone: string
  role_id: number
  created_at: string
  updated_at: string
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
        const res = await fetch("https://be-loan.vercel.app/profile", {
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
          updated_at: currentUser.updated_at
        })
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

  

          {/* Informasi User */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Informasi User
              </h3>
            </div>

            {/* Grid Informasi */}
            <div className="space-y-8">
              {/* Row 1: Nama dan Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Nama */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium">Nama</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg pl-6">{user.name}</p>
                </div>

                {/* Email */}
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
                {/* No. HP */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="font-medium">No. HP</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg pl-6">{user.no_phone}</p>
                </div>

                {/* Role */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="font-medium">Role</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg pl-6">{roleName}</p>
                </div>
              </div>

              {/* Row 3: Dibuat Pada dan Terakhir Update */}
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