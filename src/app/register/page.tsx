"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ChevronDown, Eye, EyeOff, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

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
    userType: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // For phone number, only allow digits
    let processedValue = value;
    if (name === "no_phone") {
      processedValue = value.replace(/\D/g, "");
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if (["Backspace", "Delete", "Tab", "Escape", "Enter"].includes(e.key)) {
      return;
    }
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (
      (e.key === "a" || e.key === "c" || e.key === "v" || e.key === "x") &&
      e.ctrlKey
    ) {
      return;
    }
    // Allow: Arrow keys
    if (
      [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key)
    ) {
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
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email tidak valid";
    else {
      const firstChar = formData.email.trim().charAt(0);
      if (!/^[a-z]$/.test(firstChar)) {
        newErrors.email = "Email harus diawali huruf kecil";
      }
    }

    if (!formData.no_phone.trim())
      newErrors.no_phone = "Nomor telepon harus diisi";
    else if (!/^\d+$/.test(formData.no_phone))
      newErrors.no_phone = "Nomor telepon harus angka";

    if (!formData.password) newErrors.password = "Password harus diisi";
    else if (formData.password.length < 6)
      newErrors.password = "Password minimal 6 karakter";

    if (!formData.userType) newErrors.userType = "Pilih tipe pengguna";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Admin TIDAK dibuat lewat register
    const role = formData.userType === "agent" ? "Agent" : "Nasabah";

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { role },
          emailRedirectTo: `https://loan-mu-nine.vercel.app/verify`,
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("User supabase tidak terbentuk");

      const res = await fetch(
        "https://be-loan-production.up.railway.app/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            no_phone: formData.no_phone,
            role_id: formData.userType === "agent" ? 2 : 3,
          }),
        },
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      // Tampilkan popup sukses
      setShowSuccessPopup(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        no_phone: "",
        password: "",
        userType: "",
      });

      // Jangan langsung redirect ke login, biarkan user membaca popup
      // Auto-redirect setelah 5 detik
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (err: any) {
      setErrors({
        email: err.message || "Registrasi gagal",
      });
    }
  };

  // Tutup popup secara manual
  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push("/login");
  };

  return (
    <div>
      <Navbar />
      <main className="overflow-hidden">
        <section>
          <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md px-4 sm:px-0 mx-auto">
              <h1 className="text-center text-2xl pt-20 sm:text-3xl font-bold mb-6 sm:mb-8">
                Register
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* nama */}
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.name ? "border-red-500" : "border-gray-300"} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 ml-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.email ? "border-red-500" : "border-gray-300"} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 ml-1">
                      {errors.email}
                    </p>
                  )}
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
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.no_phone ? "border-red-500" : "border-gray-300"} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.no_phone && (
                    <p className="text-red-500 text-sm mt-1 ml-1">
                      {errors.no_phone}
                    </p>
                  )}
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
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.password ? "border-red-500" : "border-gray-300"} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-black" />
                      ) : (
                        <Eye className="h-5 w-5 text-black" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 ml-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Choose Agent / Nasabah */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tipe Pengguna (pilih salah satu!)
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Agent", value: "agent" },
                      { label: "Nasabah", value: "nasabah" },
                    ].map((option) => {
                      const selected = formData.userType === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              userType: option.value,
                            }))
                          }
                          className={`
                            rounded-2xl border-2 px-4 py-4 font-semibold transition-all
                            ${
                              selected
                                ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-blue-300"
                            }
                          `}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>

                  {errors.userType && (
                    <p className="text-red-500 text-sm ml-1">
                      {errors.userType}
                    </p>
                  )}
                </div>

                {/* Button */}
                <Button
                  type="submit"
                  variant="default"
                  className="group hover:cursor-pointer w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform transition-all duration-150"
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
                    className="w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl font-bold shadow-[0_4px_0_0_theme(colors.gray.300),0_8px_20px_theme(colors.gray.300/0.25)] hover:shadow-[0_6px_0_0_theme(colors.gray.400),0_10px_25px_theme(colors.gray.300/0.3)] hover:bg-gray-50 active:shadow-[0_2px_0_0_theme(colors.gray.300),0_4px_10px_theme(colors.gray.300/0.2)] active:translate-y-0.5 transform transition-all duration-150 dark:shadow-[0_4px_0_0_theme(colors.gray.600),0_8px_20px_theme(colors.gray.700/0.25)] dark:hover:shadow-[0_6px_0_0_theme(colors.gray.500),0_10px_25px_theme(colors.gray.700/0.3)] dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Back
                  </Button>
                </Link>

                {/* Login Link */}
                <div className="text-center pt-4 mb-8">
                  <p className="text-gray-600">
                    Sudah punya akun?{" "}
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Success Popup Modal */}
        {showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Registrasi Berhasil!
                </h2>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Buka email kamu dan klik link konfirmasi untuk
                      mengaktifkan akun
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleClosePopup}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer"
                >
                  Lanjut ke Login
                </Button>
                <p className="text-center text-sm text-gray-500">
                  Akan diarahkan ke login dalam 5 detik
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}