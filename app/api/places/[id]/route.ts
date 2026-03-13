import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req:Request,{params}:any){

  const body = await req.json()

  const place = await prisma.place.update({
    where:{ id:Number(params.id) },
    data:body
  })

  return NextResponse.json(place)
}

export async function DELETE(req:Request,{params}:any){

  await prisma.place.delete({
    where:{ id:Number(params.id) }
  })

  return NextResponse.json({success:true})
}