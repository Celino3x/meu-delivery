import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const body = await req.json()

      const settings = await prisma.storeSettings.upsert({
      where: { id: "singleton" },
      update: {
        storeName: body.storeName,
        primaryColor: body.primaryColor,
        logoUrl: body.logoUrl,
      },
      create: {
        id: "singleton",
        storeName: body.storeName,
        primaryColor: body.primaryColor,
        logoUrl: body.logoUrl,
        whatsappNumber: "5511999999999",
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 })
  }
}

export async function GET() {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: "singleton" }
  })
  return NextResponse.json(settings)
}