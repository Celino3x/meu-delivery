import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Cria configurações da loja
  await prisma.storeSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      storeName: 'Pizzaria Bella',
      whatsappNumber: '5511999999999',
      primaryColor: '#FF5A1F',
    },
  })

  // Cria uma categoria
  const cat = await prisma.category.upsert({
    where: { slug: 'pizzas' },
    update: {},
    create: { name: 'Pizzas', slug: 'pizzas' },
  })

  // Cria um produto
  await prisma.product.create({
    data: {
      name: 'Pizza Calabresa',
      description: 'Mussarela, calabresa e cebola',
      price: 45.00,
      categoryId: cat.id,
      available: true,
    },
  })
  console.log('Banco populado com sucesso!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())