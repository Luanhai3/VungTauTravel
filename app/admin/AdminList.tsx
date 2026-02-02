"use client";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getImageUrl } from "@/lib/getImageUrl";

export default function AdminList({ places }: { places: any[] }) {
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa địa điểm này?")) return;
    await supabase.from("places").delete().eq("id", id);
    location.reload();
  };

  return (
    <div className="min-h-screen p-10 text-white bg-gradient-to-br from-sky-900 via-blue-900 to-emerald-900">
      <h1 className="mb-8 text-3xl font-bold">Admin • Danh sách địa điểm</h1>

      <Link
        href="/admin/new"
        className="mb-6 inline-block rounded-lg bg-white px-4 py-2 font-semibold text-black"
      >
        ➕ Thêm địa điểm mới
      </Link>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {places.map((place) => {
          const imageUrl = getImageUrl(place.image);

          return (
            <div
              key={place.id}
              className="overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg"
            >
              {imageUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={imageUrl}
                    alt={place.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-2 p-4">
                <h2 className="text-xl font-semibold">{place.title}</h2>
                <p className="line-clamp-2 text-sm opacity-80">
                  {place.description}
                </p>

                <div className="flex items-center justify-between pt-3">
                  <span className="rounded bg-white/20 px-2 py-1 text-xs">
                    {place.category}
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDelete(place.id)}
                      className="text-sm text-red-300 hover:text-red-500"
                    >
                      Xóa
                    </button>

                    <Link
                      href={`/admin/${place.id}`}
                      className="text-sm text-blue-300 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
