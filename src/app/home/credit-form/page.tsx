"use client"

import NavbarHome from "@/components/NavbarHome"
import Link from "next/link"
import { Button } from "@/components/ui/Button";
import { ArrowRight, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormErrors {
    nik?: string;
    name?: string;
    alamat?: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    userChoice?: string;
  }

export default function CreditForm() {

    const [formData, setFormData] = useState({
        nik: "",
        name: "",
        alamat: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        userChoice: "",
      });
      const [errors, setErrors] = useState<FormErrors>({});
      const [showPassword, setShowPassword] = useState(false);
      const router = useRouter();

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // For phone number, only allow digits
        let processedValue = value;
        if (name === "nik") {
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

      const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
    
        if (!formData.nik.trim()) newErrors.nik = "NIK harus diisi";
        else if (!/^\d+$/.test(formData.nik)) newErrors.nik = "NIK harus angka";
        
        if (!formData.name.trim()) newErrors.name = "Nama harus diisi";
    
        if (!formData.alamat.trim()) newErrors.alamat = "Alamat harus diisi";
    
        if (!formData.tempat_lahir) newErrors.tempat_lahir = "Tempat lahir harus diisi";
        if (!formData.tanggal_lahir) newErrors.tanggal_lahir = "Tanggal lahir harus diisi";
    
        if (!formData.userChoice) newErrors.userChoice = "Pilih kredit pengguna";
    
        return newErrors;
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

      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
    
        // Jika semua valid, redirect ke /dashboard
        router.push("/dashboard");
      };
    
    return(
        <div>
      <NavbarHome />
      <main className="overflow-hidden">
        <section>
          <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md">
              <h1 className="text-center text-3xl font-bold mb-8">
                Register
              </h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* NIK */}
                <div>
                  <input
                    type="tel"
                    name="nik"
                    placeholder="NIK"
                    value={formData.nik}
                    onChange={handleChange}
                    inputMode="numeric"
                    className={`w-full px-4 py-3 rounded-2xl border ${errors.nik ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.nik && <p className="text-red-500 text-sm mt-1 ml-1">{errors.nik}</p>}
                </div>

                {/* nama */}
                <div>
                  <input
                    type="name"
                    name="name"
                    placeholder="Nama"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-2xl border ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>}
                </div>

                {/* alamat */}
                <div>
                  <input
                    type="text"
                    name="alamat"
                    placeholder="Alamat lengkap"
                    value={formData.alamat}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-2xl border ${errors.alamat ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.alamat && <p className="text-red-500 text-sm mt-1 ml-1">{errors.alamat}</p>}
                </div>

                {/* tempat lahir */}
                <div>
                  <input
                    type="name"
                    name="tempat_lahir"
                    placeholder="Tempat lahir"
                    value={formData.tempat_lahir}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-2xl border ${errors.tempat_lahir ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.tempat_lahir && <p className="text-red-500 text-sm mt-1 ml-1">{errors.tempat_lahir}</p>}
                </div>

                {/* tanggal lahir */}
                <div>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    placeholder="Tanggal lahir"
                    value={formData.tanggal_lahir}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-2xl border ${errors.tanggal_lahir ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.tanggal_lahir && <p className="text-red-500 text-sm mt-1 ml-1">{errors.tanggal_lahir}</p>}
                </div>

                {/* Dropdown Agent/ Nasabah */}
                <div>
                  <div className="relative">
                    <select
                      name="userChoice"
                      value={formData.userChoice}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-10 rounded-2xl border ${errors.userChoice ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white`}
                    >
                      <option value="">Pilih kredit</option>
                      <option value="Kredit Produktif">Kredit Produktif</option>
                      <option value="Kredit Multiguna">Kredit Multiguna</option>
                      <option value="KPR">KPR</option>
                      <option value="Dana Pensiun">Dana Pensiun</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-black" />
                    </div>
                  </div>
                  {errors.userChoice && <p className="text-red-500 text-sm mt-1 ml-1">{errors.userChoice}</p>}
                </div>

                {/* Button */}
                <Button
                  type="submit"
                  variant="default"
                  className="group hover:cursor-pointer w-full text-lg py-6 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform transition-all duration-150"
                >
                  Submit
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

                <Link href={"/home"}>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-lg w-full py-6 rounded-2xl font-bold shadow-[0_4px_0_0_theme(colors.gray.300),0_8px_20px_theme(colors.gray.300/0.25)] hover:shadow-[0_6px_0_0_theme(colors.gray.400),0_10px_25px_theme(colors.gray.300/0.3)] hover:bg-gray-50 active:shadow-[0_2px_0_0_theme(colors.gray.300),0_4px_10px_theme(colors.gray.300/0.2)] active:translate-y-0.5 transform transition-all duration-150 dark:shadow-[0_4px_0_0_theme(colors.gray.600),0_8px_20px_theme(colors.gray.700/0.25)] dark:hover:shadow-[0_6px_0_0_theme(colors.gray.500),0_10px_25px_theme(colors.gray.700/0.3)] dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Back
                  </Button>
                </Link>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
    )
}