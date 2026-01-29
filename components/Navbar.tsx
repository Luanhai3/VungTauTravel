"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Search, Heart, User } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface NavbarProps {
  initialUser: SupabaseUser | null;
  initialRole: string;
}

export default function Navbar({ initialUser, initialRole }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(initialUser);
  const [role, setRole] = useState<string>(initialRole);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Role will be updated on page reload, which is handled by redirects on login/logout
      setRole(session ? (role === 'guest' ? 'user' : role) : 'guest');
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const navClasses = scrolled
    ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
    : "bg-transparent py-5";

  const textClasses = scrolled ? "text-gray-900" : "text-white";
  const hoverClasses = scrolled ? "hover:text-primary-600" : "hover:text-primary-200";
  const iconHoverClasses = scrolled ? "hover:bg-gray-100" : "hover:bg-white/10";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleHeartClick = () => {
    if (user) {
      router.push("/admin/profile");
    } else {
      router.push("/admin/login");
    }
  };

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/places/")) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClasses}`} suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className={`text-2xl md:text-3xl font-black tracking-tighter uppercase transition-colors ${textClasses}`}>
              VŨNG TÀU
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {[
                  { name: "Khám phá", href: "/#categories" },
                  { name: "Địa điểm", href: "/#places" },
                  { name: "Về Vũng Tàu", href: "/#about" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-bold uppercase tracking-wide transition-colors ${textClasses} ${hoverClasses}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className={`w-px h-6 ${scrolled ? "bg-gray-200" : "bg-white/30"}`} />

              {/* Utilities */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`p-2 rounded-full transition-colors ${iconHoverClasses} ${textClasses}`}
                  aria-label="Tìm kiếm"
                  title="Tìm kiếm"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className={`p-2 rounded-full transition-colors ${iconHoverClasses} ${textClasses}`}
                  aria-label="Yêu thích"
                  title="Yêu thích"
                  onClick={handleHeartClick}
                >
                  <Heart className="w-5 h-5" />
                </button>
                <Link 
                  href={user ? "/admin/profile" : "/admin/login"}
                  className={`p-2 rounded-full transition-colors ${iconHoverClasses} ${textClasses} ${user ? 'bg-primary-600 text-white hover:bg-primary-700' : ''}`}
                  aria-label={user ? "Tài khoản" : "Đăng nhập"}
                  title={user ? "Tài khoản" : "Đăng nhập"}
                >
                  <User className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className={`md:hidden transition-colors ${textClasses}`}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute inset-0 z-50 bg-white flex items-center px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-top-5 duration-200 shadow-md">
            <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm địa điểm, trải nghiệm..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-lg text-gray-900 placeholder-gray-400 outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 z-[70] w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-6 border-b border-gray-100">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-4 space-y-2 overflow-y-auto">
            {[
              { name: "Khám phá", href: "/#categories" },
              { name: "Địa điểm", href: "/#places" },
              { name: "Về Vũng Tàu", href: "/#about" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            <Link
              href={user ? "/admin/profile" : "/admin/login"}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    {user.user_metadata.avatar_url ? (
                      <Image 
                        src={user.user_metadata.avatar_url} 
                        alt={`Ảnh đại diện của ${user.user_metadata.full_name || "bạn"}`}
                        title="Trang cá nhân"
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <span className="font-semibold">{user.user_metadata.full_name || user.email?.split('@')[0]}</span>
                </div>
              ) : (
                "Đăng nhập"
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
