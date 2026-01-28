"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowLeft, ExternalLink, Star, Calendar, Info, Clock, Heart } from "lucide-react";
import Footer from "@/components/Footer";
import { Place } from "@/lib/data";
import { toggleFavorite, getUserByUsername } from "@/lib/users";
import { createClient } from "@/utils/supabase/client";

export default function PlaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const { data: placeData } = await supabase
          .from('places')
          .select('*')
          .eq('id', id)
          .single();

        if (placeData) {
          setPlace({
            id: placeData.id,
            name: placeData.name,
            category: placeData.category,
            imageUrl: placeData.image_url,
            description: placeData.description,
            address: placeData.address,
            googleMapsUrl: placeData.google_maps_url,
            isFeatured: placeData.is_featured
          });
        }

      // Check favorite status
      const username = localStorage.getItem("current_user");
      if (username) {
        const user = getUserByUsername(username);
        if (user && user.favorites?.includes(id)) {
          setIsFavorite(true);
        }
      }
      
      setLoading(false);
      }
    };
    fetchData();
  }, [id, supabase]);

  const handleToggleFavorite = () => {
    const username = localStorage.getItem("current_user");
    if (!username) {
      router.push("/admin/login");
      return;
    }
    const newState = toggleFavorite(username, id);
    setIsFavorite(newState);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </main>
    );
  }

  if (!place) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="pt-32 pb-12 text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy địa điểm</h1>
          <p className="text-gray-600 mb-8">Địa điểm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay về trang chủ
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <Image
          src={imageError ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920" : place.imageUrl}
          alt={place.name}
          fill
          className="object-cover"
          priority
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Link>
          
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md transition-all ${isFavorite ? 'bg-white text-red-500' : 'bg-black/30 text-white hover:bg-white hover:text-red-500'}`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="px-4 py-1.5 bg-primary-600 text-white text-sm font-bold uppercase tracking-wider rounded-full">
              {place.category}
            </span>
            {place.isFeatured && (
              <span className="px-4 py-1.5 bg-yellow-500 text-white text-sm font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                Nổi bật
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            {place.name}
          </h1>
          
          <div className="flex items-center text-white/90 gap-2 text-lg">
            <MapPin className="w-5 h-5 flex-shrink-0" />
            <p>{place.address}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-primary-600" />
                Giới thiệu
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                {place.description}
              </p>
            </div>

            {/* Additional placeholder content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-100">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-600" />
                  Giờ mở cửa
                </h3>
                <p className="text-gray-600">
                  Mở cửa cả ngày<br/>
                  <span className="text-sm text-gray-500">(Thời gian có thể thay đổi vào ngày lễ)</span>
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  Thời điểm lý tưởng
                </h3>
                <p className="text-gray-600">
                  Quanh năm<br/>
                  <span className="text-sm text-gray-500">Đẹp nhất vào mùa khô (Tháng 11 - Tháng 4)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin địa điểm</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Địa chỉ</label>
                  <p className="text-gray-900 font-medium">{place.address}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Danh mục</label>
                  <p className="text-gray-900 font-medium">{place.category}</p>
                </div>

                <a
                  href={place.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-center font-bold rounded-xl transition-colors shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                >
                  Xem trên Google Maps
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}