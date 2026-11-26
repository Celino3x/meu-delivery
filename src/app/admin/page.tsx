import prisma from '../../lib/prisma'
import { Package, DollarSign, CheckCircle2 } from 'lucide-react'
import { connection } from 'next/server'

export default async function AdminDashboard() {
  await connection()

  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  })

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Visão Geral</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Pedidos Hoje" value="12" icon={<Package />} />
        <StatCard title="Faturamento" value="R$ 980" icon={<DollarSign />} />
        <StatCard title="Ticket Médio" value="R$ 81" icon={<DollarSign />} />
        <StatCard title="Novos" value="3" icon={<CheckCircle2 />} color="#3B82F6" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EFEFF3]">
        <h2 className="text-lg font-extrabold tracking-tight mb-6">Pedidos Recentes</h2>
        {/* ... (mesma lista de pedidos que já tínhamos) ... */}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color = "#0F0F12" }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFEFF3] flex flex-col gap-2">
      <div className="text-xs text-[#9A9AA8] font-bold uppercase tracking-wider">{title}</div>
      <div className="text-2xl font-extrabold tracking-tight" style={{ color }}>{value}</div>
    </div>
  )
}