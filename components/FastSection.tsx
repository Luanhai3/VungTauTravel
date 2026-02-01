"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

export default function FastSection({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-120, 120]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}
