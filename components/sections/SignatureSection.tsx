"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function SignatureSection() {

  const places = [
    {
      title: "Bai Sau Beach",
      image: "/baisauvt.png",
      top: "10%",
      left: "5%",
    },
    {
      title: "Local Seafood",
      image: "/localfood.jpg",
      top: "60%",
      left: "8%",
    },
    {
      title: "Sunset Coast",
      image: "/sunrise.jpg",
      top: "20%",
      right: "6%",
    },
    {
      title: "Hidden Cliff",
      image: "/vachda.png",
      top: "65%",
      right: "8%",
    },
  ]

  return (
    <section className="relative py-32 px-6 max-w-7xl mx-auto bg-[#F0FFF0]">

      {/* HEADER */}

      <div className="text-center max-w-2xl mx-auto mb-24">

        <p className="text-xs tracking-[0.4em] text-[#5F7F70] mb-4">
          SIGNATURE PLACES
        </p>

        <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-6 text-[#1F3A2E]">
          Discover the Spirit of Vung Tau
        </h2>

        <p className="text-[#5F7F70]">
          From sunrise beaches to hidden coastal corners,
          every place tells a different story of the sea.
        </p>

      </div>


      {/* FLOATING GALLERY */}

      <div className="relative h-[650px] md:h-[720px]">

        {/* CENTER IMAGE */}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 mx-auto w-[320px] md:w-[420px] h-[480px] md:h-[560px] rounded-[32px] overflow-hidden shadow-2xl"
        >

          <Image
            src="/langiobien.png"
            alt="Vung Tau Beach"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F17]/70 to-transparent"/>

          <div className="absolute bottom-0 p-8 text-white">
            <h3 className="text-2xl font-serif mb-2">
              The Coastline
            </h3>
            <p className="text-sm text-[#DFF5E6]">
              Where the city meets the ocean breeze.
            </p>
          </div>

        </motion.div>


        {/* FLOATING CARDS */}

        {places.map((place, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ scale: 1.06 }}
            className="absolute w-[160px] md:w-[190px] h-[200px] md:h-[230px] rounded-2xl overflow-hidden shadow-xl cursor-pointer"
            style={{
              top: place.top,
              left: place.left,
              right: place.right,
            }}
          >

            <Image
              src={place.image}
              alt={place.title}
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F17]/75 to-transparent"/>

            <div className="absolute bottom-0 p-4 text-white text-sm font-medium">
              {place.title}
            </div>

          </motion.div>
        ))}

      </div>

    </section>
  )
}