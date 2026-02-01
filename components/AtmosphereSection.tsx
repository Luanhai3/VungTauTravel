"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AtmosphereSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // opacity từng ảnh theo scroll
  const opacity1 = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.6], [0, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.55, 1], [0, 1]);

  return (
    <section ref={ref} className="relative h-[250vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Ảnh 1 */}
        <motion.div style={{ opacity: opacity1 }} className="absolute inset-0">
          <Image
            src="/images/image1.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Ảnh 2 */}
        <motion.div style={{ opacity: opacity2 }} className="absolute inset-0">
          <Image
            src="/images/image2.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Ảnh 3 */}
        <motion.div style={{ opacity: opacity3 }} className="absolute inset-0">
          <Image
            src="/images/image3.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </motion.div>

        {/* overlay tối */}
        <div className="absolute inset-0 bg-black/40" />

        {/* chữ */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-6">
          <h2 className="text-6xl font-light leading-tight max-w-5xl">
            “Vũng Tàu không chỉ là nơi để đến,
            <br />
            mà là nơi để cảm nhận.”
          </h2>
          <p className="mt-8 text-xl text-white/70">
            Gió biển, nắng chiều, và những con đường ven sóng.
          </p>
        </div>

      </div>
    </section>
  );
}
