"use client";

import Image from "next/image";
import { Instagram } from "@/components/Icons";
import { useState } from "react";

export default function Gallery() {
  const images = [
    "/images/gallery/1.jpg",
    "/images/gallery/2.jpg",
    "/images/gallery/3.jpg",
    "/images/gallery/4.jpg",
    "/images/gallery/5.jpg",
    "/images/gallery/6.jpg",
  ];

  return (
    <section className="py-24 bg-[#F5FAFF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-slate-400 font-medium tracking-widest uppercase text-xs mb-4">
            <Instagram className="w-3 h-3 text-teal-500" />
            <span>@VungTauTravel</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
            Community Gallery
          </h2>
          <p className="mt-4 text-slate-500 text-lg font-light">
            Những khoảnh khắc tuyệt đẹp được ghi lại bởi cộng đồng
          </p>
        </div>

        {/* Masonry Layout using Tailwind Columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((src, index) => (
            <GalleryItem key={index} src={src} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryItem({ src, index }: { src: string; index: number }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative group rounded-2xl overflow-hidden break-inside-avoid border border-slate-100 shadow-sm transition-all duration-500 hover:-translate-y-1 cursor-pointer">
      <Image
        src={src}
        alt={`Khoảnh khắc du lịch Vũng Tàu đẹp #${index + 1}`}
        title={`Ảnh đẹp Vũng Tàu ${index + 1}`}
        width={800}
        height={600}
        className={`w-full h-auto object-cover duration-700 group-hover:scale-110 transition-all ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 text-white font-medium backdrop-blur-md bg-black/50 border border-white/10 px-4 py-2 rounded-full w-fit">
            <Instagram className="w-4 h-4" />
            <span className="text-sm">Xem trên Instagram</span>
          </div>
        </div>
      </div>
    </div>
  );
}