"use client"
import { useState } from "react"
import { AppShell } from "@/components/AppShell"
import { Card, CardContent, Button, Input, Badge } from "@/components/ui/button"
import { clientesMock, Cliente } from "@/lib/mockData"
import { formatBRL } from "@/lib/utils"
import { Search, Plus, Mail, Phone, Building2, Star, AlertTriangle, TrendingUp, MoreHorizontal } from "lucide-react"

export default function Clientes(){
  const [clientes,setClientes]=useState<Cliente[]>(clientesMock)
  const [q,setQ]=useState("")
  const [showNew,setShowNew]=useState(false)
  const [form,setForm]=useState({nome:'', cnpj:'', email:'', telefone:''})

  const filtered = clientes.filter(c=> !q || c.nome.toLowerCase().includes(q.toLowerCase()) || c.cnpj.includes(q))

  const handleAdd=(e:React.FormEvent)=>{
    e.preventDefault()
    const novo:Cliente={id:'c'+Date.now(), nome:form.nome, cnpj:form.cnpj||'00.000.000/0001-00', email:form.email, telefone:form.telefone, endereco:'São Paulo / SP', score: 65, risco:'medio', totalFaturado:0, tickets:0}
    setClientes([novo,...clientes]); setShowNew(false); setForm({nome:'', cnpj:'', email:'', telefone:''})
  }

  return (
    <AppShell>
      <div className="flex flex-wrap justify-between gap-4">
        <div><h1 className="text-2xl font-black tracking-tight">Clientes • Carteira B2B</h1><p className="text-sm text-slate-500">{filtered.length} clientes • Score IA atualizado diariamente • 3 em risco alto</p></div>
        <Button className="rounded-full" onClick={()=>setShowNew(true)}><Plus className="h-4 w-4 mr-2"/> Novo cliente</Button>
      </div>

      {showNew && <Card className="mt-4 border-violet-200"><CardContent className="p-6">
        <div className="font-bold">Novo cliente PJ</div>
        <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4 mt-4">
          <div><label className="text-xs font-bold">Razão Social</label><Input required value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Ex: Distribuidora Exemplo Ltda"/></div>
          <div><label className="text-xs font-bold">CNPJ</label><Input value={form.cnpj} onChange={e=>setForm({...form,cnpj:e.target.value})} placeholder="00.000.000/0001-00"/></div>
          <div><label className="text-xs font-bold">Email financeiro</label><Input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="financeiro@empresa.com.br"/></div>
          <div><label className="text-xs font-bold">WhatsApp</label><Input value={form.telefone} onChange={e=>setForm({...form,telefone:e.target.value})} placeholder="(11) 9 9999-9999"/></div>
          <div className="md:col-span-2 flex justify-end gap-2"><Button type="button" variant="outline" onClick={()=>setShowNew(false)}>Cancelar</Button><Button type="submit" className="rounded-full">Salvar e calcular score</Button></div>
        </form>
      </CardContent></Card>}

      <Card className="mt-6"><CardContent className="p-4 flex gap-3">
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 h-10 flex-1 max-w-[480px]"><Search className="h-4 w-4 text-slate-500"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nome ou CNPJ..." className="bg-transparent outline-none text-sm flex-1"/></div>
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1"><span className="h-2 w-2 bg-emerald-500 rounded-full"/> Baixo risco: 2</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 bg-amber-500 rounded-full"/> Médio: 3</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 bg-red-500 rounded-full"/> Alto: 3</span>
        </div>
      </CardContent></Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filtered.map(c=> (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">{c.nome.substring(0,2).toUpperCase()}</div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${c.risco==='alto'?'bg-red-100 text-red-700':c.risco==='medio'?'bg-amber-100 text-amber-800':'bg-emerald-100 text-emerald-700'}`}>{c.risco.toUpperCase()} • {c.score}</span>
              </div>
              <div className="font-bold mt-3 leading-tight">{c.nome}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Building2 className="h-3 w-3"/> {c.cnpj} • {c.endereco}</div>
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex items-center gap-2 text-slate-600"><Mail className="h-3 w-3"/> {c.email}</div>
                <div className="flex items-center gap-2 text-slate-600"><Phone className="h-3 w-3"/> {c.telefone}</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl p-2"><div className="text-sm font-black">{formatBRL(c.totalFaturado)}</div><div className="text-[11px] text-slate-500">Faturado</div></div>
                <div className="bg-slate-50 rounded-xl p-2"><div className="text-sm font-black">{c.tickets}</div><div className="text-[11px] text-slate-500">Títulos</div></div>
                <div className="bg-slate-50 rounded-xl p-2"><div className="text-sm font-black flex justify-center gap-0.5">{c.score>80? <><Star className="h-3 w-3 fill-amber-400 text-amber-400"/><Star className="h-3 w-3 fill-amber-400 text-amber-400"/><Star className="h-3 w-3 fill-amber-400 text-amber-400"/></> : c.score>60? <><Star className="h-3 w-3 fill-amber-400 text-amber-400"/><Star className="h-3 w-3 fill-amber-400 text-amber-400"/></> : <><Star className="h-3 w-3 fill-amber-400 text-amber-400"/></>}</div><div className="text-[11px] text-slate-500">Score</div></div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 rounded-full h-8 text-xs">Ver títulos</Button>
                <Button size="sm" className="flex-1 rounded-full h-8 text-xs bg-slate-900">Cobrar agora</Button>
              </div>
              {c.risco==='alto' && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-2 flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0"/> IA: 91% chance atraso próximo vencimento • sugerir D-3 personalizado</div>}
              {c.risco==='baixo' && <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl p-2 flex gap-2"><TrendingUp className="h-4 w-4 shrink-0"/> Cliente exemplar • 98% pontualidade • liberar limite maior</div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}
