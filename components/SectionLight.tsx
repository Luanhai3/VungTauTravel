"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function SectionLight() {
  const { scrollYProgress } = useScroll();

  const x = useTransform(scrollYProgress, [0, 1], ["-100%", "270%"]);

  return (
    <motion.div
      style={{ x }}
      className="pointer-events-none fixed top-0 left-0 z-30 h-screen w-[40vw]
      bg-gradient-to-r from-transparent via-white/10 to-transparent blur-3xl"
    />
  );
}
