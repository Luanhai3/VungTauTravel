"use client";

import Link from "next/link";
import { MapPin, ArrowLeft, Waves } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F5FAFF] px-4">
      {/* Background Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      {/* Card */}
      <div className="relative max-w-md w-full text-center backdrop-blur-2xl bg-white/60 border border-white/60 rounded-3xl p-8 shadow-2xl shadow-teal-900/5">
        {/* Badge */}
        <div className="inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full bg-teal-50 text-teal-600 border border-teal-100">
          Lost on the map
        </div>

        {/* Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm animate-[float_4s_ease-in-out_infinite]">
          <MapPin className="w-10 h-10 text-teal-500" />
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-black text-slate-900">
          404
        </h1>

        <h2 className="text-2xl font-bold text-slate-800 mt-2 mb-4">
          Trang không tìm thấy
        </h2>

        {/* Description */}
        <p className="text-slate-500 leading-relaxed mb-6">
          Có vẻ bạn đã rẽ nhầm một con đường ven biển.  
          Địa điểm này chưa từng xuất hiện trên bản đồ Vũng Tàu của chúng tôi.
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 text-slate-300 mb-8">
          <div className="h-px w-16 bg-slate-200" />
          <Waves className="w-4 h-4" />
          <div className="h-px w-16 bg-slate-200" />
        </div>

        {/* Actions */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-white
          bg-slate-900 hover:bg-slate-800
          transition-all duration-300
          hover:scale-[1.02]"
        >
          <ArrowLeft className="w-4 h-4" />
          Về trang chủ
        </Link>

        {/* Footer note */}
        <p className="mt-6 text-xs text-slate-400 italic">
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
