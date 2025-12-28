"use client"

import NavbarHome from "@/components/NavbarHome"
import Link from "next/link"
import { Button } from "@/components/ui/Button";
import { ArrowRight, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface FormErrors {
    nik?: string;
    name?: string;
    alamat?: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    plafond?: string;
    userChoice?: string;
    userJaminan?: string;
  }



export default function CreditForm() {

    const creditOptions = [
        {
          value: 'KREDIT_PRODUKTIF',
          label: 'Kredit Produktif',
          description: 'Untuk kebutuhan usaha',
          icon: <Image src="/services-1.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
        },
        {
          value: 'MULTIGUNA',
          label: 'Kredit Multiguna',
          description: 'Untuk kebutuhan pribadi',
          icon: <Image src="/services-2.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
        },
        {
          value: 'KPR',
          label: 'KPR',
          description: 'Kredit Pemilikan Rumah',
          icon: <Image src="/services-3.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
        },
        {
          value: 'PENSIUN',
          label: 'Dana Pensiun',
          description: 'Kredit untuk pensiunan',
          icon: <Image src="/services-4.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
        }
      ]

      const jaminanOptions = [
        {
          value: 'SERTIFIKAT',
          title: "Sertifikat",
          description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
          icon: <Image src="/jaminan-1.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
        },
        {
          value: 'BPKB',
          title: "BPKB",
          description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
          icon: <Image src="/jaminan-2.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
        },
        {
          value: 'SK_PEGAWAI',
          title: "SK Pegawai",
          description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
          icon: <Image src="/jaminan-3.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
        },
      
      ]
      

      const [formData, setFormData] = useState({
        nik: '',
        name: '',
        alamat: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        plafond: '',
        userChoice: '',
        userJaminan: ''
      })
      

      const [errors, setErrors] = useState<FormErrors>({});
      const router = useRouter();

      if (!formData.userChoice) {
        errors.userChoice = 'Silakan pilih jenis kredit'
      }

      if (!formData.userJaminan) {
        errors.userJaminan = 'Silakan pilih jenis jaminan'
      }

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // For phone number, only allow digits
        let processedValue = value;
        if (name === "nik" || name === "plafond") {
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

      const validateForm = () => {
        const newErrors: Record<string, string> = {}
      
        if (!formData.nik.trim()) newErrors.nik = 'NIK wajib diisi'
        if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi'
        if (!formData.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi'
        if (!formData.tempat_lahir.trim()) newErrors.tempat_lahir = 'Tempat lahir wajib diisi'
        if (!formData.tanggal_lahir) newErrors.tanggal_lahir = 'Tanggal lahir wajib diisi'
      
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }
      

      const validateCredit = () => {
        if (!formData.userChoice) {
          setErrors({ userChoice: 'Pilih salah satu jenis kredit' })
          return false
        }
      
        setErrors({})
        return true
      }

      const validateJaminan = () => {
        if (!formData.userJaminan) {
          setErrors({ userJaminan: 'Pilih salah satu jaminan' })
          return false
        }
      
        setErrors({})
        return true
      }

      const handleFormContinue = () => {
        if (!validateForm()) return
        setStep('credit')
      }

      const handleCreditContinue = () => {
        if (!validateCredit()) return
        setStep('jaminan')
      }
      

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

      type Step = 'form' | 'credit' | 'jaminan'

      const [step, setStep] = useState<Step>('form')
      
      const handleBack = () => {
        if (step === 'jaminan') {
          setStep('credit')
        } else if (step === 'credit') {
          setStep('form')
        }
      }
      

      const handleSubmit = () => {
        if (!validateJaminan()) return
        router.push('/dashboard')
      }
      
    
    return(
        <div>
      <NavbarHome />
      <main className="overflow-hidden">
        <section>
            
          <div className="min-h-screen flex items-center justify-center bg-white px-4">
            {step === 'form' && (
            <div className="w-full max-w-md px-4 sm:px-0 mx-auto">
             
              <h1 className="text-center text-2xl pt-20 sm:text-3xl font-bold mb-6 sm:mb-8">
                Form Kredit
              </h1>

             
              <form className="space-y-4 sm:space-y-5">
                {/* NIK */}
                <div>
                  <input
                    type="tel"
                    name="nik"
                    placeholder="NIK"
                    value={formData.nik}
                    onChange={handleChange}
                    inputMode="numeric"
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.nik ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.alamat ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.tempat_lahir ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.tanggal_lahir ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.tanggal_lahir && <p className="text-red-500 text-sm mt-1 ml-1">{errors.tanggal_lahir}</p>}
                </div>

                {/* plafond (nominal pengajuan) */}
                <div>
                  <input
                    type="tel"
                    name="plafond"
                    placeholder="Plafond (nominal pengajuan)"
                    value={formData.plafond}
                    onChange={handleChange}
                    inputMode="numeric"
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.plafond ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.plafond && <p className="text-red-500 text-sm mt-1 ml-1">{errors.plafond}</p>}
                </div>

                {/* Dropdown Kredit Produktif, Kredit Multiguna, KPR, Dana Pensiun */}
                {/* <div>
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
                </div> */}

                {/* Button */}
                <Button
                  type="button"
                  onClick={handleFormContinue}
                  variant="default"
                  className="group hover:cursor-pointer w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform transition-all duration-150"
                >
                  Pilih Kredit
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
                    className="w-full text-base mb-8 sm:text-lg py-4 sm:py-6 rounded-2xl font-bold shadow-[0_4px_0_0_theme(colors.gray.300),0_8px_20px_theme(colors.gray.300/0.25)] hover:shadow-[0_6px_0_0_theme(colors.gray.400),0_10px_25px_theme(colors.gray.300/0.3)] hover:bg-gray-50 active:shadow-[0_2px_0_0_theme(colors.gray.300),0_4px_10px_theme(colors.gray.300/0.2)] active:translate-y-0.5 transform transition-all duration-150 dark:shadow-[0_4px_0_0_theme(colors.gray.600),0_8px_20px_theme(colors.gray.700/0.25)] dark:hover:shadow-[0_6px_0_0_theme(colors.gray.500),0_10px_25px_theme(colors.gray.700/0.3)] dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Back
                  </Button>
                </Link>
              </form>
            </div>
            )}

        
            {step === 'credit' && (
  <section className="mt-24 space-y-3 sm:space-y-5">
    {/* CARD PILIHAN KREDIT */}
    <div className=" px-4 sm:px-0 mb-16">
      <h1 className="text-center text-2xl sm:text-3xl font-bold">
        Pilihan Kredit
      </h1>
    </div>
    <div className="mb-8 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 px-4 sm:px-6">
      {creditOptions.map((service, index) => {
        const selected = formData.userChoice === service.value

        return (
          <button
            key={index}
            type="button"
            onClick={() =>
              setFormData(prev => ({
                ...prev,
                userChoice: service.value
              }))
            }
            className={`
                bg-white rounded-2xl p-6 sm:p-10 text-center transition-all border-2
                ${selected
                  ? 'border-blue-500 shadow-xl ring-2 ring-blue-500'
                  : 'border-transparent shadow-md hover:shadow-xl hover:border-blue-300'}
              `}
          >
            <div className="flex justify-center">{service.icon}</div>
            <h3 className="text-xl font-bold mt-4">{service.label}</h3>
            <p className="text-gray-600 mt-2">{service.description}</p>
          </button>
        )
      })}
    </div>

    {/* BUTTON CONTINUE */}
    <Button
  type="button"
  disabled={!formData.userChoice}
  onClick={handleCreditContinue}
  className={`
    group hover:cursor-pointer w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl
    bg-gradient-to-b from-blue-400 to-blue-500
    hover:from-blue-500 hover:to-blue-600
    text-white font-bold
    shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)]
    hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)]
    active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)]
    active:translate-y-0.5 transform transition-all duration-150
    disabled:opacity-50 disabled:cursor-not-allowed
  `}
>
  Pilih Jaminan
  <div className="text-white size-6 overflow-hidden rounded-full duration-500">
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
<Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="w-full text-base mb-8 sm:text-lg py-4 sm:py-6 rounded-2xl font-bold shadow-[0_4px_0_0_theme(colors.gray.300),0_8px_20px_theme(colors.gray.300/0.25)] hover:shadow-[0_6px_0_0_theme(colors.gray.400),0_10px_25px_theme(colors.gray.300/0.3)] hover:bg-gray-50 active:shadow-[0_2px_0_0_theme(colors.gray.300),0_4px_10px_theme(colors.gray.300/0.2)] active:translate-y-0.5 transform transition-all duration-150 dark:shadow-[0_4px_0_0_theme(colors.gray.600),0_8px_20px_theme(colors.gray.700/0.25)] dark:hover:shadow-[0_6px_0_0_theme(colors.gray.500),0_10px_25px_theme(colors.gray.700/0.3)] dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Back
                  </Button>
  </section>
)}

{/* JAMINAN */}
{step === 'jaminan' && (
  <section className="mt-24 space-y-3 sm:space-y-5">
    {/* CARD PILIHAN KREDIT */}
    <div className=" px-4 sm:px-0 mb-16">
    <h1 className="text-center text-2xl sm:text-3xl font-bold">
      Pilihan Jaminan
    </h1>
  </div>
  <div className="mb-8 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 px-4 sm:px-6">
      {jaminanOptions.map((jaminan, index) => {
        const selected = formData.userJaminan === jaminan.value

        return (
          <button
            key={index}
            type="button"
            onClick={() =>
              setFormData(prev => ({
                ...prev,
                userJaminan: jaminan.value
              }))
            }
            className={`
                bg-white rounded-2xl p-6 sm:p-10 text-center transition-all border-2
                ${selected
                  ? 'border-blue-500 shadow-xl ring-2 ring-blue-500'
                  : 'border-transparent shadow-md hover:shadow-xl hover:border-blue-300'}
              `}
          >
            <div className="flex justify-center">{jaminan.icon}</div>
            <h3 className="text-xl font-bold mt-4">{jaminan.title}</h3>
            <p className="text-gray-600 mt-2">{jaminan.description}</p>
          </button>
        )
      })}
    </div>

    {/* BUTTON CONTINUE */}
    <Button
  type="submit"
  disabled={!formData.userJaminan}
  onClick={handleSubmit}
  className={`
    group hover:cursor-pointer w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl
    bg-gradient-to-b from-blue-400 to-blue-500
    hover:from-blue-500 hover:to-blue-600
    text-white font-bold
    shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)]
    hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)]
    active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)]
    active:translate-y-0.5 transform transition-all duration-150
    disabled:opacity-50 disabled:cursor-not-allowed
  `}
>
  Submit
  <div className="text-white size-6 overflow-hidden rounded-full duration-500">
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
<Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="w-full text-base mb-8 sm:text-lg py-4 sm:py-6 rounded-2xl font-bold shadow-[0_4px_0_0_theme(colors.gray.300),0_8px_20px_theme(colors.gray.300/0.25)] hover:shadow-[0_6px_0_0_theme(colors.gray.400),0_10px_25px_theme(colors.gray.300/0.3)] hover:bg-gray-50 active:shadow-[0_2px_0_0_theme(colors.gray.300),0_4px_10px_theme(colors.gray.300/0.2)] active:translate-y-0.5 transform transition-all duration-150 dark:shadow-[0_4px_0_0_theme(colors.gray.600),0_8px_20px_theme(colors.gray.700/0.25)] dark:hover:shadow-[0_6px_0_0_theme(colors.gray.500),0_10px_25px_theme(colors.gray.700/0.3)] dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Back
                  </Button>
  </section>
)}

        </div>
        </section>
      </main>
    </div>
    )
}