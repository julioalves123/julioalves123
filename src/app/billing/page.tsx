"use client"
import { AppShell } from "@/components/AppShell"
import { Card, CardContent, Button, Badge } from "@/components/ui/button"
import { Check, Sparkles, ArrowRight, CreditCard, FileText, Shield } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/store"

export default function Billing(){
  const {user} = useAuth()
  const [plan,setPlan]=useState<'starter'|'growth'|'scale'>( (user?.plan as any) || 'growth')
  const plans: any[] = [
    {id:'starter', nome:'Starter', preco:'R$ 297', limite:'100 títulos/mês', bullets:['Régua 3 etapas','WhatsApp + Email','Pix + boleto','Portal devedor','Dashboard essencial']},
    {id:'growth', nome:'Growth', preco:'R$ 597', limite:'500 títulos/mês', bullets:['Régua completa 7 etapas','WhatsApp Oficial + Voz','Score IA','Conciliação automática','Integrações ilimitadas','4 usuários'], popular:true},
    {id:'scale', nome:'Scale', preco:'R$ 1.297', limite:'2.000 títulos/mês', bullets:['Tudo do Growth','API & Webhooks','Múltiplas empresas','SSO & Audit log','Squad dedicado','Protesto (add-on)']},
  ]

  return (
    <AppShell>
      <div className="flex flex-wrap justify-between gap-4">
        <div><h1 className="text-2xl font-black tracking-tight">Plano & Cobrança</h1><p className="text-sm text-slate-500">Gerencie assinatura, NFS-e e método de pagamento. Sem fidelidade abusiva.</p></div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-2 rounded-full">✓ Assinatura ativa • Próxima cobrança 16/10/2026 • NFS-e automática</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        {plans.map(p=> (
          <Card key={p.id} className={`${plan===p.id?'border-violet-600 border-2 shadow-lg':''} relative overflow-hidden`}>
            {p.popular && <div className="absolute top-0 inset-x-0 h-1 bg-violet-600"/>}
            {p.popular && <div className="absolute top-3 right-3 bg-violet-600 text-white text-[11px] font-black px-2 py-1 rounded-full">MAIS POPULAR</div>}
            <CardContent className="p-6">
              <div className="text-xs font-bold tracking-widest text-slate-500">{p.nome.toUpperCase()}</div>
              <div className="text-2xl font-black mt-1">{p.preco}<span className="text-sm font-normal text-slate-500">/mês</span></div>
              <div className="text-xs text-slate-500">{p.limite}</div>
              <ul className="mt-4 space-y-2">
                {p.bullets.map((b:any)=> <li key={b} className="flex gap-2 text-sm"><Check className="h-4 w-4 text-emerald-600 mt-0.5"/>{b}</li>)}
              </ul>
              {plan===p.id? <Button disabled className="w-full mt-6 rounded-full bg-emerald-600">Plano atual ✓</Button> : <Button variant="outline" className="w-full mt-6 rounded-full" onClick={()=>setPlan(p.id as any)}>Mudar para {p.nome} <ArrowRight className="ml-2 h-4 w-4"/></Button>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card><CardContent className="p-6">
          <div className="font-bold flex items-center gap-2"><CreditCard className="h-4 w-4"/> Método de pagamento</div>
          <div className="mt-4 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <div className="h-10 w-14 rounded bg-slate-900 text-white flex items-center justify-center font-black text-xs">VISA</div>
            <div><div className="font-semibold text-sm">Visa terminando em 4242</div><div className="text-xs text-slate-500">Expira 12/27 • Cobrança recorrente • Nota fiscal no CNPJ</div></div>
            <Button variant="outline" size="sm" className="ml-auto rounded-full">Alterar</Button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 border rounded-xl p-3"><div className="font-bold">Pix também aceito</div><div className="text-slate-600">QR dinâmico mensal • conciliação automática</div></div>
            <div className="bg-slate-50 border rounded-xl p-3"><div className="font-bold">Boleto sob consulta</div><div className="text-slate-600">Para financeiro que exige boleto/CNAB</div></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="font-bold flex items-center gap-2"><FileText className="h-4 w-4"/> Faturas & NFS-e</div>
          <div className="mt-4 space-y-2">
            {[
              {mes:'Set/2026', valor:'R$ 597,00', status:'Paga • NFS-e 1823 emitida'},
              {mes:'Ago/2026', valor:'R$ 597,00', status:'Paga • NFS-e 1712'},
              {mes:'Jul/2026', valor:'R$ 297,00', status:'Paga • Starter'},
            ].map(f=> <div key={f.mes} className="flex justify-between items-center border border-slate-200 rounded-xl px-4 py-3"><div><div className="font-semibold text-sm">{f.mes}</div><div className="text-xs text-slate-500">{f.status}</div></div><div className="text-right"><div className="font-mono font-bold">{f.valor}</div><button className="text-xs text-violet-600 font-bold">Baixar NFS-e →</button></div></div>)}
          </div>
        </CardContent></Card>
      </div>

      <Card className="mt-6 bg-slate-900 text-white"><CardContent className="p-6 flex flex-wrap gap-6 items-center justify-between">
        <div><div className="font-bold flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-400"/> Garantia Fluxa</div><div className="text-sm text-slate-300 mt-1">Se não recuperar o valor da mensalidade em 30 dias, devolvemos 100%. Sem perguntas. <span className="text-white font-bold">ROI ou é grátis.</span></div></div>
        <div className="text-xs bg-white text-slate-900 px-3 py-2 rounded-full font-bold">DPA • LGPD • Criptografia • SSO</div>
      </CardContent></Card>
    </AppShell>
  )
}
