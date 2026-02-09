"use client"

import NavbarHome from "@/components/NavbarHome"
import Link from "next/link"
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle, AlertCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
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

// Komponen Modal dan Toast
const SuccessModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Berhasil!</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <Button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg"
          >
            Oke
          </Button>
        </div>
      </div>
    </div>
  );
};

const ErrorModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <Button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  );
};

const WarningToast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-8 duration-300">
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 shadow-lg max-w-sm">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-amber-800 text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-amber-600 hover:text-amber-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingOverlay = ({ message }: { message: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-700 font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default function CreditForm() {
  const creditOptions = [
  {
    value: 'KREDIT_PRODUKTIF',
    label: 'Kredit Produktif',
    description: 'Untuk kebutuhan usaha',
    icon: <Image src="/services-1.svg" alt="illustration" width={100} height={100} className="w-12 h-12 mx-auto" />,
    disabled: false,
  },
  {
    value: 'MULTIGUNA',
    label: 'Kredit Multiguna',
    description: 'Untuk kebutuhan pribadi',
    icon: <Image src="/services-2.svg" alt="illustration" width={100} height={100} className="w-12 h-12 mx-auto" />,
    disabled: false,
  },
  {
    value: 'KPR',
    label: 'KPR',
    description: 'Kredit Pemilikan Rumah',
    icon: <Image src="/services-3.svg" alt="illustration" width={100} height={100} className="w-12 h-12 mx-auto" />,
    disabled: false,
  },
  {
    value: 'PENSIUN',
    label: 'Dana Pensiun',
    description: 'Kredit untuk pensiunan',
    icon: <Image src="/services-4.svg" alt="illustration" width={100} height={100} className="w-12 h-12 mx-auto" />,
    disabled: true,
  },
]

  const jaminanOptions = [
    {
      value: 'SERTIFIKAT',
      title: "Sertifikat",
      description: "Penggunaan sertifikat properti",
      icon: <Image src="/jaminan-1.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
    },
    {
      value: 'BPKB',
      title: "BPKB",
      description: "Dokumen kepemilikan kendaraan bermotor",
      icon: <Image src="/jaminan-2.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
    },
    {
      value: 'SK_PEGAWAI',
      title: "SK Pegawai",
      description: "Penggunaan SK pengangkatan ASN/TNI/POLRI sebagai agunan",
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
  const [step, setStep] = useState<'form' | 'credit' | 'jaminan'>('form')
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // State untuk modal/toast
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setModalMessage('Anda harus login terlebih dahulu');
        setShowWarningToast(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    };
    checkAuth();
  }, [router]);

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
    const newErrors: FormErrors = {}

    if (!formData.nik.trim()) {
      newErrors.nik = 'NIK wajib diisi'
    } else if (formData.nik.length !== 16) {
      newErrors.nik = 'NIK harus 16 digit'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi'
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi'
    }

    if (!formData.tempat_lahir.trim()) {
      newErrors.tempat_lahir = 'Tempat lahir wajib diisi'
    }

    if (!formData.tanggal_lahir) {
      newErrors.tanggal_lahir = 'Tanggal lahir wajib diisi'
    }

    if (!formData.plafond.trim()) {
      newErrors.plafond = 'Plafond wajib diisi'
    } else if (parseInt(formData.plafond) < 1000000) {
      newErrors.plafond = 'Plafond minimal Rp 1.000.000'
    }

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

  const handleBack = () => {
    if (step === 'jaminan') {
      setStep('credit')
    } else if (step === 'credit') {
      setStep('form')
    }
  }

  const handleSubmit = async () => {
    if (!validateJaminan()) return;

    setIsLoading(true);

    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        setModalMessage('Sesi Anda telah berakhir. Silakan login kembali.');
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        'https://satufin.satufin.id/api/v1/credit-applications',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nik: formData.nik,
            nama_lengkap: formData.name,
            tempat_lahir: formData.tempat_lahir,
            tanggal_lahir: formData.tanggal_lahir,
            alamat: formData.alamat,
            jenis_kredit: formData.userChoice,
            plafond: Number(formData.plafond),
            jaminan: formData.userJaminan,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Jika unauthorized, redirect ke login
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setModalMessage('Sesi Anda telah berakhir. Silakan login kembali.');
          setShowErrorModal(true);
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }
        throw new Error(result.message || 'Gagal mengirim data');
      }

      setModalMessage('Terimakasih, anda akan di hubungi oleh Admin');
      setShowSuccessModal(true);
      
    } catch (error: unknown) {
      console.error('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim data';
      setModalMessage(errorMessage);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler untuk menutup modal dan redirect
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push('/monitor-status-kredit');
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
  };

  const handleWarningClose = () => {
    setShowWarningToast(false);
  };

  return (
    <div>
      <NavbarHome />
      
      {/* Render Modals dan Toasts */}
      {showSuccessModal && (
        <SuccessModal 
          message={modalMessage} 
          onClose={handleSuccessClose} 
        />
      )}
      
      {showErrorModal && (
        <ErrorModal 
          message={modalMessage} 
          onClose={handleErrorClose} 
        />
      )}
      
      {showWarningToast && (
        <WarningToast 
          message={modalMessage} 
          onClose={handleWarningClose} 
        />
      )}
      
      {isLoading && (
        <LoadingOverlay message="Mengirim pengajuan kredit..." />
      )}
      
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
                      placeholder="NIK (16 digit)"
                      value={formData.nik}
                      onChange={handleChange}
                      maxLength={16}
                      inputMode="numeric"
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border ${errors.nik ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.nik && <p className="text-red-500 text-sm mt-1 ml-1">{errors.nik}</p>}
                  </div>

                  {/* nama */}
                  <div>
                    <input
                      type="text"
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
                      type="text"
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

                  {/* Button */}
                  <Button
                    type="button"
                    onClick={handleFormContinue}
                    variant="default"
                    className="group hover:cursor-pointer w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform transition-all duration-150"
                  >
                    Pilih Kredit
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
                <div className="px-4 sm:px-0 mb-16">
                  <h1 className="text-center text-2xl sm:text-3xl font-bold">
                    Pilihan Kredit
                  </h1>
                </div>
                <div className="mb-8 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 px-4 sm:px-6">
  {creditOptions.map((service, index) => {
    const selected = formData.userChoice === service.value
    const isDisabled = service.disabled

    return (
      <button
        key={index}
        type="button"
        disabled={isDisabled}
        onClick={() => {
          if (isDisabled) return

          setFormData(prev => ({
            ...prev,
            userChoice: service.value
          }))
          setErrors(prev => ({ ...prev, userChoice: '' }))
        }}
        className={`
          rounded-2xl p-6 sm:p-10 text-center transition-all border-2
          ${
            isDisabled
              ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
              : selected
              ? 'bg-white border-blue-500 shadow-xl ring-2 ring-blue-500'
              : 'bg-white border-transparent shadow-md hover:shadow-xl hover:border-blue-300'
          }
        `}
      >
        <div className={`flex justify-center ${isDisabled ? 'opacity-40' : ''}`}>
          {service.icon}
        </div>

        <h3 className="text-xl font-bold mt-4">{service.label}</h3>
        <p className="mt-2 text-sm">
          {isDisabled ? 'Under Maintenance' : service.description}
        </p>
      </button>
    )
  })}
</div>


                {errors.userChoice && (
                  <p className="text-red-500 text-sm text-center">{errors.userChoice}</p>
                )}

                <Button
                  type="button"
                  onClick={handleCreditContinue}
                  className="group hover:cursor-pointer w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform transition-all duration-150"
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

            {step === 'jaminan' && (
              <section className="mt-24 space-y-3 sm:space-y-5">
                <div className="px-4 sm:px-0 mb-16">
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
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            userJaminan: jaminan.value
                          }))
                          setErrors(prev => ({ ...prev, userJaminan: '' }))
                        }}
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

                {errors.userJaminan && (
                  <p className="text-red-500 text-sm text-center">{errors.userJaminan}</p>
                )}

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="group hover:cursor-pointer w-full text-base sm:text-lg py-4 sm:py-6 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-[0_4px_0_0_theme(colors.blue.600),0_8px_20px_theme(colors.blue.500/0.25)] hover:shadow-[0_6px_0_0_theme(colors.blue.700),0_10px_25px_theme(colors.blue.500/0.3)] active:shadow-[0_2px_0_0_theme(colors.blue.600),0_4px_10px_theme(colors.blue.500/0.2)] active:translate-y-0.5 transform transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Mengirim...' : 'Submit'}
                  {!isLoading && (
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
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full text-base mb-8 sm:text-lg py-4 sm:py-6 rounded-2xl font-bold shadow-[0_4px_0_0_theme(colors.gray.300),0_8px_20px_theme(colors.gray.300/0.25)] hover:shadow-[0_6px_0_0_theme(colors.gray.400),0_10px_25px_theme(colors.gray.300/0.3)] hover:bg-gray-50 active:shadow-[0_2px_0_0_theme(colors.gray.300),0_4px_10px_theme(colors.gray.300/0.2)] active:translate-y-0.5 transform transition-all duration-150 dark:shadow-[0_4px_0_0_theme(colors.gray.600),0_8px_20px_theme(colors.gray.700/0.25)] dark:hover:shadow-[0_6px_0_0_theme(colors.gray.500),0_10px_25px_theme(colors.gray.700/0.3)] dark:hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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