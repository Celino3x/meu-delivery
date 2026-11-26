import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("🔍 1. Tentando logar com:", credentials?.email)

          if (!credentials?.email || !credentials?.password) return null

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            console.log("❌ 2. Usuário NÃO encontrado no banco!")
            return null
          }

          console.log("✅ 3. Usuário encontrado. Hash no banco:", user.passwordHash)
          
          const passwordMatch = await compare(credentials.password, user.passwordHash)
          
          console.log("🔑 4. A senha digitada bate com o hash?", passwordMatch)

          if (!passwordMatch) return null

          return { id: user.id, name: user.name, email: user.email, role: user.role }
        } catch (error) {
          console.error("🚨 ERRO GRAVE NO PRISMA:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: "jwt" }
}