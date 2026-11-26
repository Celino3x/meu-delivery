import prisma from '../../../lib/prisma'
import { connection } from 'next/server'
import { Package, Clock } from 'lucide-react'

export default async function PedidosPage() {
  await connection()
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  })

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Pedidos</h1>
        <p className="text-sm text-[#5A5A66] mt-1">Acompanhe as vendas em tempo real</p>
      </header>

      <div className="bg-white rounded-2xl border border-[#EFEFF3] shadow-sm overflow-hidden">
        {orders.map(order => (
          <div key={order.id} className="flex items-center justify-between p-4 border-b border-[#EFEFF3] last:border-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F6F6F8] flex items-center justify-center">
                <Package size={20} className="text-[#5A5A66]" />
              </div>
              <div>
                <p className="font-bold text-sm">#{order.code} - {order.customerName}</p>
                <p className="text-xs text-[#9A9AA8]">{order.items.length} itens • R$ {order.total.toString()}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold px-2 py-1 bg-[#EFF8FF] text-[#175CD3] rounded uppercase">
                {order.status}
              </span>
              <p className="text-xs text-[#9A9AA8] mt-1 flex items-center justify-end gap-1">
                <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}