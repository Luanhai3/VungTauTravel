"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function GlobalParallaxBg() {
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 2000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -600]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Layer xa */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.12),transparent_40%)]"
      />

      {/* Layer gần */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.15),transparent_40%)]"
      />
    </div>
  );
}
