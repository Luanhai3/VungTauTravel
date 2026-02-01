"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function StickySection({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Trôi RẤT chậm
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  // Giữ opacity lâu hơn
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );

  return (
    <section ref={ref} className="relative h-[350vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="w-full">
          {children}
        </motion.div>
      </div>
    </section>
  );
}
