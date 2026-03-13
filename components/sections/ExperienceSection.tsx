"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function ExperienceSection() {

  const experiences = [
    {
      title: "Bình minh trên biển",
      text: "Khởi đầu ngày mới với ánh mặt trời dần ló lên từ chân trời, phủ lên bãi biển Vũng Tàu một màu vàng dịu nhẹ.",
      image: "/sunrise.jpg"
    },
    {
      title: "Làng chài truyền thống",
      text: "Khám phá cuộc sống của những ngư dân địa phương và cảm nhận nhịp sống biển bình dị.",
      image: "/fishing.jpg"
    },
    {
      title: "Bãi biển ẩn mình",
      text: "Những bãi biển yên tĩnh ít người biết đến, nơi bạn có thể tận hưởng không gian riêng tư.",
      image: "/beach.jpg"
    }
  ]

  return (

    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-zinc-50 overflow-hidden">

      {/* TITLE */}

      <div className="text-center py-24 md:py-32 px-6">

        <motion.p
          initial={{ opacity:0, y:30 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:0.8 }}
          viewport={{ once:true }}
          className="uppercase tracking-[0.5em] text-xs text-zinc-500 mb-6"
        >
          Experience
        </motion.p>

        <motion.h2
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:1 }}
          viewport={{ once:true }}
          className="text-3xl md:text-6xl font-semibold text-zinc-900"
        >
          Discover Vung Tau
        </motion.h2>

        <motion.div
          initial={{ scaleX:0 }}
          whileInView={{ scaleX:1 }}
          transition={{ duration:1 }}
          className="w-24 h-[2px] bg-zinc-900 mx-auto mt-10 origin-left"
        />

      </div>

      {/* EXPERIENCE */}

      <div className="space-y-32 md:space-y-48">

        {experiences.map((item, index) => (
          <ExperienceBlock
            key={index}
            item={item}
            reverse={index % 2 !== 0}
          />
        ))}

      </div>

    </section>
  )
}



function ExperienceBlock({ item, reverse }: any) {

  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end","end start"]
  })

  const y = useTransform(scrollYProgress,[0,1],[120,-120])
  const scale = useTransform(scrollYProgress,[0,1],[1.15,1])

  return (

    <section
      ref={ref}
      className="
      relative
      w-full
      h-[65vh]
      md:h-[85vh]
      min-h-[450px]
      md:min-h-[650px]
      overflow-hidden
      "
    >

      {/* IMAGE PARALLAX */}

      <motion.div
        style={{ y, scale }}
        className="absolute inset-0"
      >

        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
        />

      </motion.div>

      {/* CINEMATIC OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"/>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,transparent,black/60)]"/>

      {/* LIGHT BLOOM */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/10 blur-[160px] pointer-events-none"/>

      {/* CONTENT */}

      <div
        className={`
        absolute
        bottom-16
        md:bottom-24
        left-1/2
        -translate-x-1/2
        md:translate-x-0
        w-[90%]
        md:w-auto
        max-w-xl

        ${reverse
          ? "md:right-32 md:left-auto md:text-right"
          : "md:left-32"
        }
        `}
      >

        <motion.div
          initial={{ opacity:0, x: reverse ? 120 : -120 }}
          whileInView={{ opacity:1, x:0 }}
          transition={{ duration:1.1 }}
          viewport={{ once:true }}
          className="
          backdrop-blur-xl
          bg-white/10
          border border-white/20
          p-8 md:p-12
          rounded-3xl
          shadow-2xl
          "
        >

          <p className="uppercase tracking-[0.35em] text-xs text-white/70 mb-5">
            Experience
          </p>

          <h3 className="text-3xl md:text-5xl font-semibold text-white mb-6 leading-tight">
            {item.title}
          </h3>

          <p className="text-white/80 text-sm md:text-lg leading-relaxed">
            {item.text}
          </p>

          {/* LINE */}

          <div className={`flex items-center gap-4 mt-8 ${reverse ? "md:justify-end" : ""}`}>

            <motion.div
              initial={{ width:0 }}
              whileInView={{ width:60 }}
              transition={{ duration:1 }}
              className="h-[2px] bg-white"
            />

            <span className="uppercase tracking-[0.4em] text-xs text-white/70">
              Explore
            </span>

          </div>

        </motion.div>

      </div>

    </section>

  )

}