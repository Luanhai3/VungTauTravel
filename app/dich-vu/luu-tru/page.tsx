"use client"

import Image from "next/image"
import Link from "next/link"

const hotels = [
  {
    slug: "cen-hotel",
    name: "CEN Hotel",
    location: "Bãi Sau, Vũng Tàu",
    rating: 5.0,
    image: "/cen.webp",
    description: "Khách sạn 5 sao với kiến trúc châu Âu cổ điển và view biển tuyệt đẹp, cách Bãi Sau chỉ vài phút đi bộ",

    rooms: [
      { type: "Phòng 1 giường", price: 1200000 },
      { type: "Phòng 2 giường", price: 1600000 },
      { type: "Phòng VIP", price: 2200000 },
      { type: "Phòng gia đình", price: 2600000 }
    ]
  },

  {
    slug: "fusion-suites",
    name: "Fusion Suites Vung Tau",
    location: "Trần Phú, Vũng Tàu",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    description: "Resort hiện đại với hồ bơi vô cực và không gian nghỉ dưỡng sang trọng.",

    rooms: [
      { type: "Phòng Deluxe", price: 1500000 },
      { type: "Phòng Ocean View", price: 1900000 },
      { type: "Phòng Suite", price: 2500000 }
    ]
  },

  {
    slug: "santoni-homestay",
    name: "Santoni Homestay",
    location: "Bãi Sau, Vũng Tàu",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    description: "Homestay phong cách Santorini với tone trắng xanh cực đẹp.",

    rooms: [
      { type: "Phòng đôi", price: 650000 },
      { type: "Phòng ban công", price: 800000 },
      { type: "Phòng gia đình", price: 1100000 }
    ]
  }
]

export default function LuuTruPage() {
  return (
    <main className="bg-[#0b0f14] text-white min-h-screen">

      <section className="max-w-7xl mx-auto px-6 py-24">

        <h1 className="text-3xl md:text-4xl text-center mb-16">
          Khách sạn & Homestay nổi bật
        </h1>

        <div className="grid md:grid-cols-3 gap-10">

          {hotels.map((hotel) => {

            const minPrice = Math.min(...hotel.rooms.map(r => r.price))

            return (

              <Link
                key={hotel.slug}
                href={`/dich-vu/luu-tru/${hotel.slug}`}
                className="block"
              >

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-400 transition">

                  <div className="relative h-[220px]">

                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />

                  </div>

                  <div className="p-6 space-y-3">

                    <h3 className="text-xl font-semibold">
                      {hotel.name}
                    </h3>

                    <p className="text-zinc-400 text-sm">
                      📍 {hotel.location}
                    </p>

                    <p className="text-sm text-zinc-300">
                      {hotel.description}
                    </p>

                    <div className="flex justify-between items-center pt-2">

                      <span className="text-emerald-400">
                        ⭐ {hotel.rating}
                      </span>

                      <span className="font-bold">
                        từ {minPrice.toLocaleString()}đ
                      </span>

                    </div>

                    <p className="text-xs text-zinc-500">
                      {hotel.rooms.length} loại phòng
                    </p>

                  </div>

                </div>

              </Link>

            )
          })}

        </div>

      </section>

    </main>
  )
}