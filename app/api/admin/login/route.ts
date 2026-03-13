import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  try {

    const { email, password } = await req.json()

    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, admin.password)

    if (!valid) {
      return NextResponse.json(
        { message: "Wrong password" },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (err) {

    console.error("LOGIN ERROR:", err)

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}