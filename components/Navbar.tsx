"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Search, Heart, User } from "lucide-react";
import Image from "next/image";
import { getSupabaseBrowser } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface NavbarProps {
  initialUser: SupabaseUser | null;
  initialRole: string;
}

export default function Navbar({ initialUser }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = getSupabaseBrowser();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(initialUser);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user ?? null);
      });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/places/") || pathname === "/signup") {
    return null;
  }

  const navBg = scrolled
    ? "bg-[#F5FAFF]/80 backdrop-blur-xl border-b border-slate-200/60 supports-[backdrop-filter]:bg-[#F5FAFF]/60"
    : "bg-transparent";

  const textColor = scrolled ? "text-slate-800" : "text-white";

  const hoverLink =
    scrolled ? "text-slate-500 hover:text-teal-600 transition-colors duration-300" : "text-white/80 hover:text-white transition-colors duration-300";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`text-2xl font-black tracking-tight ${textColor}`}
          >
            VŨNG TÀU
            <span className="text-teal-500">.</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { name: "Khám phá", href: "/#categories" },
              { name: "Địa điểm", href: "/#places" },
              { name: "Về Vũng Tàu", href: "/#about" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium uppercase tracking-wider ${hoverLink}`}
              >
                {item.name}
              </Link>
            ))}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 rounded-full transition hover:bg-black/5 ${scrolled ? "text-slate-600" : "text-white/90"}`}
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() =>
                  router.push(user ? "/admin/profile" : "/admin/login")
                }
                className={`p-2 rounded-full transition hover:bg-black/5 ${scrolled ? "text-slate-600" : "text-white/90"}`}
              >
                <Heart className="w-5 h-5" />
              </button>

              <Link
                href={user ? "/admin/profile" : "/admin/login"}
                className={`ml-2 px-4 py-2 rounded-full text-sm font-semibold transition
                  ${
                    user
                      ? "bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/20"
                      : `border ${scrolled ? "border-slate-300 text-slate-700 hover:bg-slate-50" : "border-white/30 text-white hover:bg-white/10"}`
                  }
                `}
              >
                {user ? "Tài khoản" : "Đăng nhập"}
              </Link>
            </div>
          </div>

          {/* Mobile */}
          <button
            onClick={() => setIsOpen(true)}
            className={`md:hidden ${textColor}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-[#F5FAFF]/95 backdrop-blur-2xl flex items-center px-4">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-3xl mx-auto flex items-center gap-4 border-b border-slate-200 pb-3"
          >
            <Search className="w-6 h-6 text-slate-400" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm địa điểm, trải nghiệm..."
              className="flex-1 text-2xl font-light outline-none bg-transparent text-slate-900 placeholder-slate-300"
            />
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="w-8 h-8 text-slate-400 hover:text-slate-900 transition-colors" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[70] bg-black/50 transition ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 z-[80] h-full w-[320px] bg-white border-l border-slate-100 shadow-2xl transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-4">
          {[
            { name: "Khám phá", href: "/#categories" },
            { name: "Địa điểm", href: "/#places" },
            { name: "Về Vũng Tàu", href: "/#about" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block text-2xl font-light text-slate-800 hover:text-teal-500 transition-colors"
            >
              {item.name}
            </Link>
          ))}

          <Link
            href={user ? "/admin/profile" : "/admin/login"}
            className="block mt-8 px-6 py-4 rounded-full text-center font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all"
          >
            {user ? "Tài khoản" : "Đăng nhập"}
          </Link>
        </div>
      </aside>
    </>
  );
}
