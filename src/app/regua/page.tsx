"use client"
import { useState } from "react"
import { AppShell } from "@/components/AppShell"
import { Card, CardContent, Button, Input, Textarea, Select } from "@/components/ui/button"
import { reguaMock, EventoRegua } from "@/lib/mockData"
import { MessageCircle, Mail, Phone, Clock, Sparkles, Plus, Eye, BarChart3, ToggleLeft, ToggleRight, Save } from "lucide-react"

const canalIcon:any = {whatsapp: MessageCircle, email: Mail, voz: Phone, sms: Phone}

export default function Regua(){
  const [regua,setRegua]=useState<EventoRegua[]>(reguaMock)
  const [editing,setEditing]=useState<string|null>(null)
  const [form,setForm]=useState({dia:0, canal:'whatsapp', template:''})

  const toggle = (id:string)=> setRegua(prev=> prev.map(r=> r.id===id? {...r, ativo: !r.ativo}:r))
  const startEdit = (r:EventoRegua)=> { setEditing(r.id); setForm({dia:r.dia, canal:r.canal, template:r.template})}
  const saveEdit = ()=> {
    if(!editing) return;
    setRegua(prev=> prev.map(r=> r.id===editing? {...r, dia:form.dia, canal:form.canal as any, template:form.template}:r))
    setEditing(null)
  }

  return (
    <AppShell>
      <div className="flex flex-wrap justify-between gap-4">
        <div><h1 className="text-2xl font-black tracking-tight">Régua de Cobrança • Orquestração</h1><p className="text-sm text-slate-500">7 etapas • D-3 → D+20 • WhatsApp Oficial aprovado • Pausa automática ao pagar</p></div>
        <div className="flex gap-2"><Button variant="outline" className="rounded-full"><Eye className="h-4 w-4 mr-2"/> Preview cliente</Button><Button className="rounded-full"><Save className="h-4 w-4 mr-2"/> Publicar régua</Button></div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-8">
          <Card><CardContent className="p-6">
            <div className="flex items-center justify-between"><div className="font-bold">Linha do tempo</div><div className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">● Ativa e disparando</div></div>
            <div className="mt-6 relative">
              <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-slate-200"/>
              <div className="space-y-4">
                {regua.sort((a,b)=>a.dia-b.dia).map((r)=>{
                  const Icon = canalIcon[r.canal] || MessageCircle
                  const isEditing = editing===r.id
                  return (
                    <div key={r.id} className={`relative flex gap-4 p-4 rounded-2xl border ${r.ativo?'bg-white border-slate-200':'bg-slate-50 border-slate-200 opacity-60'} `}>
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 z-10 ${r.ativo? (r.canal==='whatsapp'?'bg-emerald-500 text-white': r.canal==='email'?'bg-violet-600 text-white':'bg-amber-500 text-white'):'bg-slate-300 text-white'}`}><Icon className="h-4 w-4"/></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs font-black px-2 py-1 rounded-full ${r.dia<0?'bg-slate-900 text-white': r.dia===0?'bg-violet-600 text-white': r.dia<=3?'bg-amber-500 text-white':'bg-red-600 text-white'}`}>{r.dia<0? `D${r.dia}`: r.dia===0?'D0 VENCIMENTO':`D+${r.dia}`}</span>
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{r.canal}</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ml-auto ${r.ativo?'bg-emerald-50 text-emerald-700 border border-emerald-200':'bg-slate-200 text-slate-600'}`}>{r.ativo?'ATIVO':'PAUSADO'}</span>
                          <button onClick={()=>toggle(r.id)} className="ml-2">{r.ativo? <ToggleRight className="h-6 w-6 text-emerald-600"/>:<ToggleLeft className="h-6 w-6 text-slate-400"/>}</button>
                        </div>
                        {isEditing? (
                          <div className="mt-3 space-y-3 bg-slate-50 p-3 rounded-xl">
                            <div className="grid grid-cols-2 gap-3">
                              <div><label className="text-xs font-bold">Dia</label><Input type="number" value={form.dia} onChange={e=>setForm({...form, dia: parseInt(e.target.value)||0})}/></div>
                              <div><label className="text-xs font-bold">Canal</label><Select value={form.canal} onChange={e=>setForm({...form, canal:e.target.value})}><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="voz">Voz</option><option value="sms">SMS</option></Select></div>
                            </div>
                            <div><label className="text-xs font-bold">Template</label><Textarea value={form.template} onChange={e=>setForm({...form, template:e.target.value})}/></div>
                            <div className="flex gap-2 justify-end"><Button variant="outline" size="sm" onClick={()=>setEditing(null)}>Cancelar</Button><Button size="sm" onClick={saveEdit}>Salvar</Button></div>
                          </div>
                        ):(
                          <>
                            <div className="text-sm mt-2 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-3">“{r.template}” <span className="text-xs text-slate-500">• variáveis: {"{nome}"}, {"{valor}"}, {"{link}"}, {"{pix}"}</span></div>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs">
                              <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3 text-violet-600"/> Abertura {r.taxaAbertura}%</span>
                              <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-emerald-600"/> Conversão {r.taxaConversao}%</span>
                              <button onClick={()=>startEdit(r)} className="text-violet-600 font-bold hover:underline">Editar template →</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" className="rounded-full" onClick={()=> setRegua([...regua, {id:'r'+Date.now(), dia:30, canal:'email', template:'Novo lembrete', taxaAbertura:50, taxaConversao:20, ativo:true}])}><Plus className="h-4 w-4 mr-2"/> Adicionar etapa</Button>
              <span className="text-xs text-slate-500 self-center">Dica: máx. 1 mensagem/dia para não spammar. Fluxa respeita janela 08:00–18:00.</span>
            </div>
          </CardContent></Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-violet-600 text-white border-violet-600"><CardContent className="p-6">
            <div className="font-bold flex items-center gap-2"><Sparkles className="h-4 w-4"/> IA • Otimização automática</div>
            <div className="text-sm text-violet-100 mt-2">Fluxa testou 3 variações de D+1 e detectou: <b>mensagem com botão de Pix + parcelamento</b> converte 26% vs 18% sem botão.</div>
            <div className="mt-3 bg-white text-violet-700 rounded-xl p-3 text-xs font-bold">Sugestão: ativar variação vencedora para toda carteira? <Button size="sm" className="ml-2 h-7 bg-slate-900 text-white rounded-full">Aplicar</Button></div>
          </CardContent></Card>

          <Card><CardContent className="p-6">
            <div className="font-bold">Templates setoriais</div>
            <div className="text-xs text-slate-500">Prontos e homologados pela Meta.</div>
            <div className="mt-4 space-y-2">
              {[
                {nome:'Atacado • Tom consultivo', desc:'“Olá {nome}, tudo bem? Passando para lembrar da NF {numero}...”'},
                {nome:'Construção • Formal', desc:'“Prezados, informamos vencimento da medição...”'},
                {nome:'Alimentos • Relação', desc:'“Oi {nome}! Seu pedido {numero} vence amanhã...”'},
              ].map(t=> <div key={t.nome} className="border border-slate-200 rounded-xl p-3"><div className="text-xs font-bold">{t.nome}</div><div className="text-xs text-slate-600 mt-1">{t.desc}</div><button className="text-xs text-violet-600 font-bold mt-1">Usar template →</button></div>)}
            </div>
          </CardContent></Card>

          <Card><CardContent className="p-6">
            <div className="font-bold">Compliance & Boa prática</div>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li className="flex gap-2"><span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-1.5"/> WhatsApp <b>opt-in</b> obrigatório (LGPD). Fluxa registra consentimento.</li>
              <li className="flex gap-2"><span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-1.5"/> <b>Segunda via</b> sempre com Pix + boleto + link — sem anexos bloqueados.</li>
              <li className="flex gap-2"><span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-1.5"/> <b>Freq. máxima</b>: 1 msg/dia. Protesto só após D+20 e aviso.</li>
            </ul>
          </CardContent></Card>
        </div>
      </div>
    </AppShell>
  )
}
