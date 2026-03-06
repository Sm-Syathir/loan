"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Eye, EyeOff, X, Check } from "lucide-react";
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
    userType: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);
  const [hasAgreedToPrivacy, setHasAgreedToPrivacy] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

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
    if (["Backspace", "Delete", "Tab", "Escape", "Enter"].includes(e.key)) {
      return;
    }
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

  const handlePrivacyAgreement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Tampilkan popup privasi jika semua input sudah diisi
    setShowPrivacyPopup(true);
  };

  const handleConfirmRegistration = async () => {
    setShowPrivacyPopup(false);
    
    // role_id: 2 untuk Agent, 3 untuk Nasabah (sesuai backend)
    const role_id = formData.userType === "agent" ? 2 : 3;

    try {
      const res = await fetch(
        "https://satufin.satufin.id/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            no_phone: formData.no_phone,
            password: formData.password,
            role_id: role_id,
          }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Registrasi gagal");
      }

      // Tampilkan popup sukses
      setShowSuccessPopup(true);
      setHasAgreedToPrivacy(false);

      // Reset form
      setFormData({
        name: "",
        email: "",
        no_phone: "",
        password: "",
        userType: "",
      });

      // Auto-redirect setelah 3 detik
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Registrasi gagal";
      setErrors({
        email: errorMessage,
      });
    }
  };

  // Tutup popup secara manual
  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push("/login");
  };

  const handleClosePrivacyPopup = () => {
    setShowPrivacyPopup(false);
    setHasAgreedToPrivacy(false);
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

              <form onSubmit={handlePrivacyAgreement} className="space-y-4 sm:space-y-5">
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
                      { label: "Agent", value: "agent", disabled: true },
                      { label: "Nasabah", value: "nasabah", disabled: false },
                    ].map((option) => {
                      const selected = formData.userType === option.value;
                      const isDisabled = option.disabled;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => {
                            if (isDisabled) return;

                            setFormData((prev) => ({
                              ...prev,
                              userType: option.value,
                            }));
                          }}
                          className={`
        rounded-2xl border-2 px-4 py-4 font-semibold transition-all
        ${isDisabled
                              ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                              : selected
                                ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-blue-300"
                            }
      `}
                        >
                          <div className="flex flex-col items-center">
                            <span>{option.label}</span>
                            {isDisabled && (
                              <span className="text-xs mt-1 text-gray-500">
                                Under Maintenance
                              </span>
                            )}
                          </div>
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

        {/* Privacy Policy Popup */}
        {showPrivacyPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
              <button
                onClick={handleClosePrivacyPopup}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Kebijakan Privasi
                </h2>
                <p className="text-sm text-gray-500">
                  Harap baca kebijakan privasi kami dengan seksama
                </p>
              </div>

              <div className="prose prose-sm max-w-none mb-6 text-gray-700">
                <p className="mb-4">
                  <strong>SatuFin</strong> (“Kami”) berkomitmen untuk melindungi dan menjaga kerahasiaan data pribadi pengguna layanan Kami. Kebijakan Privasi ini menjelaskan bagaimana Kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda sesuai dengan ketentuan peraturan perundang-undangan yang berlaku, termasuk Undang-Undang Pelindungan Data Pribadi.
                </p>
                
                <p className="mb-4">
                  Dengan menggunakan layanan SatuFin, Anda menyatakan telah membaca, memahami, dan menyetujui Kebijakan Privasi ini.
                </p>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      id="agreePrivacy"
                      checked={hasAgreedToPrivacy}
                      onChange={(e) => setHasAgreedToPrivacy(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <label htmlFor="agreePrivacy" className="text-sm text-gray-700">
                    Saya telah membaca, memahami, dan menyetujui Kebijakan Privasi serta syarat dan ketentuan yang berlaku.
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleClosePrivacyPopup}
                    variant="outline"
                    className="flex-1 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirmRegistration}
                    disabled={!hasAgreedToPrivacy}
                    className={`flex-1 py-3 rounded-xl text-white font-semibold ${
                      hasAgreedToPrivacy
                        ? "bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 cursor-pointer"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Setuju & Lanjutkan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Registrasi Berhasil!
                </h2>
                <p className="text-gray-600 mb-2">
                  Akun Anda berhasil dibuat.
                </p>
                <p className="text-sm text-gray-500">
                  Silakan cek email anda untuk verifikasi email anda
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-center text-sm text-gray-500">
                  Akan diarahkan ke login dalam 3 detik
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}