"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function AtmosphereFog() {
  const { scrollYProgress } = useScroll();

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.15, 0.25, 0.15]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="pointer-events-none fixed inset-0 z-20
      bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_70%)]
      blur-2xl"
    />
  );
}
