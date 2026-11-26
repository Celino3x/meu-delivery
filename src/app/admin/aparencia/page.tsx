import prisma from '../../../lib/prisma'
import { connection } from 'next/server'
import AparenciaClient from './AparenciaClient'

export default async function AparenciaPage() {
  await connection()
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 'singleton' }
  })

  return <AparenciaClient initialData={settings} />
}