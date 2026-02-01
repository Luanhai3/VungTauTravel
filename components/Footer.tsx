"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax siêu nhẹ cho nền
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#020617] via-[#0b1120] to-black"
      />

      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/5" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 text-white">
        {/* Top grid */}
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              VungTauTravel
            </h3>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
            Nơi du lịch không còn là danh sách địa chỉ, mà trở thành một bản đồ cảm xúc. Nơi mỗi cú cuộn trang như một bước dạo ven biển, và mỗi khung hình là một lời mời khám phá Vũng Tàu theo cách hoàn toàn mới.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="#places" className="hover:text-white">Địa điểm</Link></li>
              <li><Link href="#food" className="hover:text-white">Ăn uống</Link></li>
              <li><Link href="#checkin" className="hover:text-white">Check-in</Link></li>
              <li><Link href="#stay" className="hover:text-white">Lưu trú</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="#" className="hover:text-white">Giới thiệu</Link></li>
              <li><Link href="#" className="hover:text-white">Liên hệ</Link></li>
              <li><Link href="#" className="hover:text-white">Chính sách</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
              Social
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="https://www.instagram.com/luanhoanggggg/" className="hover:text-white">Instagram</Link></li>
              <li><Link href="https://www.facebook.com/eouaen/?locale=vi_VN" className="hover:text-white">Facebook</Link></li>
              <li><Link href="#" className="hover:text-white">Tiktok</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-20 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          © {new Date().getFullYear()} VungTauTravel |  Design by Louis Hoang.
        </div>
      </div>
    </footer>
  );
}
