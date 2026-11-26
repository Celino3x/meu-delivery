'use client'
import { useState, useRef } from 'react'
import { Save, Upload, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AparenciaClient({ initialData }: { initialData: any }) {
  const [storeName, setStoreName] = useState(initialData?.storeName || 'Minha Loja')
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || '#FF5A1F')
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || '')
  const [whatsappNumber, setWhatsappNumber] = useState(initialData?.whatsappNumber || '')
  const [loading, setLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogoUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeName, primaryColor, logoUrl, whatsappNumber })
    })
    setLoading(false)
    router.refresh()
    alert('Aparência e configurações salvas com sucesso!')
  }

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Aparência</h1>
          <p className="text-sm text-[#5A5A66] mt-1">Personalize a identidade visual da sua loja</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-[#0F0F12] hover:bg-black text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
          Salvar Alterações
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EFEFF3] shadow-sm">
            <h2 className="font-bold text-sm mb-4">Identidade da Loja</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#5A5A66] uppercase tracking-wider mb-2 block">Logo da Loja</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#EFEFF3] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F6F6F8] transition-colors relative overflow-hidden h-32"
                >
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <>
                      <Upload size={24} className="text-[#9A9AA8] mb-2" />
                      <span className="text-sm font-medium text-[#5A5A66]">Clique para fazer upload</span>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5A5A66] uppercase tracking-wider mb-2 block">Nome da Loja</label>
                <input 
                  type="text" 
                  value={storeName} 
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] focus:outline-none text-sm" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5A5A66] uppercase tracking-wider mb-2 block">WhatsApp para Receber Pedidos</label>
                <input 
                  type="text" 
                  value={whatsappNumber} 
                  onChange={e => setWhatsappNumber(e.target.value)}
                  placeholder="Ex: 5511999999999"
                  className="w-full px-4 py-3 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] focus:outline-none text-sm" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EFEFF3] shadow-sm">
            <h2 className="font-bold text-sm mb-4">Cores do Tema</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#5A5A66] uppercase tracking-wider mb-2 block">Cor Principal</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={e => setPrimaryColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0" 
                  />
                  <input 
                    type="text" 
                    value={primaryColor} 
                    onChange={e => setPrimaryColor(e.target.value)}
                    className="flex-1 px-4 rounded-xl border border-[#EFEFF3] font-mono text-sm uppercase" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview em Tempo Real */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFEFF3] shadow-sm sticky top-8 h-fit">
          <h2 className="font-bold text-sm mb-4">Preview em Tempo Real</h2>
          <div className="border border-[#EFEFF3] rounded-xl overflow-hidden">
            <div className="bg-white p-4 flex items-center gap-3 border-b border-[#EFEFF3]">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: primaryColor }}></div>
              )}
              <div className="font-bold text-sm">{storeName || 'Nome da Loja'}</div>
            </div>
            <div className="p-4 bg-[#FAFAFB]">
              <div className="bg-white p-3 rounded-xl border border-[#EFEFF3] flex gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#F6F6F8]"></div>
                <div>
                  <div className="text-xs font-bold">Pizza Calabresa</div>
                  <div className="text-xs font-bold mt-1" style={{ color: primaryColor }}>R$ 45,00</div>
                </div>
              </div>
              <button 
                className="w-full mt-4 text-white text-xs font-bold py-2 rounded-lg transition-colors" 
                style={{ backgroundColor: primaryColor }}
              >
                Finalizar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}