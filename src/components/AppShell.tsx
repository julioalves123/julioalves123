"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, Workflow, Plug, Settings, CreditCard, Shield, LogOut, Bell, Search, Sparkles, TrendingUp, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/store"
import { Button } from "@/components/ui/button"

const nav = [
  {href:'/dashboard', label:'Dashboard', icon: LayoutDashboard},
  {href:'/titulos', label:'Títulos', icon: FileText},
  {href:'/clientes', label:'Clientes', icon: Users},
  {href:'/regua', label:'Régua', icon: Workflow},
  {href:'/analytics', label:'Analytics', icon: BarChart3},
  {href:'/integracoes', label:'Integrações', icon: Plug},
  {href:'/billing', label:'Plano & Cobrança', icon: CreditCard},
  {href:'/admin', label:'Admin', icon: Shield},
  {href:'/config', label:'Configurações', icon: Settings},
]

export function AppShell({children}:{children:React.ReactNode}){
  const pathname = usePathname()
  const {user, logout} = useAuth()
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-[264px] bg-slate-900 text-slate-300 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="h-[64px] flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="h-8 w-8 rounded-xl bg-white text-slate-900 flex items-center justify-center font-black">F.</div>
          <div><div className="font-black text-white leading-none">FLUXA</div><div className="text-[11px] tracking-widest text-slate-400">RECEBÍVEIS OS</div></div>
          <span className="ml-auto text-[10px] font-bold bg-violet-600 text-white px-2 py-1 rounded-full">{user?.plan?.toUpperCase()}</span>
        </div>
        <div className="p-3">
          <div className="bg-violet-600 rounded-xl p-3 text-white">
            <div className="text-xs font-bold flex items-center gap-1"><Sparkles className="h-3.5 w-3.5"/> Growth • R$597/mês</div>
            <div className="text-xs text-violet-100 mt-1">342 de 500 títulos • 68%</div>
            <div className="h-1.5 bg-violet-800 rounded-full mt-2"><div className="h-full w-[68%] bg-white rounded-full"/></div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-auto">
          {nav.map(item=>{
            const active = pathname===item.href || pathname?.startsWith(item.href+'/')
            return <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active?'bg-white text-slate-900':'hover:bg-slate-800 text-slate-300 hover:text-white'}`}>
              <item.icon className={`h-4 w-4 ${active?'text-violet-600':''}`}/>{item.label}
            </Link>
          })}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <img src="https://i.pravatar.cc/100?img=5" alt="" className="h-8 w-8 rounded-full"/>
            <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-white truncate">{user?.name || 'Ana Financeiro'}</div><div className="text-xs text-slate-400 truncate">{user?.email}</div></div>
            <button onClick={logout} className="h-8 w-8 rounded-lg hover:bg-slate-800 flex items-center justify-center"><LogOut className="h-4 w-4"/></button>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 px-3">Ambiente: Produção • LGPD ok • 99,5% SLA</div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-[64px] bg-white border-b border-slate-200 flex items-center gap-4 px-4 lg:px-8 sticky top-0 z-30">
          <div className="lg:hidden flex items-center gap-2"><div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm">F.</div><span className="font-black">FLUXA</span></div>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-[560px] bg-slate-100 rounded-xl px-3 h-10">
            <Search className="h-4 w-4 text-slate-500"/><input placeholder="Buscar título, CNPJ ou cliente… (⌘K)" className="bg-transparent outline-none text-sm flex-1 placeholder:text-slate-500"/>
            <span className="text-xs bg-white border px-1.5 py-1 rounded font-mono">/</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full"><span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"/> Sistema operacional • Online</div>
            <button className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center relative"><Bell className="h-4 w-4"/><span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">3</span></button>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
