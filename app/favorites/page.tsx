"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight, Heart } from "lucide-react";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/client";

/* ✅ Type tách riêng, KHÔNG phụ thuộc lib/data */
interface Place {
  id: string;
  name: string;
  image_url: string | null;
  address: string | null;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Place[]>([]);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchFavorites = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?next=/favorites");
        return;
      }

      /* ✅ JOIN trực tiếp favorites → places */
      const { data, error } = await supabase
        .from("favorites")
        .select(
          `
          places (
            id,
            name,
            image_url,
            address
          )
        `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Fetch favorites error:", error);
        return;
      }

      if (data) {
        const mapped = data
          .map((item: any) => item.places)
          .filter(Boolean);

        setFavorites(mapped);
      }
    };

    fetchFavorites();
  }, [router, supabase]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-32 pb-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            Địa điểm yêu thích
          </h1>
          <p className="text-gray-600 text-lg">
            Danh sách những nơi bạn đã lưu lại
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 pb-20">
        {favorites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg mb-4">
              Bạn chưa có địa điểm yêu thích nào.
            </p>
            <Link
              href="/"
              className="text-primary-600 font-medium hover:underline"
            >
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((place) => (
              <Link
                key={place.id}
                href={`/places/${place.id}`}
                className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition border"
              >
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-gray-100">
                  <Image
                    src={
                      imageError[place.id]
                        ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
                        : place.image_url || ""
                    }
                    alt={place.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700"
                    onError={() =>
                      setImageError((prev) => ({
                        ...prev,
                        [place.id]: true,
                      }))
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />

                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition shadow-lg">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">
                  {place.name}
                </h3>

                {place.address && (
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm line-clamp-1">{place.address}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
