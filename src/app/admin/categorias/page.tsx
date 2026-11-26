'use client'
import { useState, useEffect } from 'react'
import { PlusCircle, Trash2, Loader2, Edit2, Check, X } from 'lucide-react'

export default function CategoriasPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Estados para edição
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories')
    setCategories(await res.json())
  }

  useEffect(() => { fetchCategories() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name })
    })
    setName('')
    setLoading(false)
    fetchCategories()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Excluir esta categoria? Todos os produtos vinculados a ela podem ficar sem categoria.')) {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' })
      if (!res.ok) alert('Não é possível excluir uma categoria que tem produtos.')
      fetchCategories()
    }
  }

  const startEditing = (cat: any) => {
    setEditingId(cat.id)
    setEditName(cat.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditName('')
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return
    
    setLoading(true)
    await fetch('/api/admin/categories', {
      method: 'PUT',
      body: JSON.stringify({ id, name: editName })
    })
    setLoading(false)
    setEditingId(null)
    fetchCategories()
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Categorias</h1>
        <p className="text-sm text-[#5A5A66] mt-1">Organize os itens do seu cardápio</p>
      </header>

      <div className="bg-white p-6 rounded-2xl border border-[#EFEFF3] shadow-sm max-w-2xl">
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            placeholder="Nome da nova categoria (ex: Pizzas, Bebidas...)" 
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] outline-none text-sm"
            required
          />
          <button type="submit" disabled={loading} className="bg-[#0F0F12] text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />} Adicionar
          </button>
        </form>

        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-sm text-[#9A9AA8] text-center py-4">Nenhuma categoria cadastrada.</p>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className="flex justify-between items-center p-3 bg-[#F6F6F8] rounded-xl">
                {editingId === cat.id ? (
                  // Modo de Edição
                  <div className="flex items-center gap-2 flex-1 mr-4">
                    <input 
                      type="text" 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#FF5A1F] outline-none text-sm bg-white"
                      autoFocus
                    />
                    <button onClick={() => saveEdit(cat.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md" title="Salvar">
                      <Check size={18} />
                    </button>
                    <button onClick={cancelEditing} className="p-1.5 text-[#9A9AA8] hover:bg-gray-200 rounded-md" title="Cancelar">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  // Modo de Visualização
                  <>
                    <span className="font-semibold text-sm">{cat.name}</span>
                    <div className="flex gap-1">
                      <button onClick={() => startEditing(cat)} className="text-[#9A9AA8] hover:text-[#FF5A1F] p-2 rounded-lg hover:bg-[#FFF1EB] transition-colors" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="text-[#9A9AA8] hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}