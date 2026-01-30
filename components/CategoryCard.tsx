"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({ category }: { category: any }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [transformStyle, setTransformStyle] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2);
    const y = (e.clientY - top - height / 2);
    
    // Tính toán góc xoay dựa trên vị trí chuột (max 10 độ)
    const xRot = (y / height) * -10; 
    const yRot = (x / width) * 10;

    setTransformStyle(`perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <Link
      ref={ref}
      href={`/categories/${category.slug}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
      className={`group relative rounded-3xl overflow-hidden border border-white/50 shadow-sm transition-all duration-200 ease-out ${category.className} [transform-style:preserve-3d]`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden [transform:translateZ(0px)]">
        <Image
          src={category.image}
          alt={`Danh mục du lịch: ${category.name} - ${category.description}`}
          title={`Khám phá ${category.name} tại Vũng Tàu`}
          fill
          className="object-cover duration-700 group-hover:scale-110 transition-transform"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
          // Tối ưu hóa: Mobile tải ảnh 100vw, Desktop tải ảnh 33vw
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-teal-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 [transform:translateZ(0px)]" />

      {/* Content - Đẩy nội dung lên phía trước (Z-axis) để tạo chiều sâu */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end [transform:translateZ(30px)]">
        <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-2xl font-bold text-white uppercase tracking-tight drop-shadow-lg">
              {category.name}
            </h3>
            <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{category.icon}</span>
          </div>
         
          <p className="text-slate-100 text-sm font-light leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2 drop-shadow-md">
            {category.description}
          </p>
          
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white border border-white/30 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 hover:bg-white hover:text-slate-900 shadow-xl">
            {category.count > 0 ? `${category.count} địa điểm` : "Khám phá"} <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
