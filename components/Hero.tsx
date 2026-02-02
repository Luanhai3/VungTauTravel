"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = {
  title: string;
  subtitle: string;
  image: string;
  priority?: boolean;
};

export default function Hero({ title, subtitle, image, priority }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax: Giảm xuống 30% để nền bám sát tốc độ cuộn hơn, giảm cảm giác "trôi"
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Opacity: Nội dung mờ dần khi cuộn
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  // Parallax Text: Các phần tử di chuyển với tốc độ khác nhau để tạo chiều sâu
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 100]); // Giảm biên độ
  const ySubtitle = useTransform(scrollYProgress, [0, 1], [0, 50]); // Giảm biên độ

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Background Layer with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 h-[120%] w-full will-change-transform">
        <Image
          src={image}
          alt="Hero background"
          fill
          className="object-cover"
          sizes="100vw"
          priority={priority}
        />
        {/* Gradient Overlay: Chuyển mượt từ đen sang màu nền web (#020617) để xóa vết cắt */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#020617]" />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6"
      >
        <motion.div style={{ y: yTitle }}>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-white font-bold tracking-tight
                       text-5xl sm:text-6xl lg:text-8xl"
          >
            {title}
          </motion.h1>
        </motion.div>

        <motion.div style={{ y: ySubtitle }}>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mt-6 max-w-2xl text-white/80 text-lg sm:text-xl"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        <motion.div style={{ y: ySubtitle }}>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-10 rounded-full bg-white/10 px-8 py-4
                       text-white backdrop-blur-md border border-white/20
                       hover:bg-white/20 transition"
          >
            Khám Phá
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-xs font-medium uppercase tracking-widest text-white/50">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/50"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
