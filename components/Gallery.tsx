"use client";

import Image from "next/image";
import { Instagram } from "lucide-react";

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
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-primary-600 font-bold tracking-widest uppercase text-sm mb-4">
            <Instagram className="w-4 h-4" />
            <span>@VungTauTravel</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
            Góc nhìn <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Du khách</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg font-light">
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
  return (
    <div className="relative group rounded-3xl overflow-hidden break-inside-avoid shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
      <Image
        src={src}
        alt={`Gallery image ${index + 1}`}
        width={800}
        height={600}
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 text-white font-medium backdrop-blur-md bg-white/20 px-4 py-2 rounded-full w-fit">
            <Instagram className="w-4 h-4" />
            <span className="text-sm">Xem trên Instagram</span>
          </div>
        </div>
      </div>
    </div>
  );
}