"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [offset, setOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video with Parallax */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
        style={{
          transform: `translateY(${offset * 0.5}px)`,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
        >
          <source src="https://cdn.pixabay.com/video/2020/05/25/40103-424930038_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-[-50px]">
        <div className="space-y-8 mb-12">
          <h1 
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter transition-all duration-1000 ease-out transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            VŨNG TÀU
            <span className="block text-xl sm:text-2xl md:text-3xl font-light mt-4 tracking-[0.2em] text-white/90 font-sans">
              THÀNH PHỐ BIỂN XINH ĐẸP
            </span>
          </h1>
          
          <p 
            className={`text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light transition-all duration-1000 delay-300 ease-out transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Nơi những con sóng vỗ về tâm hồn, hải sản tươi ngon đánh thức vị giác và những khoảnh khắc bình yên đang chờ đón bạn.
          </p>
        </div>

        <div 
          className={`flex flex-col sm:flex-row gap-5 justify-center items-center transition-all duration-1000 delay-500 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Link
            href="#categories"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:scale-105 min-w-[200px]"
          >
            <span className="relative z-10 tracking-wider">KHÁM PHÁ NGAY</span>
            <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </Link>
          
          <Link
            href="#places"
            className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 border border-white/30 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 min-w-[200px]"
          >
            <span className="tracking-wider">XEM ĐỊA ĐIỂM</span>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 transition-opacity duration-1000 delay-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="animate-bounce flex flex-col items-center gap-2">
          <span className="text-white/60 text-[10px] uppercase tracking-[0.2em]">Cuộn xuống</span>
          <svg
            className="w-5 h-5 text-white/80"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
