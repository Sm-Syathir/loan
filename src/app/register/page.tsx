"use client"

import Navbar from "@/components/Navbar"
import Link from "next/link"
import { Button } from "@/components/ui/Button";
import { ArrowRight, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormErrors {
  name?: string;
  email?: string;
  no_phone?: string;
  password?: string;
  userType?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    no_phone: "",
    password: "",
    userType: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits
    let processedValue = value;
    if (name === "no_phone") {
      processedValue = value.replace(/\D/g, "");
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
      return;
    }
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x') && e.ctrlKey) {
      return;
    }
    // Allow: Arrow keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      return;
    }
    // Only allow numbers (0-9)
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nama harus diisi";
    if (!formData.email.trim()) newErrors.email = "Email harus diisi";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email tidak valid";

    if (!formData.no_phone.trim()) newErrors.no_phone = "Nomor telepon harus diisi";
    else if (!/^\d+$/.test(formData.no_phone)) newErrors.no_phone = "Nomor telepon harus angka";

    if (!formData.password) newErrors.password = "Password harus diisi";
    else if (formData.password.length < 6) newErrors.password = "Password minimal 6 karakter";

    if (!formData.userType) newErrors.userType = "Pilih tipe pengguna";

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Jika semua valid, redirect ke /home
    router.push("/home");
  };

  return (
    <div>
      <Navbar />
      <main className="overflow-hidden">
        <section>
          <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md">
              <h1 className="text-center text-3xl font-bold mb-8">
                Register
              </h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* nama */}
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-2xl border ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>}
                </div>

                {/* email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>}
                </div>

                {/* no phone */}
                <div>
                  <input
                    type="tel"
                    name="no_phone"
                    placeholder="No phone"
                    value={formData.no_phone}
                    onChange={handleChange}
                    onKeyDown={handlePhoneKeyDown}
                    inputMode="numeric"
                    className={`w-full px-4 py-3 rounded-2xl border ${errors.no_phone ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.no_phone && <p className="text-red-500 text-sm mt-1 ml-1">{errors.no_phone}</p>}
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
                      className={`w-full px-4 py-3 pr-12 rounded-2xl border ${errors.password ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-black" />
                      ) : (
                        <Eye className="h-5 w-5 text-black" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>}
                </div>

                {/* Dropdown Agent/ Nasabah */}
                <div>
                  <div className="relative">
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-10 rounded-2xl border ${errors.userType ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white`}
                    >
                      <option value="">Pilih tipe pengguna</option>
                      <option value="agent">Agent</option>
                      <option value="nasabah">Nasabah</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-black" />
                    </div>
                  </div>
                  {errors.userType && <p className="text-red-500 text-sm mt-1 ml-1">{errors.userType}</p>}
                </div>

                {/* Button */}
                <Button
                  type="submit"
                  variant="default"
                  className="group hover:cursor-pointer w-full text-lg py-6 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform transition-all duration-150"
                >
                  Continue
                  <div className=" text-white   size-6 overflow-hidden rounded-full duration-500">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-5" />
                      </span>
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-5" />
                      </span>
                    </div>
                  </div>
                </Button>

                <Link href={"/"}>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-lg w-full py-6 rounded-2xl font-bold shadow-[0_4px_0_0_theme(colors.gray.300),0_8px_20px_theme(colors.gray.300/0.25)] hover:shadow-[0_6px_0_0_theme(colors.gray.400),0_10px_25px_theme(colors.gray.300/0.3)] hover:bg-gray-50 active:shadow-[0_2px_0_0_theme(colors.gray.300),0_4px_10px_theme(colors.gray.300/0.2)] active:translate-y-0.5 transform transition-all duration-150 dark:shadow-[0_4px_0_0_theme(colors.gray.600),0_8px_20px_theme(colors.gray.700/0.25)] dark:hover:shadow-[0_6px_0_0_theme(colors.gray.500),0_10px_25px_theme(colors.gray.700/0.3)] dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Back
                  </Button>
                </Link>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                      Login
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
