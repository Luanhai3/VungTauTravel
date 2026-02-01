"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function GlobalParallaxBackground() {
  const { scrollY } = useScroll();

  // Nền di chuyển rất chậm
  const y = useTransform(scrollY, [0, 2000], [0, -300]);

  return (
    <motion.div
      style={{ y }}
      className="fixed inset-0 -z-10 pointer-events-none"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#031525] to-[#020617]" />

      {/* glow mờ */}
      <div className="absolute top-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[120px]" />
      <div className="absolute bottom-[10%] right-[10%] h-[600px] w-[600px] rounded-full bg-cyan-400/10 blur-[140px]" />
    </motion.div>
  );
}
