import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const code = Math.random().toString(36).substring(2, 6).toUpperCase()

    const order = await prisma.order.create({
      data: {
        code,
        customerName: body.name,
        customerPhone: body.phone,
        fulfillmentType: 'DELIVERY',
        addressStreet: body.address,
        distanceKm: body.distance,
        paymentMethod: body.payment === 'PIX' ? 'PIX' : body.payment === 'Cartão' ? 'CARD' : 'CASH',
        subtotal: body.subtotal,
        deliveryFee: body.deliveryFee,
        total: body.total,
        status: 'NEW',
        items: {
          create: body.items.map((item: any) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
          }))
        }
      }
    })
    return NextResponse.json(order)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao salvar pedido" }, { status: 500 })
  }
}