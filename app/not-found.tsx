"use client";

import Link from "next/link";
import { MapPin, ArrowLeft, Waves } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-100 px-4">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-300/40 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-emerald-300/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[32rem] h-[32rem] bg-blue-400/30 rounded-full blur-3xl" />

      {/* Card */}
      <div className="relative max-w-md w-full text-center backdrop-blur-xl bg-white/70 border border-white/50 rounded-3xl p-8 shadow-2xl">
        {/* Badge */}
        <div className="inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-700">
          Lost on the map
        </div>

        {/* Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-sky-200 flex items-center justify-center mb-6 shadow-inner animate-[float_4s_ease-in-out_infinite]">
          <MapPin className="w-12 h-12 text-blue-600" />
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl font-bold text-gray-800 mt-2 mb-4">
          Trang không tìm thấy
        </h2>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6">
          Có vẻ bạn đã rẽ nhầm một con đường ven biển.  
          Địa điểm này chưa từng xuất hiện trên bản đồ Vũng Tàu của chúng tôi.
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 text-sky-500 mb-8">
          <div className="h-px w-16 bg-sky-300" />
          <Waves className="w-4 h-4" />
          <div className="h-px w-16 bg-sky-300" />
        </div>

        {/* Actions */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-white
          bg-gradient-to-r from-sky-500 to-emerald-500
          hover:from-sky-600 hover:to-emerald-600
          transition-all duration-300
          shadow-lg shadow-sky-500/30 hover:shadow-xl hover:scale-[1.02]"
        >
          <ArrowLeft className="w-4 h-4" />
          Về trang chủ
        </Link>

        {/* Footer note */}
        <p className="mt-6 text-xs text-gray-500 italic">
          Lạc đường một chút thôi, biển vẫn ở ngay phía trước 🌊
        </p>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
