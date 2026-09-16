"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button, Input, Label, Card, CardContent } from "@/components/ui/button"
import { useAuth } from "@/lib/store"
import { ArrowRight, Shield, Zap, Eye, EyeOff } from "lucide-react"

export default function Login(){
  const [email,setEmail]=useState('ana@boavista.com.br')
  const [pass,setPass]=useState('fluxa123')
  const [show,setShow]=useState(false)
  const {login}=useAuth()
  const router=useRouter()
  const handle=(e:React.FormEvent)=>{
    e.preventDefault()
    login(email,pass)
    router.push('/dashboard')
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-between p-8 lg:p-12 bg-white">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white">F.</div>
            <span className="font-black text-xl tracking-tight">FLUXA</span>
            <span className="text-xs bg-violet-600 text-white px-2 py-1 rounded-full font-bold">MVP</span>
          </Link>
        </div>
        <div className="max-w-[420px] mx-auto w-full">
          <h1 className="text-[28px] font-black tracking-tight leading-none">Bem-vinda de volta.</h1>
          <p className="text-slate-600 mt-2 text-sm">Entre para orquestrar seus recebíveis. Teste com qualquer e-mail — <b>demo sem senha real</b>.</p>

          <form onSubmit={handle} className="mt-8 space-y-4">
            <div><Label>Email corporativo</Label><Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="financeiro@suaempresa.com.br" /></div>
            <div><Label>Senha</Label>
              <div className="relative"><Input type={show?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/><button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{show?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div>
              <div className="text-xs text-slate-500 mt-1">Dica: use <b>admin@fluxa.com</b> para ver painel admin, <b>scale@fluxa.com</b> para plano Scale.</div>
            </div>
            <Button type="submit" className="w-full rounded-full h-11 text-base">Entrar no dashboard <ArrowRight className="ml-2 h-4 w-4"/></Button>
            <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t"/></div><div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-500">ou</span></div></div>
            <Button type="button" variant="outline" className="w-full rounded-full" onClick={()=>{login('demo@fluxa.com','demo'); router.push('/dashboard')}}>Entrar com conta demo (1 clique)</Button>
          </form>

          <div className="mt-6 text-sm text-center text-slate-600">Não tem conta? <Link href="/cadastro" className="font-bold text-violet-600 hover:underline">Cadastre-se grátis</Link> • 14 dias sem cartão</div>
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-2 text-xs text-slate-600"><Shield className="h-4 w-4 text-emerald-600 mt-0.5"/><span><b>Segurança:</b> 2FA, AES-256, LGPD, logs auditáveis. Seus dados nunca são compartilhados.</span></div>
        </div>
        <div className="text-xs text-slate-400">© 2026 Fluxa • Suporte: whats (11) 9 9999-9999 • help@fluxa.com.br</div>
      </div>

      <div className="hidden lg:flex bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-indigo-600/20"/>
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-1 text-xs font-bold"><Zap className="h-3.5 w-3.5 text-amber-400"/> Novo: Score IA preditivo</div>
          <h2 className="mt-6 text-[32px] font-black leading-[0.95] tracking-tight">“Saímos de 52% para 84% de recuperação em 21 dias.”</h2>
          <p className="mt-4 text-slate-300">Relato real do piloto — Distribuidora atacadista (SP). R$ 89k recuperados sem uma ligação. Régua rodou sozinha no WhatsApp.</p>
          <div className="mt-8 bg-white text-slate-900 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/100?img=12" alt="" className="h-10 w-10 rounded-full"/>
              <div><div className="font-bold text-sm">Marina Costa</div><div className="text-xs text-slate-500">Diretora Financeira • Boa Vista Atacado</div></div>
              <div className="ml-auto text-amber-500 text-sm">★★★★★</div>
            </div>
            <div className="mt-3 text-sm leading-relaxed">“Antes a planilha vencia e a gente lembrava de cobrar com 10 dias de atraso. Agora a Fluxa cobra no D+1 às 09:12 no WhatsApp com botão de Pix. O cliente paga sozinho.”</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-2"><div className="font-black">R$ 41k</div><div className="text-[11px] text-slate-500">semana 1</div></div>
              <div className="bg-slate-50 rounded-xl p-2"><div className="font-black">84%</div><div className="text-[11px] text-slate-500">D+10</div></div>
              <div className="bg-slate-50 rounded-xl p-2"><div className="font-black">0</div><div className="text-[11px] text-slate-500">ligações</div></div>
            </div>
          </div>
        </div>
        <div className="relative text-xs text-slate-500">Dados criptografados • Hospedado no Brasil (São Paulo) • 99,5% SLA</div>
      </div>
    </div>
  )
}
