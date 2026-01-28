"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, LayoutDashboard, MapPin, LogOut, Users, Settings, MessageSquare } from "lucide-react";
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
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Simple check for UI purposes (Real protection is in page.tsx)
        if (user.email === 'hoangthienluan17@gmail.com' || user.email === 'hoangthienluan17@gmal.com') {
          setIsAdmin(true);
        } else {
          const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
          if (data?.role === 'admin') setIsAdmin(true);
        }
      }
    };
    checkUser();
  }, []);

  const navItems = isAdmin
    ? [
        { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
        { href: "/admin/places", label: "Quản lý địa điểm", icon: MapPin },
        { href: "/admin/comments", label: "Quản lý bình luận", icon: MessageSquare },
        { href: "/admin/users", label: "Quản lý người dùng", icon: Users },
        { href: "/admin/profile", label: "Tài khoản", icon: Settings },
      ]
    : [{ href: "/admin/profile", label: "Tài khoản", icon: Settings }];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
