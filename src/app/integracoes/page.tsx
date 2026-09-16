"use client"
import { AppShell } from "@/components/AppShell"
import { Card, CardContent, Button, Badge } from "@/components/ui/button"
import { Plug, CheckCircle2, AlertCircle, Settings, ExternalLink, Database, MessageCircle, CreditCard, FileText } from "lucide-react"
import { useState } from "react"

const integrations = [
  {nome:'Omie ERP', cat:'ERP', status:'conectado', desc:'Sincroniza clientes, títulos e NF-e a cada 15 min', icon: Database, color:'bg-violet-600'},
  {nome:'Bling', cat:'ERP', status:'conectar', desc:'Importe carteira e baixa automática', icon: Database, color:'bg-slate-900'},
  {nome:'ContaAzul', cat:'ERP', status:'conectar', desc:'Conciliação + emissão NFS-e', icon: Database, color:'bg-slate-900'},
  {nome:'WhatsApp Official', cat:'Canal', status:'conectado', desc:'Número verificado • 84% entrega • Templates aprovados', icon: MessageCircle, color:'bg-emerald-500'},
  {nome:'Pix • Banco Inter', cat:'Pagamento', status:'conectado', desc:'Pix dinâmico + QR + conciliação Open Finance', icon: CreditCard, color:'bg-emerald-600'},
  {nome:'E-mail (SES)', cat:'Canal', status:'conectado', desc:'Domínio autenticado SPF/DKIM • 62% abertura', icon: FileText, color:'bg-violet-600'},
  {nome:'NFe.io • NFS-e', cat:'Fiscal', status:'conectar', desc:'Emissão automática de NFS-e após pagamento', icon: FileText, color:'bg-slate-900'},
  {nome:'Sankhya', cat:'ERP', status:'beta', desc:'Em beta fechado • 12 clientes piloto', icon: Database, color:'bg-amber-500'},
]

export default function Integracoes(){
  const [list,setList]=useState(integrations)
  const toggle = (nome:string)=> setList(prev=> prev.map(i=> i.nome===nome? {...i, status: i.status==='conectado'? 'conectar':'conectado'}:i))
  return (
    <AppShell>
      <div className="flex flex-wrap justify-between gap-4">
        <div><h1 className="text-2xl font-black tracking-tight">Integrações • Ecossistema</h1><p className="text-sm text-slate-500">Conecte seu ERP e canais em 1 clique. Sem código. Webhooks e API para o resto.</p></div>
        <Button className="rounded-full"><Plug className="h-4 w-4 mr-2"/> Documentação API</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {list.map(i=> (
          <Card key={i.nome} className={`${i.status==='conectado'?'border-emerald-200 bg-emerald-50/30':''}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white ${i.color}`}><i.icon className="h-5 w-5"/></div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${i.status==='conectado'?'bg-emerald-500 text-white border-emerald-600': i.status==='beta'?'bg-amber-100 text-amber-800 border-amber-200':'bg-slate-100 text-slate-600 border-slate-200'}`}>{i.status==='conectado'?'● CONECTADO': i.status==='beta'?'BETA':'CONECTAR'}</span>
              </div>
              <div className="font-bold mt-3">{i.nome} <span className="text-xs font-normal text-slate-500">• {i.cat}</span></div>
              <div className="text-xs text-slate-600 mt-1 min-h-[36px]">{i.desc}</div>
              <div className="mt-4 flex gap-2">
                {i.status==='conectado'? <>
                  <Button size="sm" variant="outline" className="flex-1 rounded-full text-xs"><Settings className="h-3 w-3 mr-1"/> Configurar</Button>
                  <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={()=>toggle(i.nome)}>Desconectar</Button>
                </>: <Button size="sm" className="flex-1 rounded-full text-xs bg-slate-900" onClick={()=>toggle(i.nome)}><Plug className="h-3 w-3 mr-1"/> Conectar em 1 clique</Button>}
                <Button size="sm" variant="ghost" className="px-2"><ExternalLink className="h-4 w-4"/></Button>
              </div>
              {i.status==='conectado' && <div className="mt-3 text-xs text-emerald-700 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Sincronizado há 8 min • 342 títulos</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card><CardContent className="p-6">
          <div className="font-bold">Webhook & API</div>
          <div className="text-sm text-slate-600 mt-1">Receba eventos: titulo.vencido, titulo.pago, mensagem.entregue. Idempotência + retry.</div>
          <div className="mt-4 bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-auto">
            <div className="text-slate-400">// POST https://api.fluxa.com.br/v1/webhooks</div>
            <div>{"{"}</div>
            <div>&nbsp;&nbsp;"event": "titulo.pago",</div>
            <div>&nbsp;&nbsp;"data": {"{"} "id": "t1", "valor": 18450, "pix_txid": "abc..." {"}"}</div>
            <div>{"}"}</div>
          </div>
          <Button variant="outline" className="mt-4 rounded-full w-full">Gerar API Key</Button>
        </CardContent></Card>
        <Card className="bg-slate-900 text-white"><CardContent className="p-6">
          <div className="font-bold">Como funciona a sincronização?</div>
          <ol className="mt-3 space-y-2 text-sm text-slate-300 list-decimal list-inside">
            <li>Conecte o ERP → Fluxa importa clientes + títulos + NF-e (2 min).</li>
            <li>Régua dispara sozinha via WhatsApp/E-mail com Pix.</li>
            <li>Cliente paga → Pix confirma → Fluxa concilia e baixa no ERP.</li>
            <li>Dashboard atualiza e pausa régua automaticamente.</li>
          </ol>
          <div className="mt-4 bg-white/10 rounded-xl p-3 text-xs">Suporte a <b>Omie, Bling, Tiny, ContaAzul, Sankhya</b> + CSV/NF-e. Time de implantação faz tudo por você no onboarding.</div>
        </CardContent></Card>
      </div>
    </AppShell>
  )
}
