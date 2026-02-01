"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

export default function DepthCard({
  children,
  depth = 0.6,
}: {
  children: ReactNode;
  depth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Card gần mắt trôi mạnh hơn
  const y = useTransform(scrollYProgress, [0, 1], [140 * depth, -140 * depth]);

  // Phóng nhẹ tạo cảm giác nổi
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 + depth * 0.1]);

  return (
    <motion.div ref={ref} style={{ y, scale }} className="will-change-transform">
      {children}
    </motion.div>
  );
}
