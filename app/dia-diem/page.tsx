import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import Image from 'next/image'

const prisma = new PrismaClient()

export default async function DiaDiemPage() {
  const locations = await prisma.location.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Khám Phá Vũng Tàu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <Link 
            href={`/dia-diem/${loc.slug}`} 
            key={loc.id}
            className="group block border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="relative h-48 w-full">
              <Image
                src={loc.coverImage || '/placeholder.jpg'}
                alt={loc.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">{loc.name}</h2>
              <p className="text-gray-600 line-clamp-2 text-sm">
                {loc.description || 'Chưa có mô tả.'}
              </p>
              <div className="mt-4 text-sm text-gray-500 flex items-center">
                📍 {loc.address || 'Vũng Tàu'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}