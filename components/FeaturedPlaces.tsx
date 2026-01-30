"use client";

import { Place } from "@/lib/data";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function FeaturedPlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const supabase = createClient();

  useEffect(() => {
    const fetchFeaturedPlaces = async () => {
      const { data } = await supabase
        .from('places')
        .select('*')
        .eq('is_featured', true)
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
        setPlaces(mappedPlaces);
      }
    };

    fetchFeaturedPlaces();
  }, []);

  // Logic phân trang
  const totalPages = Math.ceil(places.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPlaces = places.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (places.length === 0) return null; // Ẩn section nếu không có địa điểm nổi bật

  return (
    <section id="places" className="py-24 bg-[#F5FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
            Featured Places
          </h2>
          <p className="text-slate-500 text-lg font-light">
            Những địa điểm được yêu thích nhất bởi cộng đồng du lịch
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {currentPlaces.map((place) => (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="group cursor-pointer block"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl mb-6 bg-white shadow-sm border border-slate-100">
                <Image
                  src={imageError[place.id] ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" : place.imageUrl}
                  alt={`Hình ảnh địa điểm ${place.name} - ${place.category} tại Vũng Tàu`}
                  title={`Khám phá ${place.name} - ${place.address}`}
                  fill
                  className={`object-cover duration-700 group-hover:scale-110 transition-all ${
                    loadedImages[place.id] ? "opacity-100" : "opacity-0"
                  }`}
                  onError={() => setImageError((prev) => ({ ...prev, [place.id]: true }))}
                  onLoad={() => setLoadedImages((prev) => ({ ...prev, [place.id]: true }))}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 border border-white/50 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {place.category}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(place.googleMapsUrl, '_blank');
                  }}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-teal-50 shadow-lg"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  {place.name}
                </h3>
                <div className="flex items-start gap-2 text-slate-500">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" />
                  <p className="text-sm leading-relaxed line-clamp-1">{place.address}</p>
                </div>
                <p className="text-slate-500 text-sm line-clamp-2 font-light">
                  {place.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full font-medium transition-all ${
                    currentPage === page
                      ? "bg-slate-900 text-white"
                      : "bg-transparent text-slate-500 hover:bg-white border border-slate-200"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
