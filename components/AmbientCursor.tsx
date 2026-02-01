"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function AmbientCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <motion.div
      style={{
        left: smoothX,
        top: smoothY,
      }}
      className="pointer-events-none fixed z-[999] h-[250px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
    >
      <div className="h-full w-full bg-[radial-gradient(circle,rgba(56,189,248,0.15),transparent_60%)] blur-3xl" />
    </motion.div>
  );
}
