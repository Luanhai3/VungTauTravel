"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Categories() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for skeleton effect
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    {
      icon: "🍜",
      name: "Ăn uống",
      slug: "an-uong",
      description: "Hương vị biển cả & đặc sản địa phương",
      image: "/images/categories/an-uong.jpg",
      className: "md:col-span-2",
    },
    {
      icon: "💕",
      name: "Hẹn hò",
      slug: "hen-ho",
      description: "Không gian lãng mạn cho lứa đôi",
      image: "/images/categories/hen-ho.jpg",
      className: "md:col-span-1",
    },
    {
      icon: "📸",
      name: "Check-in",
      slug: "check-in",
      description: "Góc sống ảo triệu like",
      image: "/images/categories/check-in.jpg",
      className: "md:col-span-1",
    },
    {
      icon: "🌅",
      name: "Du lịch",
      slug: "du-lich",
      description: "Khám phá thiên nhiên hùng vĩ",
      image: "/images/categories/du-lich.jpg",
      className: "md:col-span-2",
    },
  ];

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
          {isLoading ? (
            <>
              <CategorySkeleton className="md:col-span-2" />
              <CategorySkeleton className="md:col-span-1" />
              <CategorySkeleton className="md:col-span-1" />
              <CategorySkeleton className="md:col-span-2" />
            </>
          ) : (
            categories.map((category) => (
              <CategoryCard key={category.name} category={category} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: any }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative rounded-3xl overflow-hidden border border-white/50 shadow-sm transition-all duration-500 ${category.className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={category.image}
          alt={`Danh mục du lịch: ${category.name} - ${category.description}`}
          title={`Khám phá ${category.name} tại Vũng Tàu`}
          fill
          className={`object-cover duration-700 group-hover:scale-110 transition-all ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
        />
      </div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-teal-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
              {category.name}
            </h3>
            <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
          </div>
         
          <p className="text-slate-200 text-sm font-light leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
            {category.description}
          </p>
          
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white border border-white/30 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 hover:bg-white hover:text-slate-900">
            Khám phá <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function CategorySkeleton({ className }: { className?: string }) {
  return (
    <div className={`relative rounded-3xl overflow-hidden bg-slate-100 animate-pulse ${className}`}>
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  );
}
