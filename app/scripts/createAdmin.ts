import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

async function main() {
  const password = await bcrypt.hash("123456", 10)

  const admin = await prisma.admin.create({
    data: {
      email: "admin@vungtautravel.com",
      password: password
    }
  })

  console.log("Admin created:", admin)
}

main()