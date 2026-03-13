import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"

const hotels = [
  {
    slug: "cen-hotel",
    name: "CEN Hotel",
    location: "Bãi Sau, Vũng Tàu",
    rating: "5.0",
    price: "2.200.000đ / đêm",
    image: "/cen.webp",
    description: "Khách sạn 5 sao với kiến trúc châu Âu cổ điển và view biển tuyệt đẹp."
  },
  {
    slug: "fusion-suites",
    name: "Fusion Suites Vung Tau",
    location: "Trần Phú, Vũng Tàu",
    rating: "4.6",
    price: "1.900.000đ / đêm",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    description: "Resort hiện đại với hồ bơi vô cực và không gian nghỉ dưỡng sang trọng."
  },
  {
    slug: "santoni-homestay",
    name: "Santoni Homestay",
    location: "Bãi Sau, Vũng Tàu",
    rating: "4.5",
    price: "650.000đ / đêm",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    description: "Homestay phong cách Santorini với tone trắng xanh cực đẹp."
  }
]

export default async function HotelDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const hotel = hotels.find((h) => h.slug === slug)

  if (!hotel) return notFound()

  return (
    <main className="bg-[#0b0f14] text-white min-h-screen">

      <div className="relative h-[50vh]">

        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          className="object-cover"
        />

      </div>

      <section className="max-w-5xl mx-auto px-6 py-16 space-y-6">

        <h1 className="text-4xl font-semibold">
          {hotel.name}
        </h1>

        <p className="text-zinc-400">
          📍 {hotel.location}
        </p>

        <p className="text-emerald-400 text-lg">
          ⭐ {hotel.rating}
        </p>

        <p className="text-2xl font-bold">
          {hotel.price}
        </p>

        <p className="text-zinc-300 leading-relaxed">
          {hotel.description}
        </p>

		<Link href={`/dich-vu/luu-tru/${hotel.slug}/booking`}>
  <button className="bg-emerald-500 hover:bg-emerald-400 px-8 py-3 rounded-xl text-black font-semibold">
    Đặt phòng
  </button>
</Link>

      </section>

    </main>
  )
}