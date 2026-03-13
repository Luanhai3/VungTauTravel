"use client"

import { motion } from "framer-motion"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative pt-40 pb-32 text-center overflow-hidden">

        {/* background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="uppercase tracking-[0.35em] text-sm text-white/60 mb-6"
          >
            Vung Tau Travel
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-6xl leading-tight"
          >
            Liên hệ với chúng tôi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 mt-6 text-lg"
          >
            Hãy để chúng tôi giúp bạn lên kế hoạch cho chuyến đi hoàn hảo tại Vũng Tàu.
          </motion.p>

        </div>

      </section>


      {/* CONTACT SECTION */}
      <section className="bg-zinc-50 text-zinc-900 rounded-t-[60px] pt-24 pb-32">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">

          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-10 rounded-2xl shadow-sm"
          >

            <h2 className="font-display text-3xl mb-10">
              Thông tin liên hệ
            </h2>

            <div className="space-y-8 text-zinc-700">

              <div>
                <p className="uppercase text-xs tracking-widest text-zinc-400">
                  Địa chỉ
                </p>
                <p className="mt-2 text-lg">
                  123 Trần Phú, Vũng Tàu, Việt Nam
                </p>
              </div>

              <div>
                <p className="uppercase text-xs tracking-widest text-zinc-400">
                  Email
                </p>
                <p className="mt-2 text-lg">
                  contact@vungtautravel.vn
                </p>
              </div>

              <div>
                <p className="uppercase text-xs tracking-widest text-zinc-400">
                  Điện thoại
                </p>
                <p className="mt-2 text-lg">
                  +84 912 345 678
                </p>
              </div>

            </div>

            <div className="w-20 h-[2px] bg-zinc-900 mt-12" />

          </motion.div>


          {/* CONTACT FORM */}
          <motion.form
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="bg-white p-12 rounded-3xl shadow-xl space-y-10 border border-zinc-200"
          >

            <div className="grid md:grid-cols-2 gap-8">

              <Input label="Họ và tên" />
              <Input label="Email" type="email" />

            </div>

            <Input label="Chủ đề" />

            <Textarea label="Nội dung" />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="w-full py-4 rounded-full font-medium text-white bg-black hover:bg-zinc-800 transition"
            >
              Gửi tin nhắn
            </motion.button>

          </motion.form>

        </div>

      </section>

    </main>
  )
}


/* INPUT COMPONENT */
function Input({ label, type = "text" }: any) {
  return (
    <div className="relative group">

      <input
        type={type}
        required
        className="peer w-full border-b border-zinc-300 bg-transparent py-3 outline-none focus:border-black"
      />

      <label
        className="
        absolute left-0 top-3
        text-xs tracking-widest uppercase
        text-zinc-500
        transition-all
        peer-focus:-top-3
        peer-focus:text-[10px]
        peer-focus:text-black
        peer-valid:-top-3
        peer-valid:text-[10px]
      "
      >
        {label}
      </label>

      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-focus-within:w-full" />

    </div>
  )
}


/* TEXTAREA COMPONENT */
function Textarea({ label }: any) {
  return (
    <div className="relative group pt-4">

      <textarea
        required
        rows={4}
        placeholder=" "
        className="peer w-full bg-transparent pt-2 pb-3 outline-none resize-none text-zinc-800"
      />

      <label
        className="
        absolute left-0 top-4
        text-xs tracking-widest uppercase
        text-zinc-500
        transition-all
        peer-focus:-top-2
        peer-focus:text-[10px]
        peer-focus:text-black
        peer-valid:-top-2
        peer-valid:text-[10px]
      "
      >
        {label}
      </label>

      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-300" />

      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-focus-within:w-full" />

    </div>
  )
}