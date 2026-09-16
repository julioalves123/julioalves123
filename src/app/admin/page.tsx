"use client"
import { AppShell } from "@/components/AppShell"
import { Card, CardContent, Button, Badge, Input } from "@/components/ui/button"
import { Shield, Users, CreditCard, AlertTriangle, Activity, Settings, Search, MoreHorizontal, Ban, CheckCircle2, TrendingUp } from "lucide-react"
import { useState } from "react"

const usersMock = [
  {nome:'Ana Financeiro', email:'ana@boavista.com.br', role:'owner', status:'ativo', ultimo:'há 2 min'},
  {nome:'Carlos Cobrança', email:'carlos@boavista.com.br', role:'finance', status:'ativo', ultimo:'há 1h'},
  {nome:'Juliana Admin', email:'juliana@boavista.com.br', role:'admin', status:'convite', ultimo:'convidado ontem'},
]

export default function Admin(){
  const [users,setUsers]=useState(usersMock)
  const [invite,setInvite]=useState({nome:'', email:'', role:'finance'})
  const add = (e:React.FormEvent)=>{
    e.preventDefault()
    setUsers([{nome:invite.nome, email:invite.email, role:invite.role, status:'convite', ultimo:'agora'}, ...users])
    setInvite({nome:'', email:'', role:'finance'})
  }
  return (
    <AppShell>
      <div className="flex flex-wrap justify-between gap-4">
        <div><h1 className="text-2xl font-black tracking-tight flex items-center gap-2"><Shield className="h-6 w-6 text-violet-600"/> Painel Administrativo</h1><p className="text-sm text-slate-500">Gestão de usuários, permissões, billing e saúde do sistema. Acesso restrito a owner/admin.</p></div>
        <Badge className="bg-slate-900 text-white h-fit">RBAC • Audit log • SSO</Badge>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <Card><CardContent className="p-5 text-center"><div className="text-xs font-bold tracking-widest text-slate-500">USUÁRIOS</div><div className="text-2xl font-black">3</div><div className="text-xs text-slate-500">2 ativos • 1 convite</div></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="text-xs font-bold tracking-widest text-slate-500">MRR CONTA</div><div className="text-2xl font-black">R$ 597</div><div className="text-xs text-emerald-600 font-bold">Growth • em dia</div></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="text-xs font-bold tracking-widest text-slate-500">TÍTULOS MÊS</div><div className="text-2xl font-black">342 / 500</div><div className="text-xs text-slate-500">68% limite</div></CardContent></Card>
        <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-5 text-center"><div className="text-xs font-bold tracking-widest text-emerald-700">SAÚDE</div><div className="text-2xl font-black text-emerald-700 flex items-center justify-center gap-1"><Activity className="h-5 w-5"/> 99,8%</div><div className="text-xs text-emerald-700">SLA 30 dias</div></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 mt-6">
        <Card className="lg:col-span-8"><CardContent className="p-6">
          <div className="flex items-center justify-between"><div className="font-bold flex items-center gap-2"><Users className="h-4 w-4"/> Usuários & Permissões</div><span className="text-xs text-slate-500">RBAC: owner (tudo), admin (sem billing), finance (só carteira)</span></div>

          <form onSubmit={add} className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 grid md:grid-cols-4 gap-3">
            <Input placeholder="Nome" required value={invite.nome} onChange={e=>setInvite({...invite, nome:e.target.value})}/>
            <Input placeholder="email@empresa.com.br" required type="email" value={invite.email} onChange={e=>setInvite({...invite, email:e.target.value})}/>
            <select value={invite.role} onChange={e=>setInvite({...invite, role:e.target.value})} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="finance">Financeiro</option><option value="admin">Admin</option><option value="owner">Owner</option></select>
            <Button type="submit" className="rounded-full">Convidar</Button>
          </form>

          <div className="mt-4 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 border-b"><tr><th className="text-left py-2">Usuário</th><th className="text-left py-2">Papel</th><th className="text-left py-2">Status</th><th className="text-left py-2">Último acesso</th><th className="text-right py-2">Ação</th></tr></thead>
              <tbody>
                {users.map(u=> <tr key={u.email} className="border-b last:border-0">
                  <td className="py-3"><div className="font-semibold">{u.nome}</div><div className="text-xs text-slate-500">{u.email}</div></td>
                  <td className="py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${u.role==='owner'?'bg-slate-900 text-white':u.role==='admin'?'bg-violet-100 text-violet-700':'bg-slate-100 text-slate-700'}`}>{u.role.toUpperCase()}</span></td>
                  <td className="py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${u.status==='ativo'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-800'}`}>{u.status.toUpperCase()}</span></td>
                  <td className="py-3 text-xs text-slate-500">{u.ultimo}</td>
                  <td className="py-3 text-right flex justify-end gap-1"><Button size="sm" variant="outline" className="h-7 rounded-full text-xs">Editar</Button><Button size="sm" variant="ghost" className="h-7 w-7 p-0"><MoreHorizontal className="h-4 w-4"/></Button></td>
                </tr>)}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs flex gap-2"><AlertTriangle className="h-4 w-4 text-amber-600 shrink-0"/> Convites expiram em 7 dias. Usuários sem 2FA serão bloqueados automaticamente (política LGPD).</div>
        </CardContent></Card>

        <div className="lg:col-span-4 space-y-4">
          <Card><CardContent className="p-6">
            <div className="font-bold">Audit log</div>
            <div className="text-xs text-slate-500">Trilha completa para compliance</div>
            <div className="mt-3 space-y-2 text-xs">
              {[
                {h:'Régua D+1 disparada • 5 títulos', t:'há 8 min • por sistema'},
                {h:'Título NF 4822 marcado como PAGO', t:'há 12 min • conciliação automática'},
                {h:'Usuário carlos@ convidado', t:'ontem • por Ana'},
                {h:'Integração Omie sincronizada', t:'há 2h • 342 títulos'},
              ].map(e=> <div key={e.h} className="border border-slate-200 rounded-xl px-3 py-2"><div className="font-semibold">{e.h}</div><div className="text-slate-500">{e.t}</div></div>)}
            </div>
            <Button variant="outline" className="w-full mt-3 rounded-full text-xs">Exportar CSV (LGPD)</Button>
          </CardContent></Card>
          <Card className="bg-slate-900 text-white"><CardContent className="p-6">
            <div className="font-bold">Billing & Limites</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Plano</span><b>Growth R$597</b></div>
              <div className="flex justify-between"><span>Títulos</span><b>342/500 • 68%</b></div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-[68%] bg-violet-500 rounded-full"/></div>
              <div className="flex justify-between text-xs text-slate-400"><span>Próximo reset 01/10</span><span>Upgrade automático se exceder 110%</span></div>
            </div>
            <Button className="w-full mt-4 bg-white text-slate-900 rounded-full">Gerenciar assinatura</Button>
          </CardContent></Card>
        </div>
      </div>
    </AppShell>
  )
}
