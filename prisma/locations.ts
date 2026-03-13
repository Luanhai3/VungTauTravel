'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export type LocationData = {
  name: string
  slug: string
  description?: string
  address?: string
  lat?: number
  lng?: number
  coverImage?: string
  images?: string[] // Mảng URL ảnh gallery
}

// CREATE
export async function createLocation(data: LocationData) {
  const { images, ...rest } = data
  
  await prisma.location.create({
    data: {
      ...rest,
      images: {
        create: images?.map((url) => ({ url })) || [],
      },
    },
  })

  revalidatePath('/dia-diem')
  redirect('/dia-diem') // Hoặc redirect về trang admin
}

// UPDATE
export async function updateLocation(id: string, data: LocationData) {
  const { images, ...rest } = data

  // Xử lý cập nhật thông tin cơ bản
  await prisma.location.update({
    where: { id },
    data: { ...rest },
  })

  // Xử lý logic cập nhật ảnh gallery (ở đây demo đơn giản là xoá cũ thêm mới nếu cần)
  if (images) {
    await prisma.locationImage.deleteMany({ where: { locationId: id } })
    await prisma.locationImage.createMany({
      data: images.map((url) => ({ url, locationId: id })),
    })
  }

  revalidatePath(`/dia-diem/${data.slug}`)
  revalidatePath('/dia-diem')
}

// DELETE
export async function deleteLocation(id: string) {
  // Lấy slug trước khi xóa để revalidate đúng path trang chi tiết
  const location = await prisma.location.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.location.delete({ where: { id } });

  revalidatePath('/dia-diem');
  if (location) {
    revalidatePath(`/dia-diem/${location.slug}`);
  }
}

// GET ALL (Helper for Admin List)
export async function getLocations() {
  return await prisma.location.findMany({ orderBy: { createdAt: 'desc' } })
}