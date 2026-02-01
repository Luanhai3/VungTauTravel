"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle: string;
  image: string;
  priority?: boolean;
};

export default function Hero({ title, subtitle, image, priority }: Props) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <Image
        src={image}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority={priority}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-white font-bold tracking-tight
                     text-5xl sm:text-6xl lg:text-8xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mt-6 max-w-2xl text-white/80 text-lg sm:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-10 rounded-full bg-white/10 px-8 py-4
                     text-white backdrop-blur-md border border-white/20
                     hover:bg-white/20 transition"
        >
          Khám Phá
        </motion.button>
      </div>
    </section>
  );
}
