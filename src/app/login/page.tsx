"use client"

import Navbar from "@/components/Navbar"
import Link from "next/link"
import { Button } from "@/components/ui/Button";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);

    try {
      const res = await fetch(
        "https://mediumspringgreen-wallaby-250953.hostingersite.com/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login gagal");
      }

      // Simpan token dan user data ke localStorage
      if (result.data?.token) {
        localStorage.setItem("token", result.data.token);
      }

      if (result.data?.user) {
        localStorage.setItem("user", JSON.stringify(result.data.user));
      }

      // Cek role untuk redirect
      const user = result.data?.user;
      const roleId = user?.role_id;
      const roleName = user?.role?.nama_role?.trim().toLowerCase();

      // role_id: 1 = Admin, 2 = Agent, 3 = Nasabah
      const isAdmin = roleId === 1 || roleName === "admin";

      if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/home");
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat login";
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
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
                    disabled={isLoading}
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
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
                      disabled={isLoading}
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
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
                <Button 
                  type="submit" 
                  variant="default" 
                  disabled={isLoading}
                  className="group hover:cursor-pointer w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Login"}
                  {!isLoading && (
                    <div className="text-white size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6"><ArrowRight className="m-auto size-5" /></span>
                        <span className="flex size-6"><ArrowRight className="m-auto size-5" /></span>
                      </div>
                    </div>
                  )}
                </Button>

                <Link href={"/"}>
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isLoading}
                    className="w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl font-bold shadow-[0_4px_0_0_theme(colors.gray.300),0_8px_20px_theme(colors.gray.300/0.25)] hover:shadow-[0_6px_0_0_theme(colors.gray.400),0_10px_25px_theme(colors.gray.300/0.3)] hover:bg-gray-50 active:shadow-[0_2px_0_0_theme(colors.gray.300),0_4px_10px_theme(colors.gray.300/0.2)] active:translate-y-0.5 transform transition-all duration-150 dark:shadow-[0_4px_0_0_theme(colors.gray.600),0_8px_20px_theme(colors.gray.700/0.25)] dark:hover:shadow-[0_6px_0_0_theme(colors.gray.500),0_10px_25px_theme(colors.gray.700/0.3)] dark:hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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