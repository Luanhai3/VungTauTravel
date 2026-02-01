"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function SlowSection({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Section di chuyển ngược rất nhẹ
  const y = useTransform(scrollYProgress, [0, 1], [120, -120]);

  return (
    <div ref={ref} className="relative">
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
