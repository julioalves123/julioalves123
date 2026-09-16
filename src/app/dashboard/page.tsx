"use client"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { useAuth } from "@/lib/store"
import { Card, CardContent, Badge, Button } from "@/components/ui/button"
import { clientesMock, titulosMock } from "@/lib/mockData"
import { formatBRL } from "@/lib/utils"
import { TrendingUp, AlertTriangle, Clock, CreditCard, ArrowUpRight, MoreHorizontal, CheckCircle2, Timer, Wallet, Sparkles, ArrowRight, Download, Filter } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts"

const chartRec = [
  {name:'D-3', manual:0, fluxa:22},
  {name:'D0', manual:18, fluxa:31},
  {name:'D+1', manual:32, fluxa:58},
  {name:'D+7', manual:48, fluxa:74},
  {name:'D+15', manual:52, fluxa:83},
  {name:'D+30', manual:58, fluxa:89},
]
const fluxoPrev = [
  {dia:'10/09', prev:42000, real:38000},
  {dia:'11/09', prev:51000, real:52000},
  {dia:'12/09', prev:48000, real:0},
  {dia:'13/09', prev:62000, real:0},
  {dia:'14/09', prev:55000, real:0},
  {dia:'15/09', prev:71000, real:0},
  {dia:'16/09', prev:68000, real:0},
]
const aging = [
  {name:'A vencer', value: 244080, color:'#7c3aed'},
  {name:'0-10 dias', value: 52300, color:'#f59e0b'},
  {name:'11-30 dias', value: 29800, color:'#ef4444'},
  {name:'30+ dias', value: 16600, color:'#991b1b'},
]

export default function Dashboard(){
  const {user} = useAuth()
  const router = useRouter()
  const [titulos,setTitulos]=useState(titulosMock)
  const [filtro,setFiltro]=useState<'todos'|'vencido'|'a_vencer'>('todos')

  useEffect(()=>{
    if(!user) {const raw=localStorage.getItem('fluxa_user'); if(!raw) router.push('/login')}
  },[user, router])

  const kpis = useMemo(()=>{
    const vencido = titulos.filter(t=>t.status==='vencido').reduce((a,b)=>a+b.valor,0)
    const aVencer = titulos.filter(t=>t.status==='a_vencer').reduce((a,b)=>a+b.valor,0)
    const pago = titulos.filter(t=>t.status==='pago').reduce((a,b)=>a+(b.valorPago||b.valor),0)
    const total = vencido+aVencer
    const taxa = total? Math.round((pago/(pago+vencido))*100) : 83
    return {vencido,aVencer,pago,total,taxa}
  },[titulos])

  const filtered = titulos.filter(t=> filtro==='todos'? true : t.status===filtro).slice(0,6)

  const handlePay = (id:string)=>{
    setTitulos(prev=> prev.map(t=> t.id===id? {...t, status:'pago', valorPago:t.valor, dataPagamento: new Date().toISOString().slice(0,10)} : t))
  }

  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Dashboard • <span className="text-violet-600">Visão Geral</span></h1>
          <p className="text-sm text-slate-500">Bem-vinda, {user?.name || 'Ana'} • {user?.company} • Última atualização há 2 min • <span className="text-emerald-600 font-semibold">● 3 Pix recebidos hoje</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full"><Download className="h-4 w-4 mr-2"/> Exportar</Button>
          <Button className="rounded-full bg-slate-900"><Sparkles className="h-4 w-4 mr-2"/> Pedir previsão IA</Button>
        </div>
      </div>

      {/* KPIS */}
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <Card className="overflow-hidden"><CardContent className="p-5">
          <div className="flex justify-between items-start"><div><div className="text-xs font-bold tracking-widest text-slate-500">A RECEBER (30D)</div><div className="text-2xl font-black mt-1">{formatBRL(kpis.total)}</div><div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3"/> +12,4% vs mês anterior</div></div><div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center"><Wallet className="h-5 w-5 text-white"/></div></div>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-[72%] bg-violet-600 rounded-full"/></div>
        </CardContent></Card>
        <Card className="border-amber-200 bg-amber-50"><CardContent className="p-5">
          <div className="flex justify-between"><div><div className="text-xs font-bold tracking-widest text-amber-700">VENCIDO</div><div className="text-2xl font-black mt-1 text-amber-900">{formatBRL(kpis.vencido)}</div><div className="text-xs text-amber-700 mt-1">5 títulos • PMR 9,2 dias</div></div><div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-white"/></div></div>
        </CardContent></Card>
        <Card className="border-emerald-200 bg-emerald-50"><CardContent className="p-5">
          <div className="flex justify-between"><div><div className="text-xs font-bold tracking-widest text-emerald-700">RECUPERADO (30D)</div><div className="text-2xl font-black mt-1 text-emerald-900">{formatBRL(kpis.pago)}</div><div className="text-xs text-emerald-700 mt-1">Taxa D+10: <b>83%</b> • manual era 48%</div></div><div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-white"/></div></div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="flex justify-between"><div><div className="text-xs font-bold tracking-widest text-slate-500">RISCO IA</div><div className="text-2xl font-black mt-1">3 alertas</div><div className="text-xs text-red-600 font-semibold mt-1">2 com 91% prob. atraso</div></div><div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center"><Sparkles className="h-5 w-5 text-white"/></div></div>
        </CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 mt-6">
        <Card className="lg:col-span-8"><CardContent className="p-6">
          <div className="flex items-center justify-between"><div><div className="font-bold">Curva de recuperação • Manual vs Fluxa</div><div className="text-xs text-slate-500">IGR B2B 1,5M títulos • sua carteira replica o padrão</div></div><Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">+73% D+10</Badge></div>
          <div className="h-[240px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRec}>
                <XAxis dataKey="name" tick={{fontSize:12}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:12}} axisLine={false} tickLine={false} tickFormatter={(v)=>v+'%'}/>
                <Tooltip />
                <Bar dataKey="manual" name="Manual" fill="#cbd5e1" radius={[6,6,0,0]}/>
                <Bar dataKey="fluxa" name="Fluxa" fill="#7c3aed" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-3"><b className="text-violet-700">Janela de ouro D+10</b><div className="text-slate-600 mt-1">Fluxa dispara D-3 (lembrete), D0 e D+1 automático. Manual só lembra no D+7 quando recuperação já caiu 35%.</div></div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3"><b>Por que importa?</b><div className="text-slate-600 mt-1">Cada dia de atraso custa 2,3% de chance de receber. Automação = 43,1M acionamentos digitais em 2024.</div></div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3"><b className="text-emerald-700">Resultado</b><div className="text-slate-600 mt-1">R$ 187k recuperados/mês no piloto. Cliente paga sem constrangimento via portal.</div></div>
          </div>
        </CardContent></Card>

        <div className="lg:col-span-4 space-y-6">
          <Card><CardContent className="p-6">
            <div className="font-bold flex items-center justify-between">Aging <span className="text-xs text-violet-600 font-semibold">Ver detalhes →</span></div>
            <div className="h-[180px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={aging} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                    {aging.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip formatter={(v:any)=>formatBRL(v as number)}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {aging.map(a=> <div key={a.name} className="flex justify-between text-xs"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{background:a.color}}/>{a.name}</span><b>{formatBRL(a.value)}</b></div>)}
            </div>
          </CardContent></Card>

          <Card className="bg-slate-900 text-white"><CardContent className="p-6">
            <div className="font-bold flex items-center gap-2"><Timer className="h-4 w-4 text-amber-400"/> Régua ativa agora</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between bg-white/10 rounded-xl px-3 py-2"><span>D-3 WhatsApp</span><span className="text-emerald-400 font-bold">✓ 78% aberto</span></div>
              <div className="flex justify-between bg-white/10 rounded-xl px-3 py-2"><span>D0 Vencimento</span><span className="text-emerald-400 font-bold">84% entregue</span></div>
              <div className="flex justify-between bg-violet-600 rounded-xl px-3 py-2 font-bold"><span>D+1 Cobrança</span><span>● Disparando agora</span></div>
            </div>
            <Button className="w-full mt-4 bg-white text-slate-900 hover:bg-slate-100 rounded-full">Ver régua completa <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </CardContent></Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 mt-6">
        <Card className="lg:col-span-8"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="font-bold">Títulos críticos • Ação imediata</div>
            <div className="flex gap-2">
              {(['todos','vencido','a_vencer'] as const).map(k=> <button key={k} onClick={()=>setFiltro(k)} className={`text-xs px-3 py-1.5 rounded-full font-bold border ${filtro===k?'bg-slate-900 text-white border-slate-900':'bg-white text-slate-600 border-slate-200'}`}>{k==='todos'?'Todos':k==='vencido'?'Vencidos':'A vencer'}</button>)}
              <Button variant="outline" size="sm" className="rounded-full"><Filter className="h-3 w-3 mr-1"/> Filtros</Button>
            </div>
          </div>
          <div className="mt-4 overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-slate-500 border-b"><th className="text-left py-2 font-semibold">Cliente / Título</th><th className="text-left py-2 font-semibold">Vencimento</th><th className="text-left py-2 font-semibold">Valor</th><th className="text-left py-2 font-semibold">Status</th><th className="text-right py-2 font-semibold">Ação</th></tr></thead>
              <tbody>
                {filtered.map(t=>{
                  const overdue = Math.floor((Date.now() - new Date(t.vencimento).getTime())/86400000)
                  return <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="py-3"><div className="font-semibold">{t.clienteNome}</div><div className="text-xs text-slate-500">{t.numero} • {t.tentativas} tentativas • {t.canal || '—'}</div></td>
                    <td className="py-3"><div className={`${overdue>0?'text-red-600 font-bold':''}`}>{new Date(t.vencimento).toLocaleDateString('pt-BR')} </div><div className={`text-xs ${overdue>0?'text-red-600':'text-slate-500'}`}>{overdue>0? `${overdue} dias atraso` : `vence em ${Math.abs(overdue)} dias`}</div></td>
                    <td className="py-3 font-mono font-bold">{formatBRL(t.valor)}</td>
                    <td className="py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.status==='vencido'?'bg-red-100 text-red-700':t.status==='pago'?'bg-emerald-100 text-emerald-700':t.status==='a_vencer'?'bg-slate-100 text-slate-700':'bg-amber-100 text-amber-800'}`}>{t.status.replace('_',' ').toUpperCase()}</span></td>
                    <td className="py-3 text-right">
                      {t.status==='vencido'? <Button size="sm" className="rounded-full h-8" onClick={()=>handlePay(t.id)}><CreditCard className="h-3 w-3 mr-1"/> Simular Pix</Button> : t.status==='a_vencer'? <span className="text-xs text-slate-500">D-3 agendado</span> : <span className="text-xs text-emerald-600 font-bold">✓ Pago {t.dataPagamento}</span>}
                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-slate-500 mt-3">Mostrando {filtered.length} de {titulos.length} títulos • Régua ativa para vencidos • <a href="/titulos" className="text-violet-600 font-bold">Ver todos →</a></div>
        </CardContent></Card>

        <Card className="lg:col-span-4"><CardContent className="p-6">
          <div className="font-bold">Previsão de caixa • IA</div>
          <div className="text-xs text-slate-500">Próximos 7 dias • modelo com 89% acurácia</div>
          <div className="h-[200px] mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fluxoPrev}>
                <XAxis dataKey="dia" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis hide/>
                <Tooltip formatter={(v:any)=>formatBRL(v)}/>
                <Area type="monotone" dataKey="prev" name="Previsto" stroke="#7c3aed" fill="#ddd6fe" strokeWidth={2}/>
                <Area type="monotone" dataKey="real" name="Realizado" stroke="#10b981" fill="#a7f3d0" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 mt-3">
            <div className="text-xs font-bold text-violet-800 flex items-center gap-1"><Sparkles className="h-3 w-3"/> Insight IA</div>
            <div className="text-xs text-violet-900 mt-1">Semana com <b>R$ 68k previstos</b>. 2 clientes com alto risco podem atrasar R$ 24k — sugerimos mensagem D-3 personalizada hoje às 09:00.</div>
            <Button size="sm" className="mt-2 rounded-full h-7 text-xs">Aplicar sugestão</Button>
          </div>
        </CardContent></Card>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card className="bg-emerald-600 text-white"><CardContent className="p-5 flex justify-between items-center"><div><div className="text-xs font-bold text-emerald-100">Pix recebido hoje</div><div className="text-xl font-black">R$ 32.700</div><div className="text-xs text-emerald-100">NF 4822 • Aurora Alimentos • há 12 min</div></div><CreditCard className="h-8 w-8 text-white/80"/></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-xs font-bold tracking-widest text-slate-500">TOP DEVEDOR</div><div className="font-bold mt-1">Distribuidora Boa Vista</div><div className="text-sm text-slate-600">R$ 33.650 em aberto • Score 44 (alto risco)</div><div className="text-xs text-red-600 font-bold mt-1">● Régua D+7 com voz agendada amanhã 10:00</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-xs font-bold tracking-widest text-slate-500">AUTOMAÇÃO</div><div className="font-bold mt-1">127 mensagens enviadas</div><div className="text-sm text-slate-600">Últimos 7 dias • 71% abertura WhatsApp</div><div className="text-xs text-slate-500 mt-1">Economia: 14h de trabalho manual</div></CardContent></Card>
      </div>
    </AppShell>
  )
}
