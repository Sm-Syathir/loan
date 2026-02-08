'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE = "https://mediumspringgreen-wallaby-250953.hostingersite.com/api/v1"

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'register') {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name: email.split('@')[0] }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Registrasi gagal')
        router.push('/login')
      } else {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Login gagal')
        if (data.data?.token) localStorage.setItem('token', data.data.token)
        if (data.data?.user) localStorage.setItem('user', JSON.stringify(data.data.user))
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">{mode === 'register' ? 'Daftar' : 'Masuk'}</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <label className="block mb-2">
        Email
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="block w-full" />
      </label>
      <label className="block mb-4">
        Password
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="block w-full" />
      </label>
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white">
        {loading ? 'Memproses...' : mode === 'register' ? 'Daftar' : 'Masuk'}
      </button>
    </form>
  )
}
