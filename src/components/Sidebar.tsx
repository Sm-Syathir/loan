"use client";

import { Book, Home, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Logo from "./Logo";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (route: string) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      console.error("Logout error", e);
    }
    try {
      await signOut({ redirect: false });
    } catch (e) {
      console.error("next-auth signOut error", e);
    }
    router.push("/");
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-xl p-6 hidden md:flex flex-col h-screen sticky top-0">
      {/* Logo/Brand Section */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
        <Logo/>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col">
        <div className="flex flex-col gap-2">
          {/* DASHBOARD */}
          <Link
            href="/home"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
              ${isActive("/home") 
                ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border border-blue-100" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <Home className={`h-5 w-5 ${isActive("/home") ? "text-blue-600" : "text-gray-500"}`} />
            <span className="text-sm font-medium">Kembali ke Home</span>
          </Link>

          {/* MONITOR LOAN STATUS */}
          <Link
            href="/monitor-status-kredit"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
              ${isActive("/monitor-status-kredit") 
                ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border border-blue-100" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <Book className={`h-5 w-5 ${isActive("/monitor-status-kredit") ? "text-blue-600" : "text-gray-500"}`} />
            <span className="text-sm font-medium">Monitor Status Kredit</span>
          </Link>

          {/* PROFILE */}
          <Link
            href="/profile"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
              ${isActive("/profile") 
                ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border border-blue-100" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <User className={`h-5 w-5 ${isActive("/profile") ? "text-blue-600" : "text-gray-500"}`} />
            <span className="text-sm font-medium">Profile</span>
          </Link>
        </div>

        {/* Logout Button - di bagian bawah */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-600 transition-all duration-200 py-2.5 rounded-xl font-medium"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Log out
          </Button>
        </div>
      </nav>
    </aside>
  );
}