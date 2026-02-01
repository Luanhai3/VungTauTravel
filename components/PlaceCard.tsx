"use client";

import Image from "next/image";
import Link from "next/link";
import {motion, useScroll, useTransform, useMotionValue, useSpring} from "framer-motion";
import { useRef } from "react";
import { useState } from "react";





interface PlaceCardProps {
  place: any;
  index?: number;
  showCategory?: boolean;
}


export default function PlaceCard({
  place,
  index = 0,
  showCategory = false,
}: PlaceCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasImage =
  typeof place.image === "string" && place.image.trim().length > 0;


  // 🌊 Parallax scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const [isHover, setIsHover] = useState(false);

  const rawY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y = useSpring(rawY, {
  stiffness: 60,
  damping: 18,
  mass: 1.2,
});
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.03, 0.96]);
  const bgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const fgY = useTransform(scrollYProgress, [0, 1], [-90, 90]);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const edgeGlow = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(300px at ${x}px ${y}px, rgba(56,189,248,0.6), transparent 70%)`
  );

  const smoothX = useSpring(rotateX, { stiffness: 120, damping: 15 });
  const smoothY = useSpring(rotateY, { stiffness: 120, damping: 15 });
  const shadowX = useTransform(smoothY, [-15, 15], [30, -30]);
  const shadowY = useTransform(smoothX, [-15, 15], [-30, 30]);

const dynamicShadow = useTransform(
  [shadowX, shadowY],
  ([x, y]) => `${x}px ${y}px 60px rgba(0,0,0,0.35)`
);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    rotateY.set((x - midX) / 20);
    rotateX.set(-(y - midY) / 20);
    mouseX.set(x);
    mouseY.set(y);
  }
  const light = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(600px at ${x}px ${y}px, rgba(255,255,255,0.14), transparent 60%)`
  );  

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.article
      ref={ref}
      style={{
        y,
        scale,
        rotateX: smoothX,
        rotateY: smoothY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        boxShadow: dynamicShadow,
        }}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      id={place.slug}
      initial={{
        opacity: 0,
        scale: 0.92,
        rotateX: 25,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotateX: 0,
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08,
      }}      
      className="group relative h-[500px] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm will-change-transform"
    >
      <Link
        href={`/places/${place.slug}`}
        className="block h-full w-full"
        aria-label={`View ${place.name}`}
      >     
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-3xl"
        style={{ background: light }}
      />
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-3xl">
        <div className="glass-reflection" />
        </div>
        {/* 🌌 Parallax Image Layers */}
        <div className="relative h-72 w-full overflow-hidden rounded-2xl">
  <div className="absolute inset-0">
    {/* Background layer */}
    <motion.div
      style={{ y: bgY, scale: 1.1 }}
      className="absolute inset-0"
    >
      {hasImage && (
        <Image
          src={place.image}
          alt={place.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      )}
    </motion.div>

    {/* Foreground layer */}
    <motion.div
      style={{ y: fgY }}
      className="absolute inset-0"
    >
      {hasImage && (
        <Image
          src={place.image}
          alt={place.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      )}
    </motion.div>

    {/* Gradient */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-90" />
  </div>
</div>

        {/* Badges */}
        <motion.div
  className="absolute left-4 right-4 top-4 z-30 flex items-start justify-between"
  style={{ transform: "translateZ(70px)" }}
>
          {place.featured && (
            <span className="rounded-full bg-[#0EA5E9] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]">
              Featured
            </span>
          )}
          {showCategory && (
            <span className="ml-auto rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium capitalize text-white backdrop-blur-md">
              {place.categories?.name}
            </span>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
  className="absolute bottom-0 left-0 right-0 z-30 p-6"
  style={{
    transform: "translateZ(60px)",
  }}
>
          <h3 className="mb-2 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-[#38BDF8]">
            {place.name}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-white/70 transition-colors group-hover:text-white/90">
            {place.description}
          </p>

          <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
            {place.address && (
              <p className="max-w-[70%] truncate text-xs text-white/50">
                {place.address}
              </p>
            )}
            <span className="text-xs font-medium uppercase tracking-wider text-[#38BDF8] opacity-0 transition-all duration-300 group-hover:opacity-100">
              Explore &rarr;
            </span>
          </div>
          </motion.div>
          <motion.div
  className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-3xl"
>
  <motion.div
    initial={{ x: "-120%", opacity: 0 }}
    animate={
      isHover
        ? { x: "120%", opacity: 0.35 }
        : { x: "-120%", opacity: 0 }
    }
    transition={{ duration: 1.2, ease: "easeInOut" }}
    className="absolute top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-white/40 via-white/10 to-transparent blur-2xl"
  />
</motion.div>
      </Link>
    </motion.article>
  );
}
