"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function TextParallax({
  children,
  speed = 0.3,
}: {
  children: React.ReactNode;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}
