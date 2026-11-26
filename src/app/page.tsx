import prisma from '@/lib/prisma'
import { connection } from 'next/server'
import ClientHome from './ClientHome'

export default async function Home() {
  await connection()

  // Busca a loja, categorias e produtos com complementos
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } })
  const categories = await prisma.category.findMany({ 
    where: { active: true },
    include: { 
      products: { 
        where: { active: true, available: true },
        include: { optionGroups: { include: { options: true } } }
      } 
    } 
  })

  // Converte os Decimais para Number antes de passar para o Client Component
  const serializedCategories = categories.map(cat => ({
    ...cat,
    products: cat.products.map(prod => ({
      ...prod,
      price: Number(prod.price),
      optionGroups: prod.optionGroups.map(g => ({
        ...g,
        options: g.options.map(o => ({ ...o, price: Number(o.price) }))
      }))
    }))
  }))

  return <ClientHome categories={serializedCategories} settings={settings} />
}