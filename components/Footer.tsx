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

  // 3D tilt khi scroll vào footer
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const yBg = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.4, 1]);

  return (
    <footer ref={ref} className="relative h-[120vh] perspective">
      <motion.div
        style={{ rotateX, opacity }}
        className="sticky top-0 h-screen origin-top transform-style-3d"
      >
        {/* Background parallax */}
        <motion.div
          style={{ y: yBg }}
          className="absolute inset-0 -z-20 bg-gradient-to-b from-[#020617] via-[#0b1120] to-black"
        />

        {/* Soft light vignette */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)]" />

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 py-32 text-white">
          <div className="grid gap-12 md:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="text-3xl font-bold tracking-tight">
                VungTauTravel
              </h3>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                Nơi du lịch không còn là danh sách địa chỉ, mà trở thành một bản
                đồ cảm xúc. Mỗi cú cuộn trang là một bước dạo ven biển.
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
                <li><Link href="#">Giới thiệu</Link></li>
                <li><Link href="#">Liên hệ</Link></li>
                <li><Link href="#">Chính sách</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
                Social
              </h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="https://www.instagram.com/luanhoanggggg/">Instagram</Link></li>
                <li><Link href="https://www.facebook.com/eouaen/?locale=vi_VN">Facebook</Link></li>
                <li><Link href="#">Tiktok</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-24 border-t border-white/10 pt-8 text-center text-xs text-white/40">
            © {new Date().getFullYear()} VungTauTravel • Design by Louis Hoang.
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
