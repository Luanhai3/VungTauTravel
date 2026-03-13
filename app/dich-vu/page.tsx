"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const services = [
  {
    title: "Lưu trú",
    desc: "Khách sạn, resort và homestay gần biển với nhiều mức giá.",
    href: "/dich-vu/luu-tru"
  },
  {
    title: "Ăn uống",
    desc: "Nhà hàng hải sản, quán ăn địa phương và cafe đẹp.",
    href: "/dich-vu/an-uong"
  },
  {
    title: "Vui chơi giải trí",
    desc: "Bãi biển, khu check-in và các hoạt động du lịch.",
    href: "/dich-vu/vui-choi"
  },
  {
    title: "Vận chuyển",
    desc: "Thuê xe máy, taxi và dịch vụ di chuyển du lịch.",
    href: "/dich-vu/van-chuyen"
  }
]

export default function ServicesPage() {
  return (

    <main
      className="min-h-screen"
      style={{ background: "#F5F5DC" }}
    >

      <section className="max-w-6xl mx-auto px-6 py-24">

        {/* TITLE */}

        <motion.div
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.6}}
          className="text-center mb-16"
        >

          <h1 className="text-4xl md:text-5xl font-serif text-zinc-800 mb-6">
            Dịch vụ du lịch
          </h1>

          <p className="max-w-2xl mx-auto text-stone-600 leading-relaxed">
            Khám phá các dịch vụ giúp chuyến đi Vũng Tàu của bạn thuận tiện
            hơn. Từ lưu trú, ẩm thực cho đến phương tiện di chuyển
            và các hoạt động vui chơi.
          </p>

        </motion.div>


        {/* SERVICE GRID */}

        <div className="grid md:grid-cols-2 gap-10">

          {services.map((s, i) => (

            <motion.div
              key={i}
              initial={{opacity:0,y:30}}
              whileInView={{opacity:1,y:0}}
              transition={{duration:0.5, delay:i*0.1}}
              viewport={{once:true}}
            >

              <Link
                href={s.href}
                className="
                group
                block
                p-8
                rounded-2xl
                bg-white
                border
                border-[#E7E2C9]
                hover:shadow-xl
                hover:-translate-y-1
                transition
                "
              >

                <h3 className="text-2xl font-semibold text-zinc-800 mb-3 group-hover:text-[#3A6EA5] transition">
                  {s.title}
                </h3>

                <p className="text-stone-600 leading-relaxed">
                  {s.desc}
                </p>

                <span className="inline-block mt-6 text-sm text-stone-500 group-hover:text-[#3A6EA5] transition">
                  Xem chi tiết →
                </span>

              </Link>

            </motion.div>

          ))}

        </div>


        {/* INFO */}

        <motion.div
          initial={{opacity:0}}
          whileInView={{opacity:1}}
          transition={{duration:0.7}}
          viewport={{once:true}}
          className="mt-24 text-center max-w-3xl mx-auto"
        >

          <h2 className="text-2xl font-serif text-zinc-800 mb-4">
            Trải nghiệm Vũng Tàu trọn vẹn
          </h2>

          <p className="text-stone-600 leading-relaxed">
            Vũng Tàu không chỉ có biển mà còn có rất nhiều trải nghiệm
            thú vị. Từ khách sạn ven biển, quán hải sản nổi tiếng đến
            các hoạt động du lịch hấp dẫn.
          </p>

        </motion.div>

      </section>

    </main>
  )
}