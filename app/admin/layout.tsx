"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, LayoutDashboard, MapPin, LogOut, Users, Settings, MessageSquare, Mail, Send, Menu, X } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Simple check for UI purposes (Real protection is in page.tsx)
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data?.role === 'admin') setIsAdmin(true);
      }
    };
    checkUser();
  }, []);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = isAdmin
    ? [
        { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
        { href: "/admin/places", label: "Quản lý địa điểm", icon: MapPin },
        { href: "/admin/comments", label: "Quản lý bình luận", icon: MessageSquare },
        { href: "/admin/users", label: "Quản lý người dùng", icon: Users },
        { href: "/admin/subscribers", label: "Người đăng ký", icon: Mail },
        { href: "/admin/newsletter/list", label: "Newsletter", icon: Send },
        { href: "/admin/profile", label: "Tài khoản", icon: Settings },
      ]
    : [{ href: "/admin/profile", label: "Tài khoản", icon: Settings }];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <span className="font-bold text-lg text-gray-900">Admin Panel</span>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors mb-2"
          >
            <Home className="w-5 h-5" />
            <span>Về trang chủ</span>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8">{children}</main>
    </div>
  );
}
