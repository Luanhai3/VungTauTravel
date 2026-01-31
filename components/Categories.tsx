import { getSupabaseServer } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import CategoryCard from "./CategoryCard";

// Metadata definitions for styling and descriptions
const CATEGORY_METADATA: Record<string, any> = {
  "Ăn uống": {
    icon: "🍜",
    slug: "an-uong",
    description: "Hương vị biển cả & đặc sản địa phương",
    image: "/images/categories/an-uong.jpg",
    className: "md:col-span-2",
  },
  "Hẹn hò": {
    icon: "💕",
    slug: "hen-ho",
    description: "Không gian lãng mạn cho lứa đôi",
    image: "/images/categories/hen-ho.jpg",
    className: "md:col-span-1",
  },
  "Check-in": {
    icon: "📸",
    slug: "check-in",
    description: "Góc sống ảo triệu like",
    image: "/images/categories/check-in.jpg",
    className: "md:col-span-1",
  },
  "Du lịch": {
    icon: "🌅",
    slug: "du-lich",
    description: "Khám phá thiên nhiên hùng vĩ",
    image: "/images/categories/du-lich.jpg",
    className: "md:col-span-2",
  },
  "Tham quan": {
    icon: "🎡",
    slug: "tham-quan",
    description: "Những điểm đến hấp dẫn để khám phá",
    image: "/images/categories/tham-quan.jpg",
    className: "md:col-span-1",
  },
  "Di tích": {
    icon: "🏛️",
    slug: "di-tich",
    description: "Tìm hiểu lịch sử và văn hóa",
    image: "/images/categories/di-tich.jpg",
    className: "md:col-span-1",
  },
  "Thiên nhiên": {
    icon: "🌿",
    slug: "thien-nhien",
    description: "Hòa mình vào không gian xanh mát",
    image: "/images/categories/thien-nhien.jpg",
    className: "md:col-span-1",
  },
};

const getCategories = unstable_cache(
  async () => {
    const supabase = getSupabaseServer();

    const { data } = await supabase
      .from('places')
      .select('category, image_url')
      .order('created_at', { ascending: false });

    const categoryMap = new Map<string, any>();

    // 1. Khởi tạo danh sách từ Metadata trước để đảm bảo luôn hiển thị các mục chính
    Object.entries(CATEGORY_METADATA).forEach(([key, meta]) => {
      categoryMap.set(key, {
        name: key,
        slug: meta.slug,
        icon: meta.icon,
        description: meta.description,
        image: meta.image,
        className: meta.className,
        count: 0
      });
    });

    if (data) {
      data.forEach((place: any) => {
        if (!categoryMap.has(place.category)) {
          const metadata = CATEGORY_METADATA[place.category] || {};
          
          categoryMap.set(place.category, {
            name: place.category,
            slug: metadata.slug || place.category.toLowerCase().replace(/\s+/g, '-'),
            icon: metadata.icon || "✨",
            description: metadata.description || `${place.category} tại Vũng Tàu`,
            image: metadata.image || place.image_url, // Prefer metadata image, fallback to place image
            className: metadata.className || "md:col-span-1",
            count: 0
          });
        }
        const cat = categoryMap.get(place.category);
        cat.count++;
      });
    }

    return Array.from(categoryMap.values());
  },
  ['categories-list'],
  { revalidate: 3600, tags: ['places'] }
);

export default async function Categories() {
  const categories = await getCategories();

  return (
    <section id="categories" className="py-24 bg-[#F5FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-slate-400 font-medium tracking-widest uppercase text-xs mb-4">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Khám phá theo cách của bạn</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">
              Curated Collections
            </h2>
            <p className="text-slate-500 text-lg font-light leading-relaxed">
              Mỗi góc nhỏ tại Vũng Tàu đều mang một màu sắc riêng. Hãy chọn phong cách du lịch của bạn để bắt đầu hành trình.
            </p>
          </div>
          <Link
            href="#places"
            className="hidden md:flex items-center gap-3 px-6 py-3 bg-white hover:bg-slate-50 rounded-full text-slate-900 font-medium uppercase tracking-wider transition-all group border border-slate-200 shadow-sm"
          >
            Xem tất cả <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
