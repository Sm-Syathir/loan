"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import {
  LogOut,
  Home,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  RefreshCw,
  X,
  Check,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { User } from "lucide-react";


interface ApplicationStatus {
  id: number;
  application_id: number;
  status: string;
  changed_by: string;
  catatan: string;
  created_at: string;
  application?: {
    kode_pengajuan: string;
    nama_lengkap: string;
  };
  profile?: {
    name: string;
    email: string;
  };
}

interface CreditApplication {
  id: number;
  kode_pengajuan: string;
  nama_lengkap: string;
  jenis_kredit: string;
  plafond: number;
  jaminan: string;
  catatan: string;
  created_at: string;
  status?: string;
}

const SuccessToast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-8 duration-300">
      <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 shadow-lg max-w-sm">
        <div className="flex items-start">
          <Check className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-800 text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ErrorToast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-8 duration-300">
      <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-lg max-w-sm">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-red-600 hover:text-red-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const WarningModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Perhatian</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <Button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-lg"
          >
            Oke
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<CreditApplication[]>([]);
  const [applicationStatuses, setApplicationStatuses] = useState<ApplicationStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<CreditApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();

  const statusOptions = [
    { value: "DIAJUKAN", label: "Diajukan", color: "bg-yellow-100 text-yellow-800" },
    { value: "DIPROSES", label: "Diproses", color: "bg-blue-100 text-blue-800" },
    { value: "DITERIMA", label: "Diterima", color: "bg-green-100 text-green-800" },
    { value: "DITOLAK", label: "Ditolak", color: "bg-red-100 text-red-800" },
  ];

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        const token = session.access_token;
        const res = await fetch("https://be-loan-production.up.railway.app/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const json = await res.json();
          const currentUser = json.data.find((u: any) => (u.email || '').toLowerCase() === (session.user?.email || '').toLowerCase());

          if (!currentUser) {
            setToastMessage("User tidak ditemukan atau tidak terdaftar");
            setShowWarningModal(true);
            setTimeout(() => router.replace("/home"), 1500);
            return;
          }

          // STRICT check: role_id === 1 is Admin
          const roleId = currentUser.role_id ?? currentUser.role?.id ?? null;
          if (Number(roleId) !== 1) {
            setToastMessage("Akses ditolak: hanya Admin yang dapat mengakses halaman ini");
            setShowWarningModal(true);
            setTimeout(() => router.replace("/home"), 1500);
            return;
          }

          setUser(currentUser);
        }

        await Promise.all([
          fetchApplications(token),
          fetchApplicationStatuses(token)
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setToastMessage("Terjadi kesalahan saat memverifikasi akses");
        setShowWarningModal(true);
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      }
    };

    checkSession();
  }, [router]);

  const fetchApplications = async (token: string) => {
    try {
      setLoadingApplications(true);
      const res = await fetch("https://be-loan-production.up.railway.app/credit-applications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const json = await res.json();
        setApplications(json.data || []);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const fetchApplicationStatuses = async (token: string) => {
    try {
      setLoadingStatus(true);
      const res = await fetch("https://be-loan-production.up.railway.app/application-status", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const json = await res.json();
        setApplicationStatuses(json.data || []);
      }
    } catch (error) {
      console.error("Error fetching application statuses:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  const getLatestStatus = (applicationId: number) => {
    const statuses = applicationStatuses.filter(status => status.application_id === applicationId);
    return statuses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  };

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication || !newStatus) {
      setToastMessage("Harap pilih status");
      setShowWarningModal(true);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const token = session.access_token;

      const res = await fetch("https://be-loan-production.up.railway.app/application-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          application_id: selectedApplication.id,
          status: newStatus
        })
      });

      if (res.ok) {
        const result = await res.json();
        setToastMessage("Status berhasil diperbarui");
        setShowSuccessToast(true);
        setShowStatusModal(false);
        setNewStatus("");
        setSelectedApplication(null);
        
        await Promise.all([
          fetchApplications(token),
          fetchApplicationStatuses(token)
        ]);
        
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 3000);
      } else {
        const errorData = await res.json().catch(() => ({ message: "Terjadi kesalahan" }));
        setToastMessage("Gagal memperbarui status: " + (errorData.message || "Unknown error"));
        setShowErrorToast(true);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setToastMessage("Terjadi kesalahan saat memperbarui status");
      setShowErrorToast(true);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (!app) return false;

    const name = app.nama_lengkap || ""; 
    const kode = app.kode_pengajuan || ""; 

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kode.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedStatus === "all") return matchesSearch;

    const latestStatus = getLatestStatus(app.id);
    return matchesSearch && latestStatus?.status === selectedStatus;
  });

  const handleRefresh = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        await Promise.all([
          fetchApplications(session.access_token),
          fetchApplicationStatuses(session.access_token)
        ]);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const handleSuccessToastClose = () => {
    setShowSuccessToast(false);
  };

  const handleErrorToastClose = () => {
    setShowErrorToast(false);
  };

  const handleWarningModalClose = () => {
    setShowWarningModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {showSuccessToast && (
        <SuccessToast 
          message={toastMessage} 
          onClose={handleSuccessToastClose} 
        />
      )}
      
      {showErrorToast && (
        <ErrorToast 
          message={toastMessage} 
          onClose={handleErrorToastClose} 
        />
      )}
      
      {showWarningModal && (
        <WarningModal 
          message={toastMessage} 
          onClose={handleWarningModalClose} 
        />
      )}
      
     <nav className="bg-white border-b border-gray-200 shadow-sm">
  <div className="px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">L</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Loan</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
  <Button
    variant="ghost"
    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
    onClick={() => router.push("/admin/dashboard")}
  >
    <FileText className="h-5 w-5" />
    <span className="hidden sm:inline">Dashboard</span>
  </Button>

  <Button
    variant="ghost"
    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
    onClick={() => router.push("/admin/user")}
  >
    <User className="h-5 w-5" />
    <span className="hidden sm:inline">Users</span>
  </Button>


        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          onClick={() => router.push("/home")}
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Log out</span>
        </Button>
      </div>
    </div>
  </div>
</nav>

      <div className="p-15">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Selamat datang Admin, {user?.name || "Admin"} 👋
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Pengajuan</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{applications.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Diajukan</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {applications.filter(app => {
                      const status = getLatestStatus(app.id);
                      return status?.status === "DIAJUKAN";
                    }).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Diterima</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {applications.filter(app => {
                      const status = getLatestStatus(app.id);
                      return status?.status === "DITERIMA";
                    }).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Ditolak</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {applications.filter(app => {
                      const status = getLatestStatus(app.id);
                      return status?.status === "DITOLAK";
                    }).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama atau kode pengajuan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Semua Status</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleRefresh}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kode Pengajuan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Lengkap
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Kredit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plafond
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loadingApplications || loadingStatus ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                        <p className="mt-2 text-gray-500">Memuat data...</p>
                      </td>
                    </tr>
                  ) : filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Tidak ada data pengajuan yang ditemukan</p>
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => {
                      const latestStatus = getLatestStatus(app.id);
                      return (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{app.kode_pengajuan || "-"}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">{app.nama_lengkap || "-"}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-700">{app.jenis_kredit || "-"}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">
                              {app.plafond ? `Rp ${app.plafond.toLocaleString('id-ID')}` : "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {latestStatus ? (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(latestStatus.status)}`}>
                                {getStatusLabel(latestStatus.status)}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Belum ada status
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString('id-ID') : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setShowDetailModal(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Detail
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setShowStatusModal(true);
                                  setNewStatus(latestStatus?.status || "DIAJUKAN");
                                }}
                                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                              >
                                Ubah Status
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-2xl border-2 border-grey-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Detail Pengajuan</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Kode Pengajuan</p>
                    <p className="font-medium">{selectedApplication.kode_pengajuan || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nama Lengkap</p>
                    <p className="font-medium">{selectedApplication.nama_lengkap || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jenis Kredit</p>
                    <p className="font-medium">{selectedApplication.jenis_kredit || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Plafond</p>
                    <p className="font-medium">
                      {selectedApplication.plafond ? `Rp ${selectedApplication.plafond.toLocaleString('id-ID')}` : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jaminan</p>
                    <p className="font-medium">{selectedApplication.jaminan || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
                    <p className="font-medium">
                      {selectedApplication.created_at ? new Date(selectedApplication.created_at).toLocaleString('id-ID') : "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Catatan</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-800">
                      {
                        applicationStatuses
                          .filter(status => status.application_id === selectedApplication.id)
                          .sort(
                            (a, b) =>
                              new Date(b.created_at).getTime() -
                              new Date(a.created_at).getTime()
                          )[0]?.catatan || "-"
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Riwayat Status</p>
                  <div className="space-y-3">
                    {applicationStatuses
                      .filter(status => status.application_id === selectedApplication.id)
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map(status => (
                        <div key={status.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(status.status)}`}>
                              {getStatusLabel(status.status)}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {status.created_at ? new Date(status.created_at).toLocaleString('id-ID') : "-"}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                  className="mr-2"
                >
                  Tutup
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowStatusModal(true);
                    setNewStatus(getLatestStatus(selectedApplication.id)?.status || "DIAJUKAN");
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ubah Status
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && selectedApplication && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-2xl border-2 border-grey-800 rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Ubah Status Pengajuan</h3>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus("");
                    setSelectedApplication(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Kode Pengajuan</p>
                <p className="font-medium">{selectedApplication.kode_pengajuan || "-"}</p>
                <p className="text-sm text-gray-500 mt-2">Nama: {selectedApplication.nama_lengkap || "-"}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">Status</p>
                <div className="grid grid-cols-2 gap-3">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setNewStatus(option.value)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        newStatus === option.value
                          ? `${option.color.split(' ')[0]} border-current`
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <p className={`font-medium ${newStatus === option.value ? option.color.split(' ')[1] : 'text-gray-700'}`}>
                        {option.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus("");
                    setSelectedApplication(null);
                  }}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={!newStatus}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}