"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import { Place, Category } from "@/lib/data";
import { createClient } from "@/utils/supabase/client";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const categories: Category[] = ["Ăn uống", "Hẹn hò", "Check-in", "Du lịch"];
  const supabase = createClient();

  useEffect(() => {
    const fetchResults = async () => {
      let queryBuilder = supabase.from('places').select('*');

      if (query) {
        // Tìm kiếm theo tên hoặc địa chỉ (case-insensitive)
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,address.ilike.%${query}%`);
      }

      if (selectedCategory) {
        queryBuilder = queryBuilder.eq('category', selectedCategory);
      }

      const { data, error } = await queryBuilder;

      if (data && !error) {
        const mappedPlaces: Place[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          imageUrl: p.image_url,
          description: p.description,
          address: p.address,
          googleMapsUrl: p.google_maps_url,
          isFeatured: p.is_featured
        }));
        setResults(mappedPlaces);
      } else {
        setResults([]);
      }
    };

    fetchResults();
  }, [query, selectedCategory, supabase]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-32 pb-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kết quả tìm kiếm
          </h1>
          <p className="text-gray-600 text-lg">
            {query || selectedCategory 
              ? `Tìm thấy ${results.length} kết quả${query ? ` cho "${query}"` : ""}${selectedCategory ? ` thuộc mục "${selectedCategory}"` : ""}`
              : "Vui lòng nhập từ khóa tìm kiếm hoặc chọn danh mục"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg mb-4">
              {query || selectedCategory ? "Không tìm thấy địa điểm nào phù hợp." : "Hãy nhập từ khóa hoặc chọn danh mục để bắt đầu."}
            </p>
            <Link href="/" className="text-primary-600 font-medium hover:underline">
              Khám phá các địa điểm khác
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {results.map((place) => (
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
                  <p className="text-gray-600 text-sm line-clamp-2 font-light">
                    {place.description}
                  </p>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}