"use client";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AdminList({ places }: { places: any[] }) {
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Xóa địa điểm này?");
    if (!confirmDelete) return;

    await supabase.from("places").delete().eq("id", id);
    location.reload();
  };

  return (
    <div className="min-h-screen p-10 text-white bg-gradient-to-br from-sky-900 via-blue-900 to-emerald-900">
      <h1 className="text-3xl font-bold mb-8">Admin • Danh sách địa điểm</h1>
	  <Link
  href="/admin/new"
  className="inline-block mb-6 bg-white text-black px-4 py-2 rounded-lg font-semibold"
>
  ➕ Thêm địa điểm mới
  
</Link>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {places.map((place) => (
          <div
            key={place.id}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden"
          >
            {place.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={place.image}
                  alt={place.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">{place.title}</h2>
              <p className="text-sm opacity-80 line-clamp-2">
                {place.description}
              </p>

              <div className="flex justify-between items-center pt-3">
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {place.category}
                </span>

                <button
                  onClick={() => handleDelete(place.id)}
                  className="text-red-300 hover:text-red-500 text-sm"
                >
                  Xóa
                </button>
				<Link
  href={`/admin/${place.id}`}
  className="text-blue-300 hover:underline text-sm"
>
  Edit
</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
