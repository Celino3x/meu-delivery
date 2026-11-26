'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('E-mail ou senha incorretos.')
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F6F8]">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#EFEFF3] w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#FF5A1F] text-white flex items-center justify-center font-bold text-xl mb-4">D</div>
          <h1 className="text-xl font-extrabold text-[#0F0F12]">Acesso Restrito</h1>
          <p className="text-sm text-[#5A5A66]">Entre com suas credenciais de admin</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-[#5A5A66] uppercase tracking-wider mb-1 block">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#5A5A66] uppercase tracking-wider mb-1 block">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EFEFF3] focus:border-[#FF5A1F] focus:outline-none text-sm"
              required
            />
          </div>
          <button type="submit" className="mt-4 w-full bg-[#FF5A1F] hover:bg-[#E84A10] text-white font-bold py-3 rounded-xl transition-colors">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}