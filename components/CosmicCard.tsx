"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { MouseEvent, ReactNode } from "react";

export default function CosmicCard({ children }: { children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [12, -12]);
  const rotateY = useTransform(x, [-50, 50], [-12, 12]);

  function handleMouse(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/30"
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-400/10 via-transparent to-emerald-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {children}
    </motion.div>
  );
}
