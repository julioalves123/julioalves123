"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button, Input, Label } from "@/components/ui/button"
import { useAuth } from "@/lib/store"
import { ArrowRight } from "lucide-react"

export default function Cadastro(){
  const [form,setForm]=useState({name:'', email:'', company:'', cnpj:'', phone:''})
  const {register}=useAuth()
  const router=useRouter()
  const handle=(e:React.FormEvent)=>{
    e.preventDefault()
    register(form)
    router.push('/dashboard')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-[560px] bg-white border border-slate-200 rounded-2xl p-8">
        <Link href="/" className="flex items-center gap-2 mb-6"><div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black">F.</div><span className="font-black">FLUXA</span></Link>
        <h1 className="text-2xl font-black tracking-tight">Crie sua conta — teste 14 dias grátis</h1>
        <p className="text-sm text-slate-600 mt-1">Sem cartão. Sem fidelidade. Migração da planilha em 2 minutos.</p>
        <form onSubmit={handle} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Seu nome</Label><Input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Ana Silva"/></div>
            <div><Label>Telefone / WhatsApp</Label><Input required value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="(11) 9 9999-9999"/></div>
          </div>
          <div><Label>Email corporativo</Label><Input required type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="ana@suaempresa.com.br"/></div>
          <div><Label>Empresa</Label><Input required value={form.company} onChange={e=>setForm({...form, company:e.target.value})} placeholder="Distribuidora Boa Vista Ltda"/></div>
          <div><Label>CNPJ</Label><Input required value={form.cnpj} onChange={e=>setForm({...form, cnpj:e.target.value})} placeholder="00.000.000/0001-00"/></div>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-xs text-violet-900">Ao criar a conta você recebe <b>até 500 títulos grátis por 14 dias</b> + onboarding guiado no WhatsApp. Emite NFS-e automaticamente.</div>
          <Button type="submit" className="w-full rounded-full h-11">Criar conta e acessar MVP <ArrowRight className="ml-2 h-4 w-4"/></Button>
        </form>
        <div className="text-sm text-center mt-4 text-slate-600">Já tem conta? <Link href="/login" className="font-bold text-violet-600">Entrar</Link></div>
      </div>
    </div>
  )
}
