import prisma from '../../../lib/prisma'
import { connection } from 'next/server'
import CardapioClient from './CardapioClient'

export default async function CardapioPage() {
  await connection()
  
  const rawProducts = await prisma.product.findMany({ 
    include: { category: true, optionGroups: { include: { options: true } } } 
  })
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  const products = rawProducts.map(p => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    optionGroups: p.optionGroups.map(g => ({
      ...g,
      options: g.options.map(o => ({ ...o, price: Number(o.price) }))
    }))
  }))

  return <CardapioClient products={products} categories={categories} />
}