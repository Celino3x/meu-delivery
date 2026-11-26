'use client'
import { useState } from 'react'
import { PlusCircle, ImageIcon, Edit, Trash2, Loader2 } from 'lucide-react'
import NovoProdutoModal from './NovoProdutoModal'
import { useRouter } from 'next/navigation'

export default function CardapioClient({ products, categories }: { products: any[], categories: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const handleEdit = (product: any) => {
    setProductToEdit(product)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setProductToEdit(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setDeletingId(id)
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      setDeletingId(null)
      router.refresh()
    }
  }

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Cardápio</h1>
          <p className="text-sm text-[#5A5A66] mt-1">Gerencie os produtos da sua loja</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-[#FF5A1F] hover:bg-[#E84A10] text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={18} /> Novo Produto
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-[#EFEFF3] text-center">
            <p className="text-[#9A9AA8]">Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="group bg-white p-4 rounded-2xl border border-[#EFEFF3] shadow-sm flex gap-4 relative hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-xl bg-[#F6F6F8] flex items-center justify-center text-[#9A9AA8] overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm line-clamp-1">{product.name}</h3>
                <p className="text-xs text-[#9A9AA8] mt-1">{product.category?.name}</p>
                <p className="font-extrabold text-[#FF5A1F] mt-2">R$ {product.price.toFixed(2)}</p>
              </div>
              
              {/* Botões de Ação */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white p-1 rounded-lg shadow-sm border border-[#EFEFF3]">
                <button onClick={() => handleEdit(product)} className="p-1.5 text-[#5A5A66] hover:text-[#FF5A1F] hover:bg-[#FFF1EB] rounded-md transition-colors" title="Editar">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id} className="p-1.5 text-[#5A5A66] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Excluir">
                  {deletingId === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <NovoProdutoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productToEdit={productToEdit}
        categories={categories}
      />
    </div>
  )
}