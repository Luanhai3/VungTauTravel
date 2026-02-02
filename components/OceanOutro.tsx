"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function OceanOutro() {
  const ref = useRef<HTMLDivElement>(null);

  // Lấy tiến trình scroll trong section này
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Sóng trôi ngang theo scroll
  const x = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Quote hiện dần rồi mờ đi
  const opacity = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    [0, 1, 0]
  );

  return (
    <section
      ref={ref}
      className="relative h-[70vh] overflow-hidden bg-cyan flex items-center justify-center"
    >
      {/* Wave */}
      <motion.svg
        style={{ x }}
        width="120%"
        height="200"
        viewBox="0 0 1440 200"
        className="absolute bottom-20 opacity-40"
        fill="none"
      >
        <path
          d="M0 100 C 240 40, 480 160, 720 100 S 1200 40, 1440 100"
          stroke="white"
          strokeWidth="2"
        />
      </motion.svg>

      {/* Quote */}
      <motion.p
        style={{ opacity }}
        className="text-white/100 text-xl tracking-widest text-center px-6"
      >
        Mỗi nơi đều lưu giữ một kỷ niệm đang chờ được hiện thực hóa.
      </motion.p>
    </section>
  );
}
