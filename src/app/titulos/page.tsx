"use client"
import { useState, useMemo } from "react"
import { AppShell } from "@/components/AppShell"
import { Card, CardContent, Button, Input, Select } from "@/components/ui/button"
import { titulosMock, clientesMock, Titulo } from "@/lib/mockData"
import { formatBRL } from "@/lib/utils"
import { Plus, Upload, Search, MoreHorizontal, CreditCard, Link2, Mail, MessageCircle, FileText, Filter, Download, Sparkles } from "lucide-react"

export default function Titulos(){
  const [titulos,setTitulos]=useState<Titulo[]>(titulosMock)
  const [q,setQ]=useState("")
  const [status,setStatus]=useState("todos")
  const [showNew,setShowNew]=useState(false)
  const [form,setForm]=useState({clienteId: clientesMock[0].id, numero:'', valor:'', vencimento:''})

  const filtered = useMemo(()=> titulos.filter(t=>{
    const matchQ = !q || t.clienteNome.toLowerCase().includes(q.toLowerCase()) || t.numero.toLowerCase().includes(q.toLowerCase())
    const matchS = status==='todos' || t.status===status
    return matchQ && matchS
  }),[titulos,q,status])

  const handleAdd = (e:React.FormEvent)=>{
    e.preventDefault()
    const cli = clientesMock.find(c=>c.id===form.clienteId)!
    const novo:Titulo={id:'t'+Date.now(), clienteId:cli.id, clienteNome:cli.nome, numero: form.numero || `NF ${Math.floor(4800+Math.random()*100)}`, valor: parseFloat(form.valor)||0, vencimento: form.vencimento || new Date(Date.now()+86400000*5).toISOString().slice(0,10), emissao: new Date().toISOString().slice(0,10), status:'a_vencer', tentativas:0}
    setTitulos([novo, ...titulos])
    setShowNew(false)
    setForm({clienteId: clientesMock[0].id, numero:'', valor:'', vencimento:''})
  }

  const handlePay = (id:string)=> setTitulos(prev=> prev.map(t=> t.id===id? {...t, status:'pago', valorPago:t.valor, dataPagamento:new Date().toISOString().slice(0,10)}:t))
  const handleNegotiate = (id:string)=> setTitulos(prev=> prev.map(t=> t.id===id? {...t, status:'negociado'}:t))
  const importDemo = ()=>{
    const extras:Titulo[]=[
      {id:'tx1', clienteId:'c3', clienteNome:'Construtora Horizonte Sul', numero:'NF 4850', valor: 22100, vencimento:'2026-09-25', emissao:'2026-08-25', status:'a_vencer', tentativas:0},
      {id:'tx2', clienteId:'c2', clienteNome:'Distribuidora Boa Vista Atacado', numero:'NF 4851', valor: 17400, vencimento:'2026-09-11', emissao:'2026-08-11', status:'vencido', tentativas:2, canal:'whatsapp'},
    ]
    setTitulos([...extras, ...titulos])
  }

  const totals = useMemo(()=> ({
    aVencer: filtered.filter(t=>t.status==='a_vencer').reduce((a,b)=>a+b.valor,0),
    vencido: filtered.filter(t=>t.status==='vencido').reduce((a,b)=>a+b.valor,0),
    pago: filtered.filter(t=>t.status==='pago').reduce((a,b)=>a+(b.valorPago||0),0),
  }),[filtered])

  return (
    <AppShell>
      <div className="flex flex-wrap justify-between gap-4 items-start">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Títulos • Carteira</h1>
          <p className="text-sm text-slate-500">{filtered.length} títulos • {formatBRL(totals.vencido)} vencido • {formatBRL(totals.aVencer)} a vencer • Conciliação automática ativa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={importDemo}><Upload className="h-4 w-4 mr-2"/> Importar CSV / NF-e</Button>
          <Button className="rounded-full" onClick={()=>setShowNew(true)}><Plus className="h-4 w-4 mr-2"/> Novo título</Button>
        </div>
      </div>

      {showNew && (
        <Card className="mt-6 border-violet-200"><CardContent className="p-6">
          <div className="font-bold">Novo título</div>
          <form onSubmit={handleAdd} className="grid md:grid-cols-4 gap-4 mt-4">
            <div><label className="text-xs font-bold">Cliente</label><Select value={form.clienteId} onChange={e=>setForm({...form, clienteId:e.target.value})}>{clientesMock.map(c=> <option key={c.id} value={c.id}>{c.nome}</option>)}</Select></div>
            <div><label className="text-xs font-bold">Número</label><Input placeholder="NF 4855" value={form.numero} onChange={e=>setForm({...form, numero:e.target.value})}/></div>
            <div><label className="text-xs font-bold">Valor (R$)</label><Input placeholder="18450" value={form.valor} onChange={e=>setForm({...form, valor:e.target.value})}/></div>
            <div><label className="text-xs font-bold">Vencimento</label><Input type="date" value={form.vencimento} onChange={e=>setForm({...form, vencimento:e.target.value})}/></div>
            <div className="md:col-span-4 flex gap-2 justify-end"><Button type="button" variant="outline" onClick={()=>setShowNew(false)}>Cancelar</Button><Button type="submit" className="rounded-full">Criar e ativar régua</Button></div>
          </form>
        </CardContent></Card>
      )}

      <Card className="mt-6"><CardContent className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 h-10 flex-1 max-w-[420px]"><Search className="h-4 w-4 text-slate-500"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por cliente, NF ou CNPJ..." className="bg-transparent outline-none text-sm flex-1"/></div>
          <Select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="todos">Todos os status</option>
            <option value="a_vencer">A vencer</option>
            <option value="vencido">Vencido</option>
            <option value="pago">Pago</option>
            <option value="negociado">Negociado</option>
            <option value="protestado">Protestado</option>
          </Select>
          <Button variant="outline" size="sm" className="rounded-full"><Filter className="h-4 w-4 mr-1"/> Filtros avançados</Button>
          <Button variant="outline" size="sm" className="rounded-full"><Download className="h-4 w-4 mr-1"/> Exportar</Button>
          <span className="text-xs text-slate-500 ml-auto">{filtered.length} resultados •<span className="text-violet-600 font-bold"> Régua automática ligada</span></span>
        </div>
      </CardContent></Card>

      <Card className="mt-4 overflow-hidden"><CardContent className="p-0">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500"><tr>
              <th className="text-left px-4 py-3">Cliente • Título</th>
              <th className="text-left px-4 py-3">Emissão → Vencimento</th>
              <th className="text-left px-4 py-3">Valor</th>
              <th className="text-left px-4 py-3">Risco IA</th>
              <th className="text-left px-4 py-3">Régua</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Ações</th>
            </tr></thead>
            <tbody>
              {filtered.map(t=>{
                const cli = clientesMock.find(c=>c.id===t.clienteId)
                const overdue = Math.floor((Date.now() - new Date(t.vencimento).getTime())/86400000)
                const risco = cli?.risco || 'medio'
                return <tr key={t.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3"><div className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400"/>{t.numero}<span className="text-slate-400 font-normal">•</span><span className="text-slate-700">{t.clienteNome}</span></div><div className="text-xs text-slate-500">{cli?.cnpj} • {cli?.endereco}</div></td>
                  <td className="px-4 py-3"><div className="font-mono text-xs">{t.emissao} → <span className={`${overdue>0?'text-red-600 font-bold':''}`}>{t.vencimento}</span></div><div className={`text-xs ${overdue>0?'text-red-600 font-semibold': 'text-slate-500'}`}>{overdue>0? `${overdue} dias atraso` : `D${overdue}`}</div></td>
                  <td className="px-4 py-3 font-mono font-bold">{formatBRL(t.valor)}{t.valorPago? <div className="text-xs text-emerald-600">pago {formatBRL(t.valorPago)}</div>:null}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${risco==='alto'?'bg-red-100 text-red-700':risco==='medio'?'bg-amber-100 text-amber-800':'bg-emerald-100 text-emerald-700'}`}>{risco.toUpperCase()} • {cli?.score}%</span></td>
                  <td className="px-4 py-3"><div className="text-xs flex items-center gap-1.5"><MessageCircle className="h-3 w-3"/>{t.tentativas} envios • {t.canal || 'agendado'}</div><div className="h-1.5 w-24 bg-slate-200 rounded-full mt-1"><div className="h-full bg-violet-600 rounded-full" style={{width: `${Math.min(100, t.tentativas*18)}%`}}/></div></td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${t.status==='vencido'?'bg-red-50 text-red-700 border-red-200':t.status==='pago'?'bg-emerald-50 text-emerald-700 border-emerald-200':t.status==='a_vencer'?'bg-slate-50 text-slate-700 border-slate-200': t.status==='negociado'?'bg-amber-50 text-amber-800 border-amber-200':'bg-slate-900 text-white'}`}>{t.status.toUpperCase()}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {t.status!=='pago' && <Button size="sm" className="h-7 rounded-full text-xs px-2" onClick={()=>handlePay(t.id)}><CreditCard className="h-3 w-3 mr-1"/> Pix</Button>}
                      {t.status==='vencido' && <Button size="sm" variant="outline" className="h-7 rounded-full text-xs px-2" onClick={()=>handleNegotiate(t.id)}><Link2 className="h-3 w-3 mr-1"/> Portal</Button>}
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><MoreHorizontal className="h-4 w-4"/></Button>
                    </div>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {filtered.length} títulos • Dados criptografados • Régua ativa para 5 títulos vencidos</span>
          <span className="flex items-center gap-2"><Sparkles className="h-3 w-3 text-violet-600"/> Dica: títulos D-3 recebem lembrete automático amanhã 09:00</span>
        </div>
      </CardContent></Card>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 text-white"><CardContent className="p-5"><div className="font-bold">Portal do devedor</div><div className="text-sm text-slate-300 mt-1">Link mágico por título: cliente escolhe Pix à vista (2% desc) ou 3× sem juros. Sem login, sem fricção.</div><div className="mt-3 bg-white text-slate-900 rounded-xl p-2 font-mono text-xs">fluxa.pay/NF4821-9f3x • QR Pix • Boleto</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="font-bold">Conciliação em tempo real</div><div className="text-sm text-slate-600 mt-1">Extrato via Open Finance. Matching automático por valor + data + CNPJ. Baixa em 3s e envia “obrigado” no WhatsApp.</div><div className="text-xs text-emerald-600 font-bold mt-2">✓ 2 títulos baixados hoje automaticamente</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="font-bold">Importação 2 min</div><div className="text-sm text-slate-600 mt-1">CSV, XLSX, NF-e XML ou integração ERP. Mapeia colunas sozinho e calcula risco.</div><Button variant="outline" className="mt-3 rounded-full w-full"><Upload className="h-4 w-4 mr-2"/> Baixar modelo CSV</Button></CardContent></Card>
      </div>
    </AppShell>
  )
}
