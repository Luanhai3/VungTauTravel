"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import Footer from "@/components/Footer";
import { Place, Category } from "@/lib/data";
import { createClient } from "@/utils/supabase/client";

const categoryMap: Record<string, Category> = {
  "an-uong": "Ăn uống",
  "hen-ho": "Hẹn hò",
  "check-in": "Check-in",
  "du-lich": "Du lịch",
  "tham-quan": "Tham quan",
  "di-tich": "Di tích",
  "thien-nhien": "Thiên nhiên",
};

const categoryInfo: Record<Category, { title: string; description: string }> = {
  "Ăn uống": {
    title: "Ẩm thực & Ăn uống",
    description: "Khám phá những quán ăn ngon, đặc sản địa phương và hải sản tươi sống tại Vũng Tàu.",
  },
  "Hẹn hò": {
    title: "Địa điểm Hẹn hò",
    description: "Những không gian lãng mạn, riêng tư và ấm cúng dành cho các cặp đôi.",
  },
  "Check-in": {
    title: "Góc Check-in Sống ảo",
    description: "Những địa điểm chụp ảnh đẹp nhất, view cực chất để lưu giữ kỷ niệm.",
  },
  "Du lịch": {
    title: "Tham quan & Du lịch",
    description: "Các địa danh nổi tiếng, danh lam thắng cảnh và trải nghiệm thiên nhiên.",
  },
  "Tham quan": {
    title: "Địa điểm Tham quan",
    description: "Những điểm đến hấp dẫn để khám phá vẻ đẹp của thành phố biển.",
  },
  "Di tích": {
    title: "Di tích Lịch sử",
    description: "Tìm hiểu về lịch sử và văn hóa qua các công trình kiến trúc cổ kính.",
  },
  "Thiên nhiên": {
    title: "Vẻ đẹp Thiên nhiên",
    description: "Hòa mình vào không gian xanh mát của núi rừng và biển cả.",
  },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = categoryMap[slug];
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "a-z" | "z-a">("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const supabase = createClient();

  useEffect(() => {
    const fetchPlaces = async () => {
      if (category) {
        const { data } = await supabase
          .from('places')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false });

        if (data) {
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
          setAllPlaces(mappedPlaces);
          setFilteredPlaces(mappedPlaces);
        }
      }
    };

    fetchPlaces();
  }, [category, supabase]);

  useEffect(() => {
    let result = [...allPlaces];

    // Filter by search query
    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": return Number(b.id) - Number(a.id);
        case "oldest": return Number(a.id) - Number(b.id);
        case "a-z": return a.name.localeCompare(b.name);
        case "z-a": return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

    setFilteredPlaces(result);
  }, [allPlaces, searchQuery, sortBy]);

  if (!category) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="pt-32 pb-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Không tìm thấy danh mục</h1>
          <Link href="/" className="text-primary-600 hover:underline mt-4 inline-block">
            Quay về trang chủ
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const info = categoryInfo[category];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="pt-32 pb-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-4">
            {info.title}
          </h1>
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
            {info.description}
          </p>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8 relative z-10">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-gray-500">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">Sắp xếp:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 md:w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="a-z">Tên (A-Z)</option>
              <option value="z-a">Tên (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Places Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {allPlaces.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg mb-4">Chưa có địa điểm nào trong danh mục này.</p>
            <Link href="/" className="text-primary-600 font-medium hover:underline">
              Khám phá các địa điểm khác
            </Link>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy địa điểm nào phù hợp với từ khóa "{searchQuery}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredPlaces.map((place) => (
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(place.googleMapsUrl, '_blank');
                    }}
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