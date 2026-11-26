'use client'
import { useState } from 'react'
import { X, Minus, Plus, ShoppingBag, MapPin, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

export default function CartDrawer({ onClose, primaryColor, settings }: any) {
  const cart = useCartStore()
  const [step, setStep] = useState<'cart' | 'checkout'>('cart')
  
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [cep, setCep] = useState('')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState('PIX')
  
  const [loadingCep, setLoadingCep] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [distance, setDistance] = useState<number | null>(null)
  const [deliveryFee, setDeliveryFee] = useState(0)

  const subtotal = cart.getTotal()
  const total = subtotal + deliveryFee

  // Função para calcular a distância e o frete usando CEP
  const calculateDelivery = async () => {
    if (!cep || cep.length < 8) return alert('Digite um CEP válido primeiro.')
    setLoadingCep(true)
    
    try {
      // 1. Busca o CEP na ViaCEP (API pública)
      const resCep = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const dataCep = await resCep.json()
      
      if (dataCep.erro) {
        alert('CEP não encontrado.')
        setLoadingCep(false)
        return
      }

      const fullAddress = `${dataCep.logradouro}, ${dataCep.bairro}, ${dataCep.localidade} - ${dataCep.uf}`
      setAddress(fullAddress)

      // 2. Simulação de cálculo de distância (Para produção, use Google Maps API)
      const fakeDistance = Math.floor(Math.random() * 8) + 2 // Entre 2km e 10km
      setDistance(fakeDistance)

      // 3. Calcula o Frete: R$ 3,00 base + R$ 1,50 por km rodado
      const fee = 3.00 + (fakeDistance * 1.50)
      setDeliveryFee(fee)

    } catch (error) {
      alert('Erro ao buscar CEP.')
    } finally {
      setLoadingCep(false)
    }
  }

  const handleCheckout = async () => {
    if (cart.items.length === 0) return
    if (!name || !phone || !address || !distance) return alert('Preencha todos os dados e calcule a entrega.')

    setIsRedirecting(true)

    // Salva no banco de dados (Admin)
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, address, distance, deliveryFee, subtotal, total, payment,
          items: cart.items
        })
      })
    } catch (e) {
      console.log('Erro ao salvar no banco', e)
    }

    // Monta a mensagem do WhatsApp
    let message = `*NOVO PEDIDO*\n\n`
    message += `*Cliente:* ${name}\n`
    message += `*Telefone:* ${phone}\n`
    message += `*Endereço:* ${address}\n`
    message += `*Distância:* Aprox. ${distance} km\n`
    message += `*Pagamento:* ${payment}\n\n`
    
    message += `*ITENS:*\n`
    cart.items.forEach(item => {
      message += `*${item.quantity}x ${item.name}*\n`
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        item.selectedOptions.forEach(opt => {
          message += `   + ${opt.name} (R$ ${opt.price.toFixed(2)})\n`
        })
      }
      message += `   R$ ${((item.price + (item.selectedOptions?.reduce((a, b) => a + b.price, 0) || 0)) * item.quantity).toFixed(2)}\n`
    })

    message += `\n*Subtotal:* R$ ${subtotal.toFixed(2)}\n`
    message += `*Entrega:* R$ ${deliveryFee.toFixed(2)}\n`
    message += `*TOTAL: R$ ${total.toFixed(2)}*`

    const rawPhone = settings?.whatsappNumber || '5511999999999'
    const cleanPhone = rawPhone.replace(/\D/g, '') 
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    
    window.location.href = url
    cart.clearCart()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col animate-in slide-in-from-right-full duration-200">
        
        <div className="p-4 border-b border-[#EFEFF3] flex justify-between items-center">
          <h2 className="font-extrabold text-lg flex items-center gap-2">
            {step === 'cart' ? <><ShoppingBag size={20} /> Sua Sacola</> : <><MapPin size={20} /> Entrega</>}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F6F6F8] rounded-full"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {step === 'cart' ? (
            cart.items.length === 0 ? (
              <div className="text-center py-10 text-[#9A9AA8]">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                <p>Sua sacola está vazia.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item, index) => (
                  <div key={index} className="flex gap-3 bg-white p-3 rounded-2xl border border-[#EFEFF3]">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{item.name}</h3>
                      {item.selectedOptions?.map((opt, i) => (
                        <p key={i} className="text-[11px] text-[#9A9AA8]">+ {opt.name}</p>
                      ))}
                      <p className="font-bold text-sm mt-2" style={{ color: primaryColor }}>
                        R$ {((item.price + (item.selectedOptions?.reduce((a, b) => a + b.price, 0) || 0)) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex items-center gap-2 bg-[#F6F6F8] rounded-lg p-1">
                          <button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm"><Minus size={12} /></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm"><Plus size={12} /></button>
                      </div>
                      <button onClick={() => cart.removeItem(item.id)} className="text-[10px] text-red-500 font-bold hover:underline">Remover</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#5A5A66] uppercase mb-1 block">Seu Nome</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#5A5A66] uppercase mb-1 block">WhatsApp / Telefone</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] outline-none text-sm" placeholder="(11) 99999-9999" />
              </div>
              
              <div className="p-4 bg-[#F6F6F8] rounded-2xl border border-[#EFEFF3]">
                <label className="text-xs font-bold text-[#5A5A66] uppercase mb-1 block">CEP de Entrega</label>
                <div className="flex gap-2">
                  <input type="text" value={cep} onChange={e => setCep(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-[#EFEFF3] outline-none text-sm" placeholder="00000-000" maxLength={9} />
                  <button onClick={calculateDelivery} disabled={loadingCep} className="bg-[#0F0F12] text-white px-4 rounded-xl font-bold text-sm flex items-center">
                    {loadingCep ? <Loader2 className="animate-spin" size={16} /> : 'Calcular'}
                  </button>
                </div>
                {distance && <p className="text-xs text-green-600 font-bold mt-2">✓ Distância: {distance} km</p>}
                {address && <p className="text-xs text-[#5A5A66] mt-1">{address}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-[#5A5A66] uppercase mb-1 block">Pagamento</label>
                <div className="grid grid-cols-3 gap-2">
                  {['PIX', 'Cartão', 'Dinheiro'].map(metodo => (
                    <button key={metodo} onClick={() => setPayment(metodo)} className={`py-2 rounded-xl text-xs font-bold border ${payment === metodo ? 'border-[#FF5A1F] bg-[#FFF1EB] text-[#FF5A1F]' : 'border-[#EFEFF3] text-[#5A5A66]'}`}>
                      {metodo}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="p-4 border-t border-[#EFEFF3] bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-[#5A5A66]"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-[#5A5A66]">
                <span>Taxa de Entrega</span>
                <span>{distance ? `R$ ${deliveryFee.toFixed(2)}` : 'A calcular'}</span>
              </div>
              <div className="flex justify-between font-extrabold text-lg pt-2 border-t border-[#EFEFF3]"><span>Total</span><span>R$ {total.toFixed(2)}</span></div>
            </div>
            
            {step === 'cart' ? (
              <button onClick={() => setStep('checkout')} className="w-full text-white font-bold py-4 rounded-xl" style={{ backgroundColor: primaryColor }}>Continuar</button>
            ) : (
              <button onClick={handleCheckout} disabled={isRedirecting || !distance} className="w-full text-white font-bold py-4 rounded-xl disabled:opacity-50" style={{ backgroundColor: primaryColor }}>
                {isRedirecting ? 'Enviando...' : 'Finalizar Pedido'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}