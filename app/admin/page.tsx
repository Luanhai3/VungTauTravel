import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, MessageSquare, Users } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Check admin
  let isAdmin = false;
  if (user.email === 'hoangthienluan17@gmail.com' || user.email === 'hoangthienluan17@gmal.com') {
    isAdmin = true;
  } else {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role === 'admin') {
      isAdmin = true;
    }
  }

  if (!isAdmin) {
    return redirect("/");
  }

  // Fetch stats
  const { count: placesCount } = await supabase.from('places').select('*', { count: 'exact', head: true });
  const { count: commentsCount } = await supabase.from('comments').select('*', { count: 'exact', head: true });

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Tổng quan</h1>
          <p className="text-gray-600 mt-1">Chào mừng quay trở lại bảng điều khiển.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/places" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700">Địa điểm</h3>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <MapPin className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-3xl font-black text-gray-900">{placesCount || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Địa điểm đã đăng</p>
            </Link>

            <Link href="/admin/comments" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700">Bình luận</h3>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-3xl font-black text-gray-900">{commentsCount || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Bình luận từ người dùng</p>
            </Link>
            
             <Link href="/admin/users" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700">Người dùng</h3>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-3xl font-black text-gray-900">--</p>
                <p className="text-sm text-gray-500 mt-1">Tài khoản hệ thống</p>
            </Link>
        </div>
      </div>
    </div>
  );
}