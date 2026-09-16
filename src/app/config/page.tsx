"use client"
import { AppShell } from "@/components/AppShell"
import { Card, CardContent, Button, Input, Label, Textarea } from "@/components/ui/button"
import { Building2, Shield, Bell, Webhook, Lock, Save } from "lucide-react"
import { useAuth } from "@/lib/store"
import { useState } from "react"

export default function Config(){
  const {user} = useAuth()
  const [saved,setSaved]=useState(false)
  const save=()=>{
    setSaved(true); setTimeout(()=>setSaved(false),2000)
  }
  return (
    <AppShell>
      <div><h1 className="text-2xl font-black tracking-tight">Configurações</h1><p className="text-sm text-slate-500">Empresa, notificações, segurança e webhooks. Dados criptografados em repouso.</p></div>

      <div className="grid lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-8 space-y-6">
          <Card><CardContent className="p-6">
            <div className="font-bold flex items-center gap-2"><Building2 className="h-4 w-4"/> Dados da empresa</div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div><Label>Razão Social</Label><Input defaultValue={user?.company || 'Distribuidora Boa Vista Atacado Ltda'}/></div>
              <div><Label>CNPJ</Label><Input defaultValue={user?.cnpj || '34.567.890/0001-12'}/></div>
              <div><Label>Email financeiro</Label><Input defaultValue={user?.email || 'financeiro@boavista.com.br'}/></div>
              <div><Label>Telefone / WhatsApp</Label><Input defaultValue="(47) 9 9123-4567"/></div>
              <div className="md:col-span-2"><Label>Endereço</Label><Input defaultValue="Rua das Indústrias, 1234 — Joinville/SC"/></div>
            </div>
          </CardContent></Card>

          <Card><CardContent className="p-6">
            <div className="font-bold flex items-center gap-2"><Bell className="h-4 w-4"/> Notificações</div>
            <div className="mt-4 space-y-3 text-sm">
              {[
                {t:'Pix recebido', d:'Notificar no WhatsApp e email quando um título for pago'},
                {t:'Risco IA alto', d:'Alerta quando score prevê atraso >80%'},
                {t:'Régua disparada', d:'Resumo diário de mensagens enviadas'},
                {t:'Fatura & NFS-e', d:'Aviso de cobrança e nota fiscal emitida'},
              ].map(i=> <label key={i.t} className="flex gap-3 border border-slate-200 rounded-xl p-3 cursor-pointer hover:bg-slate-50"><input type="checkbox" defaultChecked className="mt-1"/><div><div className="font-semibold">{i.t}</div><div className="text-xs text-slate-500">{i.d}</div></div></label>)}
            </div>
          </CardContent></Card>

          <Card><CardContent className="p-6">
            <div className="font-bold flex items-center gap-2"><Webhook className="h-4 w-4"/> Webhooks</div>
            <div className="mt-4 space-y-3">
              <div><Label>URL de webhook</Label><Input placeholder="https://suaapi.com.br/webhook/fluxa"/></div>
              <div><Label>Eventos</Label><div className="flex flex-wrap gap-2 mt-1 text-xs"><span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-bold">titulo.pago</span><span className="bg-slate-100 px-2 py-1 rounded-full">titulo.vencido</span><span className="bg-slate-100 px-2 py-1 rounded-full">mensagem.entregue</span><span className="bg-slate-100 px-2 py-1 rounded-full">mensagem.lida</span></div></div>
            </div>
          </CardContent></Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card><CardContent className="p-6">
            <div className="font-bold flex items-center gap-2"><Lock className="h-4 w-4"/> Segurança</div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between items-center border rounded-xl px-3 py-2"><span>2FA (TOTP)</span><span className="text-emerald-600 font-bold">Ativo ✓</span></div>
              <div className="flex justify-between items-center border rounded-xl px-3 py-2"><span>SSO (Google / Microsoft)</span><span className="text-slate-500">Opcional</span></div>
              <div className="flex justify-between items-center border rounded-xl px-3 py-2"><span>Sessão expira em</span><span>12h</span></div>
              <Button variant="outline" className="w-full rounded-full">Alterar senha</Button>
            </div>
          </CardContent></Card>
          <Card className="bg-slate-900 text-white"><CardContent className="p-6">
            <div className="font-bold flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-400"/> LGPD & Privacidade</div>
            <div className="text-sm text-slate-300 mt-2">DPA assinado, retenção 5 anos, anonimização sob demanda, logs exportáveis. Hospedagem São Paulo (LGPD). Encarregado: dpo@fluxa.com.br</div>
            <Button variant="outline" className="w-full mt-4 bg-white text-slate-900 rounded-full">Baixar DPA</Button>
          </CardContent></Card>
          <Button onClick={save} className="w-full rounded-full h-11"><Save className="h-4 w-4 mr-2"/>{saved? 'Salvo ✓':'Salvar alterações'}</Button>
        </div>
      </div>
    </AppShell>
  )
}
