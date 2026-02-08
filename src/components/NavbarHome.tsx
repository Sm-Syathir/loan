"use client";
import React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/app/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Tentang Satufin", href: "#About", scroll: true },
  { name: "Produk", href: "#product-section", scroll: true },
  { name: "Blog", href: "", blog: true },
];

export const NavbarHome = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showUnderMaintenance, setShowUnderMaintenance] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuItemClick = (item: any, e: React.MouseEvent) => {
    if (item.scroll) {
      e.preventDefault();
      const id = item.href.replace("#", "");
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
      setMenuState(false);
    } else if (item.blog) {
      e.preventDefault();
      setShowUnderMaintenance(true);
      setMenuState(false);
    }
  };

  return (
    <header>
      <nav data-state={menuState && "active"} className="fixed group z-50 w-full px-2">
        <div
          className={cn(
            "mx-auto mt-2 max-w-7xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
            "bg-background/50 max-w-5xl rounded-2xl border backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm text-gray-500">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    {item.scroll || item.blog ? (
                      <button
                        onClick={(e) => handleMenuItemClick(item, e)}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150 hover:text-black cursor-pointer"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150 hover:text-black"
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      {item.scroll || item.blog ? (
                        <button
                          onClick={(e) => handleMenuItemClick(item, e)}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150 cursor-pointer"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full lg:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        "https://mediumspringgreen-wallaby-250953.hostingersite.com/api/v1/auth/logout",
                        {
                          method: "POST",
                          credentials: "include", // in case you use cookies
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`, // include JWT if needed
                          },
                        }
                      );

                      const data = await response.json();

                      if (!response.ok) {
                        throw new Error(data.message || "Logout gagal");
                      }

                      // Hapus token dari localStorage atau cookie
                      localStorage.removeItem("token");

                      // Redirect ke halaman login atau home
                      router.push("/");
                    } catch (error: any) {
                      console.error("Logout error:", error);
                      alert(error.message || "Terjadi kesalahan saat logout");
                    }
                  }}
                  className={cn(
                    `cursor-pointer border-red-500 text-red-500 hover:bg-red-500 hover:text-white ${isScrolled ? "lg:inline-flex" : "inline-flex"
                    }`
                  )}
                >
                  <p>Log out</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showUnderMaintenance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Under Maintenance</h2>
            <p className="text-gray-600 mb-6">
              Blog page sedang dalam pengembangan. Silahkan kembali lagi nanti!
            </p>
            <button
              onClick={() => setShowUnderMaintenance(false)}
              className="bg-[#0C0A3E] text-white px-6 py-2 rounded-full font-medium hover:bg-[#0C0A3E]/90 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarHome;
