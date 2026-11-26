'use client'
import { useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

export default function ProductModal({ product, onClose, primaryColor }: any) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<any[]>([])
  const addItem = useCartStore(state => state.addItem)

  const handleOptionToggle = (group: any, option: any) => {
    const isSelected = selectedOptions.find(o => o.name === option.name)
    
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter(o => o.name !== option.name))
    } else {
      // Se for um grupo de escolha única (maxSelect 1), remove as outras opções do mesmo grupo
      if (group.maxSelect === 1) {
        const groupOptionsNames = group.options.map((o: any) => o.name)
        const filtered = selectedOptions.filter(o => !groupOptionsNames.includes(o.name))
        setSelectedOptions([...filtered, option])
      } else {
        setSelectedOptions([...selectedOptions, option])
      }
    }
  }

  const optionsTotal = selectedOptions.reduce((acc, opt) => acc + opt.price, 0)
  const total = (product.price + optionsTotal) * quantity

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
      selectedOptions
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        
        {/* Imagem */}
        <div className="relative h-48 bg-[#F6F6F8] flex-shrink-0">
          {product.imageUrl && <img src={product.imageUrl} className="w-full h-full object-cover" />}
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <h2 className="text-xl font-extrabold">{product.name}</h2>
          <p className="text-sm text-[#5A5A66] mt-1">{product.description}</p>
          <p className="font-extrabold text-lg mt-2" style={{ color: primaryColor }}>R$ {product.price.toFixed(2)}</p>

          {/* Grupos de Complementos */}
          {product.optionGroups?.map((group: any) => (
            <div key={group.id} className="mt-6 border-t border-[#EFEFF3] pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm">{group.name}</h3>
                <span className="text-[10px] font-bold bg-[#F6F6F8] px-2 py-1 rounded text-[#5A5A66] uppercase">
                  {group.maxSelect === 1 ? 'Obrigatório' : 'Opcional'}
                </span>
              </div>
              
              <div className="space-y-2">
                {group.options.map((option: any) => {
                  const isSelected = selectedOptions.find(o => o.name === option.name)
                  return (
                    <label key={option.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${isSelected ? 'border-[#FF5A1F] bg-[#FFF1EB]' : 'border-[#EFEFF3] hover:bg-[#F6F6F8]'}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type={group.maxSelect === 1 ? "radio" : "checkbox"}
                          checked={!!isSelected}
                          onChange={() => handleOptionToggle(group, option)}
                          className="w-4 h-4 accent-[#FF5A1F]"
                        />
                        <span className="text-sm font-medium">{option.name}</span>
                      </div>
                      {option.price > 0 && (
                        <span className="text-xs font-bold text-[#5A5A66]">+ R$ {option.price.toFixed(2)}</span>
                      )}
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer fixo */}
        <div className="p-4 border-t border-[#EFEFF3] bg-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#F6F6F8] rounded-xl p-1 border border-[#EFEFF3]">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm"><Minus size={16} /></button>
              <span className="font-bold text-sm w-4 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm"><Plus size={16} /></button>
            </div>
            <button 
              onClick={handleAdd}
              className="flex-1 text-white font-bold py-3.5 rounded-xl flex justify-between px-4"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Adicionar</span>
              <span>R$ {total.toFixed(2)}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}