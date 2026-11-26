import { PrismaClient } from './src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  console.log("🔍 URL do banco:", process.env.DATABASE_URL?.substring(0, 30) + "...")
  
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  console.log("🔍 O modelo User existe?", !!prisma.user)

  if (!prisma.user) {
    console.error("❌ O modelo User NÃO existe no Prisma Client gerado. Verifique o schema.prisma.")
    process.exit(1)
  }

  const email = 'admin@loja.com'
  const password = 'admin123'
  const passwordHash = await hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Administrador',
      passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuário criado/atualizado com sucesso:', user.email)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('❌ Erro grave:', e)
  process.exit(1)
})