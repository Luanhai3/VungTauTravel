"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function SceneSection({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity }}
      className="relative z-10"
    >
      {children}
    </motion.section>
  );
}
