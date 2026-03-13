"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function FeatureSection() {

  return (

    <section className="relative py-24 md:py-32 px-6 max-w-7xl mx-auto overflow-hidden">

      {/* LIGHT GLOW */}

      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-200/30 blur-[160px] pointer-events-none"/>

      {/* HEADER */}

      <motion.div
        initial={{ opacity:0, y:40 }}
        whileInView={{ opacity:1, y:0 }}
        transition={{ duration:0.8 }}
        viewport={{ once:true }}
        className="max-w-2xl mb-16 md:mb-20"
      >

        <p className="text-xs tracking-[0.45em] text-zinc-500 mb-4 uppercase">
          Khám Phá
        </p>

        <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
          Vì Sao Nên Du Lịch Vũng Tàu
        </h2>

        <p className="text-zinc-500 text-base md:text-lg leading-relaxed">
          Chỉ cách Thành phố Hồ Chí Minh vài giờ di chuyển, Vũng Tàu mang đến
          không gian biển xanh, bãi cát vàng, hải sản tươi ngon và nhiều địa
          điểm check-in tuyệt đẹp cho chuyến đi cuối tuần.
        </p>

      </motion.div>


      {/* GRID */}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

        {/* BEACH HERO */}

        <FeatureCard
          title="Bãi Biển Tuyệt Đẹp"
          description="Những bãi biển dài với cát vàng, làn nước xanh và hoàng hôn rực rỡ."
          image="/beautifulbeach.jpg"
          className="md:col-span-12 md:h-[420px]"
        />

        {/* SEAFOOD */}

        <FeatureCard
          title="Hải Sản Địa Phương"
          description="Ốc, tôm, cua và vô số món ăn đặc trưng ven biển hấp dẫn."
          image="/localfood.jpg"
          className="md:col-span-6"
        />

        {/* HIDDEN SPOTS */}

        <FeatureCard
          title="Những Góc Biển Ẩn Mình"
          description="Khám phá những địa điểm yên bình như Hòn Bà hay cung đường ven biển tuyệt đẹp."
          image="/honba.jpg"
          className="md:col-span-6"
        />

      </div>

    </section>

  )

}



function FeatureCard({
  title,
  description,
  image,
  className=""
}: any) {

  return (

    <motion.div
      initial={{ opacity:0, y:60 }}
      whileInView={{ opacity:1, y:0 }}
      transition={{ duration:0.9 }}
      viewport={{ once:true }}
      whileHover={{ scale:1.03 }}
      className={`
        relative
        h-[260px]
        md:h-[320px]
        rounded-3xl
        overflow-hidden
        shadow-xl
        group
        ${className}
      `}
    >

      {/* IMAGE */}

      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width:768px) 100vw, 50vw"
        className="
          object-cover
          transition
          duration-700
          group-hover:scale-110
        "
      />

      {/* GRADIENT OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"/>

      {/* HOVER GLASS */}

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition backdrop-blur-sm bg-white/5"/>

      {/* CONTENT */}

      <div className="absolute bottom-0 p-6 md:p-8 text-white max-w-md">

        <h3 className="text-2xl md:text-3xl font-serif mb-2">
          {title}
        </h3>

        <p className="text-zinc-200 text-sm md:text-base leading-relaxed">
          {description}
        </p>

      </div>

    </motion.div>

  )

}