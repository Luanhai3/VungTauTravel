"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Waves } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-100 px-4">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-300/40 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-emerald-300/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/4 w-[32rem] h-[32rem] bg-blue-400/30 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Card */}
      <div className="relative max-w-md w-full text-center backdrop-blur-xl bg-white/70 border border-white/50 rounded-3xl p-8 shadow-2xl">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-6 shadow-inner">
          <ShieldAlert className="w-12 h-12 text-red-600" />
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
          403
        </h1>

        <h2 className="text-2xl font-bold text-gray-800 mt-2 mb-4">
          Truy cập bị từ chối
        </h2>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6">
          Có vẻ bạn đã lạc vào một vùng biển chưa được cấp phép.  
          Trang này hiện không dành cho bạn vào thời điểm này.
        </p>

        {/* Divider with wave icon */}
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
          Quay về trang chủ
        </Link>

        {/* Footer note */}
        <p className="mt-6 text-xs text-gray-500 italic">
          Vũng Tàu vẫn đẹp, chỉ là bạn chưa vào đúng lối thôi 🌊
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
