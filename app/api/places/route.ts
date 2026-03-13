import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const places = await prisma.place.findMany({
    orderBy:{ createdAt:"desc" }
  })
  return NextResponse.json(places)
}

export async function POST(req:Request){

  const body = await req.json()

  const place = await prisma.place.create({
    data:{
      name:body.name,
      description:body.description,
      location:body.location,
      image:body.image
    }
  })

  return NextResponse.json(place)
}