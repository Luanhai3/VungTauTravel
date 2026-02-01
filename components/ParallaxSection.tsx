"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function ParallaxSection({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}
