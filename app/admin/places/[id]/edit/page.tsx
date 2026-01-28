import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PlaceForm from "../../place-form";

export default async function EditPlacePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: place, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !place) return <div className="p-8 text-red-500">Không tìm thấy địa điểm.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Chỉnh sửa địa điểm</h1>
          <p className="text-gray-600 mt-1">Cập nhật thông tin cho: {place.name}</p>
        </div>
        <PlaceForm place={place} isEdit={true} />
      </div>
    </div>
  );
}
