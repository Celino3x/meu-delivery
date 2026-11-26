import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  try {
    const { name } = await req.json()
    const category = await prisma.category.create({
      data: { name, slug: name.toLowerCase().replace(/ /g, '-') }
    })
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  try {
    await prisma.category.delete({ where: { id: id as string } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const { id, name } = await req.json()
    
    const category = await prisma.category.update({
      where: { id },
      data: { 
        name,
        slug: name.toLowerCase().replace(/ /g, '-') // Atualiza o slug também
      }
    })
    
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao editar categoria" }, { status: 500 })
  }
}