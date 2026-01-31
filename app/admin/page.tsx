import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { MapPin, MessageSquare, Users, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Lấy thống kê dữ liệu từ Supabase
  const { count: placesCount } = await supabase.from('places').select('*', { count: 'exact', head: true });
  const { count: commentsCount } = await supabase.from('comments').select('*', { count: 'exact', head: true });
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: subscribersCount } = await supabase.from('subscribers').select('*', { count: 'exact', head: true });

  const stats = [
    { 
      label: "Địa điểm", 
      value: placesCount || 0, 
      icon: MapPin, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      href: "/admin/places" 
    },
    { 
      label: "Bình luận", 
      value: commentsCount || 0, 
      icon: MessageSquare, 
      color: "text-green-600", 
      bg: "bg-green-50",
      href: "/admin/comments" 
    },
    { 
      label: "Người dùng", 
      value: usersCount || 0, 
      icon: Users, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      href: "/admin/users" 
    },
    { 
      label: "Đăng ký tin", 
      value: subscribersCount || 0, 
      icon: Mail, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      href: "/admin/newsletter/list" 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-500 mt-2">
            Xin chào, <span className="font-semibold text-gray-900">{user.user_metadata.full_name || user.email}</span> 👋
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={index} 
              href={stat.href}
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="flex items-center text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                  Chi tiết <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Quản lý nội dung Vũng Tàu Travel</h2>
        <p className="text-teal-100 mb-6 max-w-2xl">
          Hệ thống quản trị giúp bạn dễ dàng cập nhật địa điểm, kiểm duyệt bình luận và quản lý người dùng.
        </p>
        <Link 
          href="/admin/places" 
          className="inline-flex items-center px-5 py-2.5 bg-white text-teal-600 font-bold rounded-lg hover:bg-teal-50 transition-colors shadow-sm"
        >
          Thêm địa điểm mới
        </Link>
      </div>
    </div>
  );
}
