import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PlaceTable from "./place-table";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function PlacesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && user.email !== "hoangthienluan17@gmail.com") return redirect("/forbidden");

  // Fetch places
  const { data: places, error } = await supabase
    .from("places")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return <div className="p-8 text-red-500">Lỗi: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Quản lý địa điểm</h1>
            <p className="text-gray-600 mt-1">Danh sách các địa điểm du lịch trong hệ thống.</p>
          </div>
          <Link href="/admin/places/add" className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Thêm mới
          </Link>
        </div>
        <PlaceTable places={places || []} />
      </div>
    </div>
  );
}