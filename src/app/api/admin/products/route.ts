import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  try {
    const body = await req.json()
    const product = await prisma.product.create({
      data: {
        name: body.name, description: body.description, price: body.price,
        imageUrl: body.imageUrl, categoryId: body.categoryId, available: body.available,
        optionGroups: {
          create: body.optionGroups?.map((group: any) => ({
            name: group.name,
            options: { create: group.options?.map((opt: any) => ({ name: opt.name, price: opt.price || 0 })) }
          })) || []
        }
      }
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error) { return NextResponse.json({ error: "Erro" }, { status: 500 }) }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  try {
    const body = await req.json()
    await prisma.productOptionGroup.deleteMany({ where: { productId: body.id } })
    const product = await prisma.product.update({
      where: { id: body.id },
      data: {
        name: body.name, description: body.description, price: body.price,
        imageUrl: body.imageUrl, categoryId: body.categoryId, available: body.available,
        optionGroups: {
          create: body.optionGroups?.map((group: any) => ({
            name: group.name,
            options: { create: group.options?.map((opt: any) => ({ name: opt.name, price: opt.price || 0 })) }
          })) || []
        }
      }
    })
    return NextResponse.json(product)
  } catch (error) { return NextResponse.json({ error: "Erro" }, { status: 500 }) }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  try {
    await prisma.product.delete({ where: { id: searchParams.get('id') as string } })
    return NextResponse.json({ success: true })
  } catch (error) { return NextResponse.json({ error: "Erro" }, { status: 500 }) }
}