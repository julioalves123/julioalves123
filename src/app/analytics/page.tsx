"use client"
import { AppShell } from "@/components/AppShell"
import { Card, CardContent, Badge } from "@/components/ui/button"
import { formatBRL } from "@/lib/utils"
import { TrendingUp, AlertTriangle, Clock, Sparkles } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const cohort = [
  {mes:'Mai', taxa:68},
  {mes:'Jun', taxa:71},
  {mes:'Jul', taxa:78},
  {mes:'Ago', taxa:83},
  {mes:'Set', taxa:84},
]
const canalPerf = [
  {canal:'WhatsApp', abertura:71, conv:26},
  {canal:'E-mail', abertura:62, conv:18},
  {canal:'Voz', abertura:45, conv:33},
  {canal:'SMS', abertura:38, conv:12},
]
const forecast = [
  {semana:'S1 Set', previsto: 187000, realizado:187000},
  {semana:'S2 Set', previsto: 212000, realizado:198000},
  {semana:'S3 Set', previsto: 245000, realizado:0},
  {semana:'S4 Set', previsto: 198000, realizado:0},
]

export default function Analytics(){
  return (
    <AppShell>
      <div className="flex flex-wrap justify-between gap-4">
        <div><h1 className="text-2xl font-black tracking-tight">Analytics • Inteligência</h1><p className="text-sm text-slate-500">Cohort, funil, previsão IA e ranking. Dados que viram ação.</p></div>
        <Badge className="bg-violet-600 text-white h-fit">IA acurácia 89% • atualizado há 5 min</Badge>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <Card><CardContent className="p-5 text-center"><div className="text-xs tracking-widest text-slate-500 font-bold">NRR (12M)</div><div className="text-2xl font-black text-emerald-600">115%</div><div className="text-xs text-slate-500">Expansão &gt; churn</div></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="text-xs tracking-widest text-slate-500 font-bold">PMR</div><div className="text-2xl font-black">17 dias</div><div className="text-xs text-emerald-600 font-semibold">-11 vs manual (28)</div></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="text-xs tracking-widest text-slate-500 font-bold">TAXA RECUPERAÇÃO D+10</div><div className="text-2xl font-black">83%</div><div className="text-xs text-slate-500">Meta 80% • IGR benchmark</div></CardContent></Card>
        <Card className="bg-slate-900 text-white"><CardContent className="p-5 text-center"><div className="text-xs tracking-widest text-slate-400 font-bold">INADIMPLÊNCIA</div><div className="text-2xl font-black">12,4%</div><div className="text-xs text-amber-400">↓ de 18,7% antes Fluxa</div></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card><CardContent className="p-6">
          <div className="font-bold">Cohort • Taxa recuperação por mês de entrada</div>
          <div className="text-xs text-slate-500">Melhoria contínua com IA + ajustes de régua</div>
          <div className="h-[240px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cohort}>
                <XAxis dataKey="mes" tick={{fontSize:12}} axisLine={false} tickLine={false}/>
                <YAxis domain={[60,90]} tick={{fontSize:12}} axisLine={false} tickLine={false} tickFormatter={(v)=>v+'%'}/>
                <Tooltip/>
                <Line type="monotone" dataKey="taxa" stroke="#7c3aed" strokeWidth={3} dot={{r:5, fill:'#7c3aed'}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-xs">Crescimento de 68% → 84% em 5 meses após ativar WhatsApp Oficial + Score IA. Cada ponto = R$3,2k/mês recuperado extra.</div>
        </CardContent></Card>

        <Card><CardContent className="p-6">
          <div className="font-bold">Performance por canal</div>
          <div className="text-xs text-slate-500">Abertura vs conversão • últimos 30 dias</div>
          <div className="h-[240px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={canalPerf}>
                <XAxis dataKey="canal" tick={{fontSize:12}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:12}} axisLine={false} tickLine={false}/>
                <Tooltip/>
                <Bar dataKey="abertura" name="Abertura %" fill="#cbd5e1" radius={[6,6,0,0]}/>
                <Bar dataKey="conv" name="Conversão %" fill="#7c3aed" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-600">WhatsApp lidera abertura (71%). Voz tem menor volume mas maior conversão (33%) para D+7 — ideal para títulos &gt;R$20k.</div>
        </CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 mt-6">
        <Card className="lg:col-span-8"><CardContent className="p-6">
          <div className="font-bold">Forecast • Previsão de recebimentos</div>
          <div className="text-xs text-slate-500">Modelo IA usa histórico + sazonalidade + comportamento CNPJ</div>
          <div className="h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast}>
                <XAxis dataKey="semana" tick={{fontSize:12}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={(v)=> (v/1000)+'k'} tick={{fontSize:12}} axisLine={false} tickLine={false}/>
                <Tooltip formatter={(v:any)=>formatBRL(v)}/>
                <Line type="monotone" dataKey="previsto" name="Previsto" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6 3"/>
                <Line type="monotone" dataKey="realizado" name="Realizado" stroke="#10b981" strokeWidth={3}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 border rounded-xl p-3"><b>S3 Set prevista: R$245k</b><div className="text-slate-600">68% já garantido por títulos a vencer com baixo risco.</div></div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3"><b>Risco: R$24k</b><div className="text-amber-800">2 clientes alto risco podem atrasar. Ação D-3 hoje evita.</div></div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3"><b>Oportunidade: antecipação</b><div className="text-emerald-800">R$67k com score &gt;85 elegíveis para antecipar 1,8% fee.</div></div>
          </div>
        </CardContent></Card>
        <div className="lg:col-span-4 space-y-4">
          <Card><CardContent className="p-6">
            <div className="font-bold">Ranking devedores</div>
            <div className="mt-3 space-y-2">
              {[
                {nome:'Boa Vista', valor:33650, risco:44},
                {nome:'Aurora Alimentos', valor:32700, risco:38},
                {nome:'Rápido Carga', valor:24500, risco:29},
                {nome:'Papéis Nordeste', valor:12750, risco:55},
              ].map(r=> <div key={r.nome} className="flex justify-between items-center border border-slate-200 rounded-xl px-3 py-2"><div><div className="font-semibold text-sm">{r.nome}</div><div className="text-xs text-slate-500">{formatBRL(r.valor)} • score {r.risco}</div></div><span className={`text-xs font-black px-2 py-1 rounded-full ${r.risco<50?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>{r.risco<50?'ALTO':'MÉDIO'}</span></div>)}
            </div>
          </CardContent></Card>
          <Card className="bg-slate-900 text-white"><CardContent className="p-6">
            <div className="font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-violet-400"/> Insight executivo</div>
            <div className="text-sm text-slate-300 mt-2">Seus <b>3 maiores devedores</b> concentram 62% do vencido. Focar régua D+7 com ligação humanizada neles recupera R$18k extras em 10 dias.</div>
          </CardContent></Card>
        </div>
      </div>
    </AppShell>
  )
}
