'use client'
import { useState } from 'react'
import { Search, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import ProductModal from './ProductModal'
import CartDrawer from './CartDrawer'

export default function ClientHome({ categories, settings }: { categories: any[], settings: any }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id)
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  const cart = useCartStore()
  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0)
  const primaryColor = settings?.primaryColor || '#FF5A1F'

  const filteredCategories = categories.filter(cat => {
    if (search) {
      return cat.products.some((p: any) => p.name.toLowerCase().includes(search.toLowerCase()))
    }
    return cat.id === activeCategory
  })

  return (
    // MUDANÇA AQUI: Removido 'max-w-md' e adicionado limite só para telas grandes
    <div className="min-h-screen bg-[#FAFAFB] pb-24 w-full flex flex-col items-center">
      
      {/* Container Central - no celular 100%, no PC fica limitado a 1200px */}
      <div className="w-full max-w-6xl flex flex-col items-center">
        
        {/* Header */}
        <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md border-b border-[#EFEFF3] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg overflow-hidden" style={{ backgroundColor: primaryColor }}>
            {settings?.logoUrl ? <img src={settings.logoUrl} className="w-full h-full object-cover" /> : settings?.storeName?.charAt(0) || 'L'}
          </div>
          <div className="flex-1">
            <h1 className="font-extrabold text-sm">{settings?.storeName || 'Minha Loja'}</h1>
            <div className="flex items-center gap-1 text-[11px] text-[#5A5A66] mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Aberto agora
            </div>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="w-10 h-10 rounded-xl bg-[#F6F6F8] flex items-center justify-center relative">
            <ShoppingBag size={20} className="text-[#0F0F12]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white" style={{ backgroundColor: primaryColor }}>
                {totalItems}
              </span>
            )}
          </button>
        </header>

        {/* Banner - Largura total no Desktop */}
        <div className="w-full p-4 md:p-6">
          <div className="rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-center h-48 md:h-64" style={{ background: `linear-gradient(135deg, ${primaryColor}, #E84A10)` }}>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-extrabold mb-2">Bateu a fome?</h2>
              <p className="text-sm md:text-lg opacity-90">Peça agora e receba em casa.</p>
            </div>
          </div>
        </div>

        {/* Busca e Categorias */}
        <div className="w-full px-4 md:px-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white rounded-xl flex items-center px-4 py-3 border border-[#EFEFF3] shadow-sm">
            <Search size={18} className="text-[#9A9AA8] mr-2" />
            <input 
              type="text" 
              placeholder="Buscar no cardápio..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          
          {!search && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'text-white' : 'bg-white text-[#5A5A66] border border-[#EFEFF3]'}`}
                  style={activeCategory === cat.id ? { backgroundColor: primaryColor } : {}}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MUDANÇA AQUI: Grid de Produtos Responsivo */}
        <div className="w-full p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map(category => (
            category.products.map((product: any) => (
              <div key={product.id} onClick={() => setSelectedProduct(product)} className="bg-white p-3 rounded-2xl border border-[#EFEFF3] flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-xl bg-[#F6F6F8] overflow-hidden flex-shrink-0">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-base">{product.name}</h3>
                  <p className="text-xs text-[#9A9AA8] line-clamp-2 mt-1">{product.description}</p>
                  <p className="font-extrabold text-base mt-2" style={{ color: primaryColor }}>R$ {product.price.toFixed(2)}</p>
                </div>
              </div>
            ))
          ))}
        </div>

        {/* Modais (que já estavam criados) */}
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            primaryColor={primaryColor}
          />
        )}

        {isCartOpen && (
          <CartDrawer 
            onClose={() => setIsCartOpen(false)} 
            primaryColor={primaryColor}
            settings={settings}
          />
        )}
      </div>
    </div>
  )
}