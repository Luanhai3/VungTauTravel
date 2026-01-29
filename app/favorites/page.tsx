"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight, Heart } from "lucide-react";
import Footer from "@/components/Footer";
import { Place } from "@/lib/data";
import { createClient } from "@/utils/supabase/client";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Place[]>([]);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?next=/favorites");
        return;
      }

      const { data } = await supabase
        .from("favorites")
        .select("place_id")
        .eq("user_id", user.id);

      if (data) {
        const placeIds = data.map((item) => item.place_id);
        if (placeIds.length > 0) {
          const { data: placesData } = await supabase
            .from("places")
            .select("*")
            .in("id", placeIds);

          if (placesData) {
            const mappedPlaces: Place[] = placesData.map((p: any) => ({
              ...p,
              imageUrl: p.image_url,
              googleMapsUrl: p.google_maps_url
            }));
            setFavorites(mappedPlaces);
          }
        }
      }
    };

    fetchFavorites();
  }, [router, supabase]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-32 pb-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            Địa điểm yêu thích
          </h1>
          <p className="text-gray-600 text-lg">
            Danh sách những nơi bạn đã lưu lại
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        {favorites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg mb-4">Bạn chưa có địa điểm yêu thích nào.</p>
            <Link href="/" className="text-primary-600 font-medium hover:underline">
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {favorites.map((place) => (
              <Link key={place.id} href={`/places/${place.id}`} className="group cursor-pointer bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 block">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl mb-4 bg-gray-100">
                  <Image
                    src={imageError[place.id] ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" : place.imageUrl}
                    alt={place.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => setImageError((prev) => ({ ...prev, [place.id]: true }))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <button
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-600 hover:text-white shadow-lg"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 px-2 pb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {place.name}
                  </h3>
                  <div className="flex items-start gap-2 text-gray-500">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <p className="text-sm leading-relaxed line-clamp-1">{place.address}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}