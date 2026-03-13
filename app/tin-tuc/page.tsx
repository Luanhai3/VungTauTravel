"use client"

export default function NewsPage() {
  return (
    <main className="w-full min-h-screen bg-[#020a1a]">

      {/* HERO */}

      <section className="relative w-full overflow-hidden">

        <img
          src="/newvttravel.jpg"
          alt="Vung Tau Travel"
          className="w-full h-auto object-contain"
        />

        {/* light shimmer effect */}

        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute inset-0 bg-gradient-to-r 
          from-transparent via-white/10 to-transparent 
          animate-[shimmer_8s_linear_infinite]" />

          <div className="absolute inset-0 bg-gradient-to-t
          from-blue-900/40 via-transparent to-transparent" />

        </div>

      </section>


      {/* CONTENT */}

      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 gap-10">

          <article className="border border-white/20 rounded-xl overflow-hidden hover:border-blue-400/40 transition">

            <img
              src="/images/vungtau1.jpg"
              className="w-full h-auto object-contain"
            />

            <div className="p-6">
              <h2 className="text-xl text-white font-semibold">
                5 địa điểm check-in đẹp nhất Vũng Tàu
              </h2>

              <p className="text-gray-400 mt-2">
                Những góc sống ảo nổi tiếng khi đến thành phố biển.
              </p>
            </div>

          </article>


          <article className="border border-white/20 rounded-xl overflow-hidden hover:border-blue-400/40 transition">

            <img
              src="/images/vungtau2.jpg"
              className="w-full h-auto object-contain"
            />

            <div className="p-6">
              <h2 className="text-xl text-white font-semibold">
                Các quán cà phê view biển đẹp nhất
              </h2>

              <p className="text-gray-400 mt-2">
                Thưởng thức cà phê và ngắm đường Hạ Long tuyệt đẹp.
              </p>
            </div>

          </article>

        </div>

      </section>

    </main>
  )
}