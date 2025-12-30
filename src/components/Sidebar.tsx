
"use client";


import {
    Book,
  Home,
  User
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-xl p-6 hidden md:block h-screen sticky top-0 overflow-y-auto">
      {/* Logo/Brand Section */}
    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
    <span className="text-white font-bold text-lg">L</span>
  </div>

  <div>
    <h2 className="text-xl font-bold">Loan</h2>
  </div>

  <div className="ml-auto">
    <Link href="/home">
      <img
        src="/back.png"
        alt="back"
        className="w-6 h-6 cursor-pointer"
      />
    </Link>
  </div>
</div>

      

      <nav className="flex flex-col gap-2">
        {/* DASHBOARD */}
        <Link
          href="/dashboard"
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
            ${isActive("/dashboard") 
              ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border border-blue-100" 
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }
          `}
        >
          <Home className={`h-5 w-5 ${isActive("/dashboard") ? "text-blue-600" : "text-gray-500"}`} />
          <span className="text-sm font-medium">Dashboard</span>
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
      </nav>
    </aside>
  );
}
