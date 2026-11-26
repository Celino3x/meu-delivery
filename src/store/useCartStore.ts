import { create } from 'zustand'

export interface CartItem {
  id: string // ID do produto
  name: string
  price: number
  quantity: number
  imageUrl?: string
  selectedOptions?: { name: string; price: number }[] // Complementos
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (newItem) => {
    const currentItems = get().items
    const existingItemIndex = currentItems.findIndex(item => 
      item.id === newItem.id && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(newItem.selectedOptions)
    )

    if (existingItemIndex >= 0) {
      const newItems = [...currentItems]
      newItems[existingItemIndex].quantity += newItem.quantity
      set({ items: newItems })
    } else {
      set({ items: [...currentItems, newItem] })
    }
  },
  removeItem: (id) => set({ items: get().items.filter(item => item.id !== id) }),
  updateQuantity: (id, quantity) => {
    set({
      items: get().items.map(item => 
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    })
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => get().items.reduce((total, item) => {
    const optionsPrice = item.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0
    return total + ((item.price + optionsPrice) * item.quantity)
  }, 0)
}))