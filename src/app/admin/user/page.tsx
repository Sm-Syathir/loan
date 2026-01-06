"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import {
  LogOut,
  Home,
  Search,
  FileText,
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  Users,
  Shield,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  last_login: string;
  is_active: boolean;
}

export default function AllUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndFetchUsers = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        // Ambil token untuk fetch data users
        const token = session.access_token;
        
        // Fetch data users dari API
        const res = await fetch("https://be-loan-production.up.railway.app/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const json = await res.json();

          // Cari current user dari response untuk cek role
          const currentUser = json.data.find((u: any) => (u.email || '').toLowerCase() === (session.user?.email || '').toLowerCase());

          if (!currentUser) {
            alert('User tidak ditemukan atau tidak terdaftar');
            router.replace('/');
            return;
          }

          const roleId = currentUser.role_id ?? currentUser.role?.id ?? null;
          if (Number(roleId) !== 1) {
            alert('Akses ditolak: hanya Admin yang dapat mengakses halaman ini');
            router.replace('/');
            return;
          }

          // Format data users dengan informasi tambahan
          const formattedUsers = json.data.map((user: any) => ({
            id: user.id || user.user_id || "",
            email: user.email || "",
            name: user.name || user.nama_lengkap || "N/A",
            role: (user.role && (user.role.nama_role || user.role.name)) || user.role || "user",
            created_at: user.created_at || new Date().toISOString(),
            last_login: user.last_login_at || new Date().toISOString(),
            is_active: true
          }));

          setUsers(formattedUsers);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    checkSessionAndFetchUsers();
  }, [router]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterRole === "all") return matchesSearch;
    return matchesSearch && user.role === filterRole;
  });

  const getRoleColor = (role: string) => {
    switch(role.toLowerCase()) {
      case "admin": return "bg-purple-100 text-purple-800";
      case "user": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const handleBackToDashboard = () => {
    router.push("/admin/dashboard");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-500 text-sm">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
     

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Statistik */}

          {/* Filter dan Pencarian */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Pengguna */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Bergabung
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Login Terakhir
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Tidak ada data pengguna yang ditemukan</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-gray-700">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.is_active)}`}>
                            {user.is_active ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Aktif
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Nonaktif
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                           
                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                           
                            {new Date(user.last_login).toLocaleString('id-ID')}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}