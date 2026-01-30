"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowLeft, ExternalLink, Star, Calendar, Info, Clock, Heart, ChevronRight, Home, Share2, Copy, Check } from "lucide-react";
import { Facebook } from "@/components/Icons";
import Footer from "@/components/Footer";
import { Place } from "@/lib/data";
import Comments from "@/components/Comments";
import { createClient } from "@/utils/supabase/client";

const generateSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export default function PlaceDetailPage() {
  const params = useParams();
  const categorySlugMap: Record<string, string> = {
    "Ăn uống": "an-uong",
    "Hẹn hò": "hen-ho",
    "Check-in": "check-in",
    "Du lịch": "du-lich",
    "Tham quan": "tham-quan",
    "Di tích": "di-tich",
    "Thiên nhiên": "thien-nhien",
  };

  const id = decodeURIComponent(params.id as string);
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        // Thử tìm bằng ID chính xác (có thể có dấu)
        let { data: placeData } = await supabase
          .from('places')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        // Nếu không tìm thấy, thử tìm bằng slug không dấu (cho trường hợp URL cũ nhưng DB đã đổi mới)
        if (!placeData) {
          const slugId = generateSlug(id);
          const { data: placeDataSlug } = await supabase.from('places').select('*').eq('id', slugId).maybeSingle();
          placeData = placeDataSlug;
        }

        if (placeData) {
          setPlace({
            id: placeData.id,
            name: placeData.name,
            category: placeData.category,
            imageUrl: placeData.image_url,
            description: placeData.description,
            address: placeData.address,
            googleMapsUrl: placeData.google_maps_url,
            isFeatured: placeData.is_featured,
            openingHours: placeData.opening_hours,
            bestTime: placeData.best_time,
            galleryImages: placeData.gallery_images || []
          });

          // Lấy thông tin đánh giá
          const { data: commentsData } = await supabase
            .from("comments")
            .select("rating")
            .eq("place_id", placeData.id);
            
          if (commentsData && commentsData.length > 0) {
            const sum = commentsData.reduce((acc, curr) => acc + (curr.rating || 0), 0);
            setAverageRating(Number((sum / commentsData.length).toFixed(1)));
            setTotalReviews(commentsData.length);
          }
        } else {
          setPlace(null);
        }
        
        // Check favorite status from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("favorites")
            .select("id")
            .eq("user_id", user.id)
            .eq("place_id", id)
            .maybeSingle();
          
          if (data) setIsFavorite(true);
        }
        
        setLoading(false);
      }
    };

    fetchData();
  }, [id, supabase]);

  const handleToggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/admin/login?next=${window.location.pathname}`);
      return;
    }

    if (isFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("place_id", id);
      
      if (!error) setIsFavorite(false);
    } else {
      // Add to favorites
      const { error } = await supabase
        .from("favorites")
        .insert({
          user_id: user.id,
          place_id: id
        });
      
      if (!error) setIsFavorite(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    const width = 600;
    const height = 400;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      url,
      'facebook-share-dialog',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const handleShareZalo = () => {
    const url = `https://zalo.me/share/?url=${encodeURIComponent(window.location.href)}`;
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      url,
      'zalo-share-dialog',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5FAFF]">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </main>
    );
  }

  if (!place) {
    return (
      <main className="min-h-screen bg-[#F5FAFF]">
        <div className="pt-32 pb-12 text-center px-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Không tìm thấy địa điểm</h1>
          <p className="text-slate-500 mb-8">Địa điểm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
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
    <main className="min-h-screen bg-[#F5FAFF]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-sm text-slate-500">
            <Link href="/" className="hover:text-teal-600 flex items-center gap-1 transition-colors">
              <Home className="w-4 h-4" />
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
            <Link 
              href={`/categories/${categorySlugMap[place.category] || 'du-lich'}`} 
              className="hover:text-teal-600 transition-colors"
            >
              {place.category}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
            <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-xs">
              {place.name}
            </span>
          </nav>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Trang chủ",
                    "item": "https://vung-tau-travel.vercel.app"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": place.category,
                    "item": `https://vung-tau-travel.vercel.app/categories/${categorySlugMap[place.category] || 'du-lich'}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": place.name,
                    "item": `https://vung-tau-travel.vercel.app/places/${place.id}`
                  }
                ]
              })
            }}
          />
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <Image
          src={imageError ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920" : place.imageUrl}
          alt={`Toàn cảnh ${place.name} - Địa điểm ${place.category} nổi tiếng tại Vũng Tàu`}
          title={`${place.name} - ${place.address}`}
          fill
          className={`object-cover transition-opacity duration-700 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          priority
          onError={() => setImageError(true)}
          onLoad={() => setIsImageLoaded(true)}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
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
            className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md transition-all ${isFavorite ? 'bg-white text-red-500 shadow-lg' : 'bg-black/20 text-white hover:bg-white hover:text-red-500'}`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="px-4 py-1.5 bg-white text-black text-sm font-bold uppercase tracking-wider rounded-full">
              {place.category}
            </span>
            {place.isFeatured && (
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                Nổi bật
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            {place.name}
          </h1>

          {totalReviews > 0 && (
            <div className="flex items-center gap-2 mb-4 text-white/90">
              <div className="flex items-center gap-1 bg-white/20 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-white">{averageRating}</span>
              </div>
              <span className="text-sm">({totalReviews} đánh giá)</span>
            </div>
          )}
          
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-teal-500" />
                Giới thiệu
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                {place.description}
              </p>
            </div>

            {/* Additional placeholder content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-200">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-500" />
                  Giờ mở cửa
                </h3>
                <p className="text-slate-600">
                  {place.openingHours || "Đang cập nhật"}<br/>
                  {/* <span className="text-sm text-gray-500">(Thời gian có thể thay đổi vào ngày lễ)</span> */}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-500" />
                  Thời điểm lý tưởng
                </h3>
                <p className="text-slate-600">
                  {place.bestTime || "Đang cập nhật"}<br/>
                  {/* <span className="text-sm text-gray-500">Đẹp nhất vào mùa khô (Tháng 11 - Tháng 4)</span> */}
                </p>
              </div>
            </div>

            {/* Gallery Section */}
            {place.galleryImages && place.galleryImages.length > 0 && (
              <div className="pt-8 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Thư viện ảnh</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {place.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-slate-100 shadow-sm">
                      <Image 
                        src={img} 
                        alt={`${place.name} - Ảnh ${idx + 1}`} 
                        fill 
                        className="object-cover" 
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <Comments placeId={id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Thông tin địa điểm</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1">Địa chỉ</label>
                  <p className="text-slate-800 font-medium">{place.address}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1">Danh mục</label>
                  <p className="text-slate-800 font-medium">{place.category}</p>
                </div>

                <a
                  href={place.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-center font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                >
                  Xem trên Google Maps
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-slate-400" />
                Chia sẻ địa điểm
              </h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleShareFacebook}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#1877F2] text-white font-bold rounded-xl hover:bg-[#1864D9] transition-colors shadow-sm"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </button>
                <button
                  onClick={handleShareZalo}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#0068FF] text-white font-bold rounded-xl hover:bg-[#0054CC] transition-colors shadow-sm"
                >
                  <div className="w-5 h-5 flex items-center justify-center font-black bg-white text-[#0068FF] rounded-full text-xs">Z</div>
                  Zalo
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {isCopied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  {isCopied ? "Đã sao chép" : "Sao chép liên kết"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}