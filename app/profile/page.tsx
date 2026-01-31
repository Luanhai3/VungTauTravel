import { getSupabaseServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { User, Mail, LogOut, Calendar, Heart, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Profile() {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Check admin status
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

  const joinDate = new Date(user.created_at).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
             <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <div className="px-8 pb-8 relative">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20 mb-8">
              <div className="relative w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex-shrink-0">
                 {user.user_metadata.avatar_url ? (
                    <Image 
                      src={user.user_metadata.avatar_url} 
                      alt="Avatar" 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <User className="w-20 h-20" />
                    </div>
                 )}
              </div>
              
              <div className="flex-1 mb-2">
                <h1 className="text-3xl font-black text-gray-900 mb-1">
                  {user.user_metadata.full_name || user.email?.split('@')[0]}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Tham gia: {joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="mb-2 flex flex-wrap gap-3">
                 {isAdmin && (
                    <Link 
                      href="/admin"
                      className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full transition-colors shadow-lg shadow-primary-600/20"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                 )}
                 <form action={signOut}>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </form>
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sidebar / Stats */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Thống kê</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Đã lưu</span>
                      <span className="font-bold text-gray-900">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bình luận</span>
                      <span className="font-bold text-gray-900">0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Địa điểm yêu thích</h3>
                  <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4 text-gray-300">
                      <Heart className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500">Bạn chưa lưu địa điểm nào.</p>
                    <Link href="/#places" className="text-primary-600 font-bold hover:underline mt-2 inline-block">
                      Khám phá ngay
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}