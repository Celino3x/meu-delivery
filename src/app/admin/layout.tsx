import Link from 'next/link'
import { Package, Palette, Clock, LogOut, Tag } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F6F6F8] text-[#0F0F12]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#EFEFF3] p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-[#0F0F12] text-white flex items-center justify-center font-bold text-sm">D</div>
          <strong className="font-extrabold tracking-tight">Delivery Admin</strong>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F6F6F8] text-[#5A5A66] font-medium text-sm transition-colors">
            <Clock size={18} /> Dashboard
          </Link>
          <Link href="/admin/cardapio" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F6F6F8] text-[#5A5A66] font-medium text-sm transition-colors">
            <Package size={18} /> Cardápio
          </Link>
          <Link href="/admin/categorias" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F6F6F8] text-[#5A5A66] font-medium text-sm transition-colors">
            <Tag size={18} /> Categorias
          </Link>
          <Link href="/admin/aparencia" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F6F6F8] text-[#5A5A66] font-medium text-sm transition-colors">
            <Palette size={18} /> Aparência
          </Link>
        </nav>

        <div className="mt-auto border-t border-[#EFEFF3] pt-4">
          <a href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-[#5A5A66] font-medium text-sm transition-colors">
            <LogOut size={18} /> Sair
          </a>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}