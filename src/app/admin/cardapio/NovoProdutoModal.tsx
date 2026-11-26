'use client'
import { useState, useEffect, useRef } from 'react'
import { X, Loader2, Plus, Trash2, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NovoProdutoModal({ isOpen, onClose, productToEdit, categories }: { isOpen: boolean, onClose: () => void, productToEdit?: any, categories: any[] }) {
  const [loading, setLoading] = useState(false)
  const [optionGroups, setOptionGroups] = useState<any[]>([])
  const [imageUrl, setImageUrl] = useState<string>(productToEdit?.imageUrl || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (productToEdit && isOpen) {
      setOptionGroups(productToEdit.optionGroups || [])
      setImageUrl(productToEdit.imageUrl || '')
    } else {
      setOptionGroups([])
      setImageUrl('')
    }
  }, [productToEdit, isOpen])

  if (!isOpen) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImageUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const addGroup = () => setOptionGroups([...optionGroups, { name: '', options: [{ name: '', price: 0 }] }])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      id: productToEdit?.id,
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      categoryId: formData.get('categoryId'),
      available: formData.get('available') === 'true',
      imageUrl,
      optionGroups
    }

    await fetch('/api/admin/products', {
      method: productToEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    setLoading(false)
    onClose()
    router.refresh()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl relative my-8">
        <button onClick={onClose} className="absolute right-4 top-4 text-[#9A9AA8] hover:text-[#0F0F12]">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-extrabold mb-6">{productToEdit ? 'Editar Produto' : 'Novo Produto'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Linha 1: Foto e Dados Básicos */}
          <div className="flex gap-6">
            <div className="w-32 flex flex-col items-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#EFEFF3] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F6F6F8] overflow-hidden relative"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Produto" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload size={24} className="text-[#9A9AA8] mb-1" />
                    <span className="text-[10px] text-[#9A9AA8] text-center px-2">Adicionar Foto</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <label className="text-xs font-bold text-[#5A5A66] uppercase mb-1 block">Nome</label>
                <input name="name" defaultValue={productToEdit?.name} required className="w-full px-4 py-2 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#5A5A66] uppercase mb-1 block">Descrição</label>
                <input name="description" defaultValue={productToEdit?.description} className="w-full px-4 py-2 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] outline-none text-sm" />
              </div>
            </div>
          </div>

          {/* Linha 2: Preço, Categoria e Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#5A5A66] uppercase mb-1 block">Preço Base</label>
              <input name="price" type="number" step="0.01" defaultValue={productToEdit?.price} required className="w-full px-4 py-2 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] outline-none text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#5A5A66] uppercase mb-1 block">Categoria</label>
              <select name="categoryId" defaultValue={productToEdit?.categoryId} className="w-full px-4 py-2 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] outline-none text-sm bg-white">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#5A5A66] uppercase mb-1 block">Status</label>
              <select name="available" defaultValue={productToEdit?.available ? 'true' : 'true'} className="w-full px-4 py-2 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] outline-none text-sm bg-white">
                <option value="true">Disponível</option>
                <option value="false">Esgotado</option>
              </select>
            </div>
          </div>

          {/* Seção de Complementos */}
          <div className="bg-[#F6F6F8] p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F0F12]">Grupos de Complementos</h3>
                <p className="text-xs text-[#5A5A66]">Ex: "Tamanho da Pizza", "Adicionais"</p>
              </div>
              <button type="button" onClick={addGroup} className="text-xs font-bold bg-white text-[#FF5A1F] border border-[#EFEFF3] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                <Plus size={14} /> Adicionar Grupo
              </button>
            </div>
            
            {optionGroups.map((group, gIndex) => (
              <div key={gIndex} className="bg-white p-4 rounded-xl mb-3 border border-[#EFEFF3]">
                <div className="flex gap-2 mb-3">
                  <input 
                    placeholder="Nome do Grupo (ex: Escolha o sabor)" 
                    value={group.name}
                    onChange={e => {
                      const newGroups = [...optionGroups]
                      newGroups[gIndex].name = e.target.value
                      setOptionGroups(newGroups)
                    }}
                    className="flex-1 px-3 py-2 text-sm font-bold rounded-lg border border-[#EFEFF3] outline-none"
                  />
                  <button type="button" onClick={() => setOptionGroups(optionGroups.filter((_, i) => i !== gIndex))} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="space-y-2 ml-2">
                  {group.options.map((opt: any, oIndex: number) => (
                    <div key={oIndex} className="flex gap-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-[#EFEFF3]"></div>
                      <input 
                        placeholder="Nome da opção (ex: Grande)" 
                        value={opt.name}
                        onChange={e => {
                          const newGroups = [...optionGroups]
                          newGroups[gIndex].options[oIndex].name = e.target.value
                          setOptionGroups(newGroups)
                        }}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#EFEFF3] outline-none"
                      />
                      <div className="flex items-center gap-1 bg-[#F6F6F8] rounded-lg px-2 border border-[#EFEFF3]">
                        <span className="text-xs text-[#9A9AA8]">R$</span>
                        <input 
                          type="number" 
                          placeholder="0.00" 
                          value={opt.price}
                          onChange={e => {
                            const newGroups = [...optionGroups]
                            newGroups[gIndex].options[oIndex].price = Number(e.target.value)
                            setOptionGroups(newGroups)
                          }}
                          className="w-16 py-1.5 text-xs bg-transparent outline-none font-semibold"
                        />
                      </div>
                      <button type="button" onClick={() => {
                        const newGroups = [...optionGroups]
                        newGroups[gIndex].options = newGroups[gIndex].options.filter((_: any, i: number) => i !== oIndex)
                        setOptionGroups(newGroups)
                      }} className="text-[#9A9AA8] hover:text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => {
                      const newGroups = [...optionGroups]
                      newGroups[gIndex].options.push({ name: '', price: 0 })
                      setOptionGroups(newGroups)
                    }}
                    className="text-xs font-bold text-[#5A5A66] mt-2 hover:text-[#FF5A1F] flex items-center gap-1"
                  >
                    <Plus size={12} /> Adicionar Opção
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#FF5A1F] hover:bg-[#E84A10] text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center shadow-md">
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Produto'}
          </button>
        </form>
      </div>
    </div>
  )
}