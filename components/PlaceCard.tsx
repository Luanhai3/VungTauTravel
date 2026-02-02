"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";
import { getImageUrl } from "@/lib/getImageUrl";

export default function PlaceCard({ place, index = 0 }: any) {
  const ref = useRef<HTMLDivElement>(null);

  const imageUrl = useMemo(
    () => getImageUrl(place.image),
    [place.image]
  );

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <motion.article
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.08 }}
      className="group relative h-[500px] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
    >
      <Link href={`/places/${place.slug}`} className="block h-full w-full">
        <div className="relative h-72 w-full overflow-hidden">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={place.name}
              fill
              sizes="(max-width:768px) 100vw, 33vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="mb-2 text-2xl font-bold text-white">
            {place.name}
          </h3>
          <p className="line-clamp-2 text-sm text-white/70">
            {place.description}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
