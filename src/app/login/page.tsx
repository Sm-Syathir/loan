"use client"

import Navbar from "@/components/Navbar"
import Link from "next/link"
import { Button } from "@/components/ui/Button";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email harus diisi";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email tidak valid";
    if (!formData.password) newErrors.password = "Password harus diisi";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Validasi
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      // Login gagal jika error muncul atau data.user null
      if (error || !data.user) {
        setErrors({ email: "Email atau password salah" });
        return;
      }

      // Jika login berhasil, cek role dari backend lalu redirect
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (token) {
          const res = await fetch("https://be-loan-production.up.railway.app/users", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
          });

          if (res.ok) {
            const json = await res.json();
            const currentUser = json.data.find((u: any) => (u.email || "").toLowerCase() === (data.user?.email || formData.email || "").toLowerCase());

            if (currentUser) {
              // Backend sample shows structure: { role_id: 1, role: { id: 1, nama_role: "Admin\n" } }
              const roleId = currentUser.role_id ?? currentUser.role?.id ?? currentUser.role?.role_id;
              const roleNameRaw = currentUser.role?.nama_role ?? currentUser.role_name ?? currentUser.nama_role ?? currentUser.role?.name;
              const roleName = typeof roleNameRaw === 'string' ? roleNameRaw.trim().toLowerCase() : null;

              const isAdmin = (roleId !== undefined && Number(roleId) === 1) || (roleName === 'admin');

              if (isAdmin) {
                router.push("/admin/dashboard");
                return;
              }
            }
          }
        }

        // Default redirect jika bukan admin atau gagal cek role
        router.push("/home");
      } catch (err) {
        router.push("/home");
      }

    } catch (err) {
      setErrors({ email: "Terjadi kesalahan saat login" });
    }
  };

  return (
    <div>
      <Navbar />
      <main className="overflow-hidden">
        <section>
          <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md px-4 sm:px-0 mx-auto">
              <h1 className="text-center text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                Login
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>}
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-black" /> : <Eye className="h-5 w-5 text-black" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Lupa Password?
                  </Link>
                </div>

                {/* Button Login */}
                <Button type="submit" variant="default" className="group hover:cursor-pointer w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform transition-all duration-150">
                  Login
                  <div className="text-white size-6 overflow-hidden rounded-full duration-500">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6"><ArrowRight className="m-auto size-5" /></span>
                      <span className="flex size-6"><ArrowRight className="m-auto size-5" /></span>
                    </div>
                  </div>
                </Button>

                <Link href={"/"}>
                  <Button type="button" variant="outline" className="w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl font-bold shadow-[0_4px_0_0_theme(colors.gray.300),0_8px_20px_theme(colors.gray.300/0.25)] hover:shadow-[0_6px_0_0_theme(colors.gray.400),0_10px_25px_theme(colors.gray.300/0.3)] hover:bg-gray-50 active:shadow-[0_2px_0_0_theme(colors.gray.300),0_4px_10px_theme(colors.gray.300/0.2)] active:translate-y-0.5 transform transition-all duration-150 dark:shadow-[0_4px_0_0_theme(colors.gray.600),0_8px_20px_theme(colors.gray.700/0.25)] dark:hover:shadow-[0_6px_0_0_theme(colors.gray.500),0_10px_25px_theme(colors.gray.700/0.3)] dark:hover:bg-gray-800 cursor-pointer">
                    Back
                  </Button>
                </Link>

                {/* Register Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Belum punya akun?{" "}
                    <Link href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                      Daftar di sini
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
