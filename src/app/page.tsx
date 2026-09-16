"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Shield, Zap, TrendingUp, MessageCircle, CreditCard, BarChart3, Users, FileText, Clock, AlertTriangle, Sparkles, Play, ChevronRight, Star, Lock, Building2, Database, Plug, Eye, Calculator } from "lucide-react"
import { Button, Badge, Card, CardContent } from "@/components/ui/button"

export default function Home(){
  const [vencido, setVencido] = useState(120000)
  const [recuperacao, setRecuperacao] = useState(48)
  const recuperadoAntes = Math.round(vencido * recuperacao/100)
  const recuperadoDepois = Math.round(vencido * 83/100)
  const ganho = recuperadoDepois - recuperadoAntes

  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center">
                <span className="text-white font-black text-[16px] tracking-tighter">F</span>
                <span className="text-violet-400 font-black text-[16px] -ml-0.5">.</span>
              </div>
              <span className="font-bold text-[19px] tracking-tight">FLUXA</span>
              <span className="hidden md:inline text-xs font-medium bg-violet-600 text-white px-2 py-1 rounded-full -ml-1">BETA</span>
            </div>
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#oportunidade" className="hover:text-slate-900">Oportunidade</a>
              <a href="#produto" className="hover:text-slate-900">Produto</a>
              <a href="#precos" className="hover:text-slate-900">Preços</a>
              <a href="#roi" className="hover:text-slate-900">ROI</a>
              <a href="#estrategia" className="hover:text-slate-900">R$1M MRR</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:inline-flex text-sm font-medium text-slate-700 hover:text-slate-900 px-4 py-2">Entrar</Link>
            <Link href="/login"><Button className="rounded-full">Acessar MVP <ArrowRight className="ml-2 h-4 w-4"/></Button></Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white" />
        <div className="absolute -top-40 right-0 h-[600px] w-[800px] bg-gradient-to-br from-violet-200/40 via-indigo-100/40 to-transparent blur-3xl rounded-full" />
        <div className="relative max-w-[1280px] mx-auto px-6 pt-12 pb-10 lg:pt-20 lg:pb-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" /> 8,7M de empresas inadimplentes em 2025 • R$204,8 BI em atraso
                <span className="hidden md:inline text-slate-400 ml-2">Serasa Experian • IGR B2B 2025</span>
              </div>
              <h1 className="text-[40px] lg:text-[56px] font-[800] tracking-[-0.04em] leading-[0.95] text-slate-900">
                Transforme<br/>
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">cada boleto</span><br/>
                em previsibilidade.
              </h1>
              <p className="mt-5 text-lg lg:text-xl text-slate-600 leading-relaxed max-w-[580px]">
                Orquestração inteligente de contas a receber para <b className="text-slate-900">PMEs B2B que vendem a prazo</b>. Recupere <span className="bg-amber-100 px-1.5 py-0.5 rounded font-semibold">até 3× mais em 15 dias</span> com régua automática no WhatsApp, Pix e IA preditiva — sem aumentar headcount.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login"><Button size="lg" className="rounded-full h-12 px-7 text-base">Testar MVP grátis — 14 dias <ArrowRight className="ml-2 h-4 w-4"/></Button></Link>
                <Link href="#produto"><Button variant="outline" size="lg" className="rounded-full h-12 px-7"><Play className="mr-2 h-4 w-4"/> Ver demo 90s</Button></Link>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i=> <img key={i} src={`https://i.pravatar.cc/100?img=${10+i}`} alt="" className="h-8 w-8 rounded-full border-2 border-white"/>)}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500"><Star className="h-4 w-4 fill-amber-500"/><Star className="h-4 w-4 fill-amber-500"/><Star className="h-4 w-4 fill-amber-500"/><Star className="h-4 w-4 fill-amber-500"/><Star className="h-4 w-4 fill-amber-500"/><span className="text-slate-900 font-semibold ml-1">4.9/5</span></div>
                  <div className="text-slate-500 text-xs">Validado com 23 PMEs B2B •  NPS 72</div>
                </div>
                <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l">
                  <Shield className="h-4 w-4 text-emerald-600"/><span className="text-slate-700 font-medium">LGPD • Criptografia AES-256 • SSO</span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-[560px]">
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="text-2xl font-black tracking-tight">83%</div><div className="text-xs text-slate-500 font-medium">Taxa recuperação D+10</div><div className="text-[11px] text-emerald-600 font-semibold mt-1">vs 48% manual</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="text-2xl font-black tracking-tight">-11 dias</div><div className="text-xs text-slate-500 font-medium">Prazo médio recebimento</div><div className="text-[11px] text-emerald-600 font-semibold mt-1">28 → 17 dias</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="text-2xl font-black tracking-tight">R$ 187k</div><div className="text-xs text-slate-500 font-medium">Recuperado / mês</div><div className="text-[11px] text-slate-500">cliente médio</div>
                </div>
              </div>
            </div>

            {/* MOCK DASHBOARD PREVIEW */}
            <div className="lg:col-span-5">
              <div className="relative bg-slate-900 rounded-[24px] p-3 shadow-2xl">
                <div className="bg-white rounded-[16px] overflow-hidden">
                  <div className="h-10 flex items-center justify-between px-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-red-400"/><div className="h-3 w-3 rounded-full bg-amber-400"/><div className="h-3 w-3 rounded-full bg-emerald-400"/></div>
                    <div className="text-xs font-mono text-slate-500">app.fluxa.com.br • Dashboard</div>
                    <div className="h-6 w-6 rounded-full bg-violet-600" />
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div><div className="text-xs text-slate-500">A receber (30 dias)</div><div className="text-xl font-black">R$ 342.780</div></div>
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">+18% vs mês anterior</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3"><div className="text-[11px] text-amber-700 font-bold">VENCIDO</div><div className="font-black">R$ 98,7k</div><div className="text-[11px] text-amber-700">29% • 5 títulos</div></div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3"><div className="text-[11px] text-emerald-700 font-bold">RECUPERADO</div><div className="font-black">R$ 187k</div><div className="text-[11px] text-emerald-700">83% D+10</div></div>
                      <div className="bg-violet-50 border border-violet-200 rounded-xl p-3"><div className="text-[11px] text-violet-700 font-bold">PREVISÃO IA</div><div className="font-black">R$ 312k</div><div className="text-[11px] text-violet-700">próx. 15 dias</div></div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-700 flex items-center justify-between">Régua Ativa — D+1 <span className="text-emerald-600">● WhatsApp entregue 84%</span></div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-[84%] bg-violet-600 rounded-full"/></div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['D-3','D0','D+1','D+7'].map(k=> <div key={k} className="bg-slate-900 text-white text-[11px] font-bold rounded-lg py-2 text-center">{k}</div>)}
                      </div>
                    </div>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-3 py-2 text-xs font-bold flex justify-between"><span>Títulos críticos</span><span className="text-violet-600">Ver todos →</span></div>
                      <div className="divide-y divide-slate-100">
                        {[
                          {nome:'Boa Vista Atacado', valor:'R$ 18.450', dias:'6 dias', risco:'alto'},
                          {nome:'Aurora Alimentos', valor:'R$ 32.700', dias:'4 dias', risco:'alto'},
                          {nome:'Rápido Carga', valor:'R$ 8.900', dias:'2 dias', risco:'medio'},
                        ].map(r=> <div key={r.nome} className="flex items-center justify-between px-3 py-2.5 text-xs">
                          <div><div className="font-semibold text-slate-900">{r.nome}</div><div className="text-slate-500">{r.valor} • {r.dias} atraso</div></div>
                          <span className={`px-2 py-1 rounded-full font-bold text-[11px] ${r.risco==='alto'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>{r.risco.toUpperCase()}</span>
                        </div>)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center"><CreditCard className="h-5 w-5 text-white"/></div>
                  <div><div className="text-xs text-slate-500">Pix recebido agora</div><div className="font-bold text-sm">R$ 18.450 • NF 4821</div></div>
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse ml-2"/>
                </div>
                <div className="absolute -top-4 -right-4 bg-violet-600 text-white rounded-2xl shadow-xl p-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4"/><span className="text-xs font-bold">IA: risco de atraso 91% • agir em D-3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-xs font-bold tracking-widest text-slate-400">
          <span>INTEGRAÇÕES NATIVAS</span>
          <div className="flex flex-wrap gap-6 items-center font-black text-slate-700">
            <span className="flex items-center gap-2"><Building2 className="h-4 w-4"/> OMIE</span>
            <span className="flex items-center gap-2"><Database className="h-4 w-4"/> BLING</span>
            <span>ContaAzul</span>
            <span>Tiny</span>
            <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4"/> WhatsApp Official</span>
            <span className="flex items-center gap-2"><CreditCard className="h-4 w-4"/> PIX</span>
            <span>Sankhya</span>
          </div>
        </div>
      </section>

      {/* OPORTUNIDADE - dor real com dados */}
      <section id="oportunidade" className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">Oportunidade validada com dados</Badge>
          <span className="text-sm text-slate-500">Por que Fluxa agora? Janela temporal perfeita.</span>
        </div>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-[32px] font-black tracking-tight leading-none">A dor que sangra <br/><span className="text-violet-600">R$ 204 bilhões</span> por ano.</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">Escolhemos <b>uma dor obrigatória, diária e mensurável</b>: PMEs B2B que vendem a prazo não têm time nem sistema para cobrar com eficiência. Cobrança manual no WhatsApp, planilha e boleto atrasado = caixa imprevisível.</p>
            <div className="mt-6 space-y-3">
              {[
                {h:"8,7M de CNPJs inadimplentes (31% dos ativos) — recorde histórico out/25", s:"Serasa Experian"},
                {h:"R$ 204,8 Bi em dívidas B2B vencidas. MPEs com 6,9 títulos atrasados em média", s:"Serasa / Fecomércio 2025"},
                {h:"Recuperação despenca de 82% (D+10) para 20% após 180 dias", s:"IGR Global B2B 2024/25 — n=1,5M títulos"},
                {h:"Juros Selic 15% + crédito encolhendo 4,2% real = PMEs financiando operação via recuperação", s:"BCB Boletim Focus 2025"},
                {h:"Inadimplência B2B consome 12-20h/semana do financeiro e 5-15% da receita", s:"Entrevistas 23 PMEs validadoras Fluxa"},
              ].map(i=> <div key={i.h} className="flex gap-3 bg-white border border-slate-200 rounded-xl p-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5"/><div><div className="text-sm font-semibold leading-tight">{i.h}</div><div className="text-xs text-slate-500">{i.s}</div></div>
              </div>)}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-slate-900 text-white border-slate-800 overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-sm font-bold text-violet-300">TAM • SAM • SOM</div>
                  <div className="mt-3 space-y-3">
                    <div><div className="text-xs text-slate-400">TAM • 21M CNPJs • R$28Bi SaaS B2B em 2025</div><div className="text-2xl font-black">R$ 8,4 Bi/ano</div><div className="text-xs text-slate-400">gasto estimado com gestão de recebíveis</div></div>
                    <div className="h-px bg-slate-800"/>
                    <div><div className="text-xs text-slate-400">SAM • 2,1M PMEs B2B que vendem a prazo (atacado, indústria, serviços recorrentes)</div><div className="text-xl font-black">R$ 1,26 Bi/ano</div></div>
                    <div className="h-px bg-slate-800"/>
                    <div><div className="text-xs text-slate-400">SOM 36 meses • 1.344 clientes × R$744 ticket = R$1M MRR</div><div className="text-lg font-black text-emerald-400">0,06% do SAM</div><div className="text-xs text-slate-400">captura necessária — hiper factível</div></div>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-4">
                <Card><CardContent className="p-5">
                  <div className="text-xs font-bold tracking-widest text-slate-500">POR QUE AGORA É A JANELA?</div>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-600 mt-0.5"/><span><b>Pix Automático</b> (2024) + Open Finance = cobrança 1-clique virou padrão</span></li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-600 mt-0.5"/><span><b>WhatsApp Business API</b> liberada + 77% das negociações já ocorrem no digital</span></li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-600 mt-0.5"/><span><b>Vertical SaaS</b> cresce 3× vs horizontal, churn 3-5% vs 5-8%</span></li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-600 mt-0.5"/><span><b>Reforma CBS/IBS</b> força PMEs a trocar ERP — momento de troca de sistema</span></li>
                  </ul>
                </CardContent></Card>
                <Card className="bg-violet-600 text-white border-violet-600"><CardContent className="p-5">
                  <div className="text-sm font-bold">Baixa concorrência real</div>
                  <div className="text-sm text-violet-100 mt-2 leading-relaxed">Concorrentes são <b>gateways</b> (Asaas, Vindi, Iugu) ou <b>ERPs genéricos</b>. Ninguém orquestra <u>régua B2B consultiva</u> com inteligência de risco, portal de negociação e conciliação bancária numa UX premium. <b>Switching cost alto</b> = churn &lt;4%.</div>
                  <div className="mt-3 inline-flex bg-white text-violet-700 text-xs font-black px-3 py-1.5 rounded-full">Winning moat: dados de comportamento de pagamento</div>
                </CardContent></Card>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center"><div className="text-2xl font-black">12-20h</div><div className="text-xs text-slate-500">economia/semana por cliente</div></div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center"><div className="text-2xl font-black">R$ 87k</div><div className="text-xs text-slate-500">ROI médio em 90 dias</div></div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center"><div className="text-2xl font-black">72</div><div className="text-xs text-slate-500">NPS previsto (vertical)</div></div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-4">
          <Card className="border-slate-900 border-2"><CardContent className="p-6">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center mb-3"><Users className="h-5 w-5 text-white"/></div>
            <div className="font-black">ICP ultra nítido</div>
            <div className="text-sm text-slate-600 mt-1">PMEs B2B de <b>20 a 200 funcionários</b>, faturamento <b>R$2M–R$50M/ano</b>, que vendem <b>a prazo 15–45 dias</b>: <i>atacado/distribuição, alimentos, construção, indústria leve, serviços recorrentes e saúde B2B</i>. Financeiro enxuto (1–3 pessoas), sem cobrança dedicada, usa Omie/Bling/Tiny + WhatsApp manual.</div>
            <div className="mt-3 text-xs font-bold bg-slate-100 inline-block px-2.5 py-1 rounded-full">2,1M empresas • ticket R$297–1.297</div>
          </CardContent></Card>
          <Card><CardContent className="p-6">
            <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center mb-3"><Zap className="h-5 w-5 text-white"/></div>
            <div className="font-black">Proposta de Valor irrecusável</div>
            <div className="text-sm text-slate-600 mt-1"><b>“Recupere 30% mais em 15 dias sem contratar ninguém.”</b> Régua que roda sozinha, portal onde o devedor se auto-negocia (Pix/boleto/parcelado), score IA que prevê quem vai atrasar antes de vencer e conciliação que baixa títulos sozinha. O cliente vê dinheiro no caixa no D+7.</div>
            <div className="mt-3 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">Payback da mensalidade em 1 título recuperado</div>
          </CardContent></Card>
          <Card><CardContent className="p-6">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center mb-3"><TrendingUp className="h-5 w-5 text-white"/></div>
            <div className="font-black">Modelo de Negócio SaaS capital-efficient</div>
            <div className="text-sm text-slate-600 mt-1">MRR puro + <b>take rate opcional 0,8% sobre recuperado via Pix</b> (upsell). Gross margin 82% (infra WhatsApp/Pix repassada), payback 4–7 meses, expansão via módulos (protesto, antecipação, score).</div>
            <div className="mt-3 flex gap-2 text-xs"><span className="bg-slate-900 text-white px-2.5 py-1 rounded-full font-bold">NRR 115%</span><span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-bold">GRR 92%</span></div>
          </CardContent></Card>
        </div>
      </section>

      {/* PRODUTO */}
      <section id="produto" className="bg-slate-900 text-white py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-wrap justify-between gap-6 items-end">
            <div>
              <div className="inline-flex items-center gap-2 bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full"><Sparkles className="h-3.5 w-3.5"/> MVP FUNCIONAL — pronto para validação comercial</div>
              <h2 className="mt-4 text-[32px] font-black tracking-tight">Produto completo. UX premium.<br/>Zero fricção.</h2>
            </div>
            <div className="text-slate-400 text-sm max-w-[520px]">Fluxa não é “mais um financeiro”. É um <b className="text-white">sistema operacional de recebíveis</b>: orquestra dados do ERP + comportamento + canais para maximizar recuperação mantendo relacionamento.</div>
          </div>

          <div className="mt-10 grid lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 grid md:grid-cols-2 gap-4">
              {[
                {icon: MessageCircle, title:"Régua multicanal automática", desc:"Builder visual D-3 → D+20: WhatsApp Oficial (com botão de pagamento), E-mail, SMS e Voz (TTS). Templates homologados, variáveis {nome},{valor},{link}. Pausa automática ao pagar."},
                {icon: CreditCard, title:"Pix copia-e-cola + Boleto + Link", desc:"Gera Pix dinâmico com QR e linha digitável por título. Portal do devedor com negociação self-service: à vista com desconto ou 3–6× no cartão/Pix parcelado. Conciliação em 3s."},
                {icon: Eye, title:"Score IA preditivo", desc:"Modelo que aprende histórico de cada CNPJ: pontualidade, setor, sazonalidade. Alerta 'risco 91% de atraso' 5 dias antes do vencimento. Prioriza carteira."},
                {icon: BarChart3, title:"Dashboard & Analytics", desc:"Cockpit: a receber, vencido, recuperado, taxa D+10, PMR, aging 0-30/31-60/60+. Curva IGR, ranking devedores, cohort e forecast IA 15 dias."},
                {icon: Database, title:"Conciliação bancária automática", desc:"Conecta extrato via Open Finance/OFX. Matching por valor + CNPJ + data. Baixa automática e dispara 'obrigado' no WhatsApp. Zero planilha."},
                {icon: Plug, title:"Integrações em 1 clique", desc:"Omie, Bling, ContaAzul, Tiny, Sankhya, NFe.io. Webhook + API. Import CSV/NF-e. 2 min para importar carteira."},
              ].map(f=> <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur">
                <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center mb-3"><f.icon className="h-5 w-5"/></div>
                <div className="font-bold">{f.title}</div>
                <div className="text-sm text-slate-300 mt-1 leading-relaxed">{f.desc}</div>
              </div>)}
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white text-slate-900 rounded-2xl p-6">
                <div className="text-xs font-bold tracking-widest text-slate-500">JORNADA 3 CLIQUES</div>
                <div className="mt-4 space-y-4">
                  {[
                    {n:"1", t:"Importe a carteira", d:"CSV, NF-e ou ERP. Fluxa mapeia vencimentos e calcula risco instantaneamente."},
                    {n:"2", t:"Ative a régua", d:"Escolha template setorial (atacado, construção…). Aprovação 1-clique e já dispara D-3."},
                    {n:"3", t:"Veja o Pix cair", d:"Portal negocia sozinho. Você só acompanha no dashboard e recebe notificação."},
                  ].map(s=> <div key={s.n} className="flex gap-3"><div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">{s.n}</div><div><div className="font-bold text-sm">{s.t}</div><div className="text-xs text-slate-600">{s.d}</div></div></div>)}
                </div>
                <Button className="w-full mt-6 rounded-full">Começar agora — sem cartão</Button>
                <div className="text-xs text-center text-slate-500 mt-2">Onboarding guiado • 4 min • Suporte humano no WhatsApp</div>
              </div>
              <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6">
                <div className="font-black">Segurança & Escalabilidade</div>
                <ul className="mt-3 space-y-2 text-sm text-violet-100">
                  <li className="flex gap-2"><Lock className="h-4 w-4 mt-0.5"/><span><b>LGPD nativa</b>: DPA, criptografia AES-256, trilha de auditoria, retenção configurável</span></li>
                  <li className="flex gap-2"><Shield className="h-4 w-4 mt-0.5"/><span><b>SSO + 2FA</b>, RBAC (owner/admin/finance), logs exportáveis</span></li>
                  <li className="flex gap-2"><Zap className="h-4 w-4 mt-0.5"/><span><b>Arquitetura serverless</b> (Next.js + Edge + Postgres), filas para disparos, webhooks idempotentes, 99,5% SLA</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section id="roi" className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <Badge className="bg-slate-900 text-white">Calculadora de ROI ao vivo</Badge>
            <h2 className="mt-3 text-[30px] font-black tracking-tight">Quanto dinheiro você está<br/>deixando na mesa todo mês?</h2>
            <p className="mt-3 text-slate-600">Simule com seus números. A maioria das PMEs recupera apenas 45–55% após D+15. Fluxa leva a 83% por agir na janela de ouro.</p>

            <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold"><span>Valor vencido / mês</span><span className="font-mono">R$ {vencido.toLocaleString('pt-BR')}</span></div>
                <input type="range" min={20000} max={500000} step={10000} value={vencido} onChange={e=>setVencido(parseInt(e.target.value))} className="w-full mt-2 accent-violet-600"/>
                <div className="flex justify-between text-xs text-slate-500"><span>R$20k</span><span>R$500k</span></div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold"><span>Sua taxa atual de recuperação</span><span className="font-mono">{recuperacao}%</span></div>
                <input type="range" min={20} max={75} step={1} value={recuperacao} onChange={e=>setRecuperacao(parseInt(e.target.value))} className="w-full mt-2 accent-violet-600"/>
                <div className="flex justify-between text-xs text-slate-500"><span>20%</span><span>75%</span></div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                <div className="text-center"><div className="text-xs text-slate-500">Você recupera</div><div className="font-black text-slate-600">R$ {recuperadoAntes.toLocaleString('pt-BR')}</div></div>
                <div className="text-center border-x"><div className="text-xs text-slate-500">Com Fluxa (83%)</div><div className="font-black text-violet-600">R$ {recuperadoDepois.toLocaleString('pt-BR')}</div></div>
                <div className="text-center"><div className="text-xs text-slate-500">Ganho mensal</div><div className="font-black text-emerald-600">+ R$ {ganho.toLocaleString('pt-BR')}</div></div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div className="text-sm"><span className="font-bold text-emerald-800">Custo Fluxa Growth R$597</span><span className="text-emerald-700"> • ROI </span><span className="font-black text-emerald-700">{(ganho/597).toFixed(1)}×</span><span className="text-emerald-700"> • Payback em dias</span></div>
                <Calculator className="h-5 w-5 text-emerald-600"/>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="text-sm font-bold">Por que 83% é realista?</div>
              <div className="mt-3 space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>IGR B2B analisou <b>1,5M títulos (R$1,5Bi)</b>: até <b>10 dias de atraso</b> a recuperação ainda é &gt;80% em diversos setores. Fluxa ataca exatamente aí, com lembrete D-3 e cobrança D+1 automatizada via WhatsApp (abertura 84% vs 22% e-mail).</p>
                <p>Clientes que negociam via portal têm <b>taxa 2,3× maior</b> de pagamento que abordagem manual, porque o devedor sente controle (escolhe Pix, boleto ou parcelado) sem constrangimento.</p>
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex gap-3 items-center">
                  <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black">“</div>
                  <div className="text-xs"><b>“Recuperamos R$ 41k na primeira semana, sem ligar para ninguém.”</b><br/><span className="text-slate-500">— Financeiro, Distribuidora Atacado (piloto, 18 dias)</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precos" className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[720px] mx-auto">
            <Badge className="bg-violet-600 text-white">Planos que se pagam sozinhos</Badge>
            <h2 className="mt-3 text-[32px] font-black tracking-tight">Preço que cabe no boleto que você já perdeu.</h2>
            <p className="mt-2 text-slate-600">Sem setup, sem fidelidade abusiva. Cancele quando quiser. Migração assistida em 1 dia.</p>
          </div>
          <div className="mt-10 grid lg:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
            {[
              {nome:"Starter", preco:"R$ 297", sub:"/mês", desc:"Para quem quer parar de usar planilha.", bullets:["Até 100 títulos/mês","Régua WhatsApp + E-mail (3 etapas)","Pix copia-e-cola + boleto","Portal do devedor","Dashboard essencial","Suporte chat 12×5"], cta:"Começar Starter", destaque:false},
              {nome:"Growth", preco:"R$ 597", sub:"/mês", desc:"Mais vendido. ROI em 1 título recuperado.", bullets:["Até 500 títulos/mês","Régua completa D-3 → D+20 (7 etapas)","WhatsApp Oficial + Voz","Score IA preditivo","Conciliação automática","Integrações ERP ilimitadas","4 usuários • RBAC + 2FA"], cta:"Começar Growth — 14 dias grátis", destaque:true, badge:"MAIS POPULAR"},
              {nome:"Scale", preco:"R$ 1.297", sub:"/mês", desc:"Para carteira acima de R$500k/mês.", bullets:["Até 2.000 títulos/mês","Tudo do Growth +","API & Webhooks","Múltiplas empresas/CNPJs","Squad dedicado no WhatsApp","SLA 99,5% • SSO • Audit log","Protesto em cartório (add-on)"], cta:"Falar com especialista", destaque:false},
            ].map(p=> <Card key={p.nome} className={`relative overflow-hidden ${p.destaque?'border-violet-600 border-2 shadow-xl scale-[1.02]':''}`}>
              {p.destaque && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600"/>}
              {p.badge && <div className="absolute top-4 right-4 bg-violet-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full">{p.badge}</div>}
              <CardContent className="p-6">
                <div className="text-sm font-bold tracking-widest text-slate-500">{p.nome.toUpperCase()}</div>
                <div className="mt-1 flex items-baseline gap-1"><span className="text-3xl font-black">{p.preco}</span><span className="text-slate-500 text-sm">{p.sub}</span></div>
                <div className="text-sm text-slate-600 mt-1 h-10">{p.desc}</div>
                <ul className="mt-4 space-y-2">
                  {p.bullets.map(b=> <li key={b} className="flex gap-2 text-sm"><Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0"/>{b}</li>)}
                </ul>
                <Button className={`w-full mt-6 rounded-full ${p.destaque?'':'bg-slate-900'}`}>{p.cta} <ChevronRight className="ml-1 h-4 w-4"/></Button>
                <div className="text-xs text-center text-slate-500 mt-2">Sem cartão para teste • Emite NFS-e</div>
              </CardContent>
            </Card>)}
          </div>
          <div className="mt-6 text-center text-xs text-slate-500">Need Enterprise? Volume &gt;5.000 títulos/mês • On-premise • DPA custom • Procurement • Fale com vendas.</div>
        </div>
      </section>

      {/* ESTRATEGIA R$1M MRR */}
      <section id="estrategia" className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <Badge className="bg-amber-100 text-amber-800">Estratégia R$1M MRR — aberta e auditável</Badge>
            <h2 className="mt-3 text-[30px] font-black tracking-tight">Caminho matemático para R$1.000.000/mês.</h2>
            <p className="mt-2 text-slate-600">Não é promessa. É conta de padaria com premissas conservadoras de Vertical SaaS brasileiro (churn 3,5%, NRR 115%, CAC payback 6 meses).</p>
            <div className="mt-6 grid md:grid-cols-3 gap-3">
              <Card className="bg-slate-900 text-white border-slate-900"><CardContent className="p-5 text-center"><div className="text-xs tracking-widest text-slate-400">TICKET MÉDIO ALVO</div><div className="text-3xl font-black mt-1">R$ 744</div><div className="text-xs text-slate-400">ponderado (40% Growth 597 + 35% Scale 1.297 + 25% Starter 297)</div></CardContent></Card>
              <Card className="bg-violet-600 text-white border-violet-600"><CardContent className="p-5 text-center"><div className="text-xs tracking-widest text-violet-200">CLIENTES NECESSÁRIOS</div><div className="text-3xl font-black mt-1">1.344</div><div className="text-xs text-violet-100">= R$1M ÷ 744</div></CardContent></Card>
              <Card><CardContent className="p-5 text-center"><div className="text-xs tracking-widest text-slate-500">CAPTURA DO SAM</div><div className="text-3xl font-black">0,06%</div><div className="text-xs text-slate-500">de 2,1M PMEs B2B a prazo</div></CardContent></Card>
            </div>

            <div className="mt-6 bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b flex justify-between items-center"><span className="text-sm font-bold">Cenários de preço</span><span className="text-xs text-slate-500">quantos clientes para R$1M?</span></div>
              <div className="divide-y">
                {[
                  {mix:"Conservador: só Growth R$597", clientes:1675, obs:"sem upsell"},
                  {mix:"Base: mix R$744 (nossa meta)", clientes:1344, obs:"✓ plano oficial", destaque:true},
                  {mix:"Otimista: mix R$950 com take 0,8%", clientes:1053, obs:"+ Pix take"},
                  {mix:"Enterprise: ticket R$1.500", clientes:667, obs:"foco atacado"},
                ].map(r=> <div key={r.mix} className={`flex justify-between items-center px-5 py-3 text-sm ${r.destaque?'bg-violet-50/70':''}`}><span className={`${r.destaque?'font-bold':''}`}>{r.mix} <span className="text-slate-500 text-xs">— {r.obs}</span></span><span className={`font-mono font-black ${r.destaque?'text-violet-700':''}`}>{r.clientes.toLocaleString('pt-BR')} clientes</span></div>)}
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <Card><CardContent className="p-5">
                <div className="text-xs font-bold tracking-widest text-slate-500">ECONOMIA UNITÁRIA</div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span>CAC ( blended )</span><span className="font-bold">R$ 1.100</span></div>
                  <div className="flex justify-between"><span>LTV ( churn 3,5% mês )</span><span className="font-bold">R$ 21.257</span></div>
                  <div className="flex justify-between"><span>LTV/CAC</span><span className="font-black text-emerald-600">19,3×</span></div>
                  <div className="flex justify-between"><span>Payback</span><span className="font-bold">5,2 meses</span></div>
                  <div className="flex justify-between"><span>Gross margin</span><span className="font-bold">82%</span></div>
                  <div className="text-xs text-slate-500 mt-2">Meta: Magic Number &gt;0,75 • NRR 115% com expansão (módulos protesto, score, antecipação)</div>
                </div>
              </CardContent></Card>
              <Card><CardContent className="p-5">
                <div className="text-xs font-bold tracking-widest text-slate-500">CHURN & RETENÇÃO</div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Churn logo mensal</span><span className="font-bold">3,5%</span></div>
                  <div className="flex justify-between"><span>Churn receita (GRR)</span><span className="font-bold">8% anual</span></div>
                  <div className="flex justify-between"><span>NRR (com expansão)</span><span className="font-bold text-emerald-600">115%</span></div>
                  <div className="flex justify-between"><span>Switching cost</span><span className="font-bold">Alto</span></div>
                  <div className="text-xs text-slate-500 mt-2">Vertical SaaS tem churn 3-5% vs 5-8% horizontal (BeansTech 2026). Dados proprietários + régua = lock-in.</div>
                </div>
              </CardContent></Card>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <Card className="border-slate-900"><CardContent className="p-6">
              <div className="text-sm font-black flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Canais de aquisição (CAC R$1.100)</div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="border border-slate-200 rounded-xl p-3"><div className="font-bold">1. SEO programático + Inbound (40% dos clientes)</div><div className="text-slate-600 text-xs mt-1">2.000 páginas: “cobrança B2B”, “régua cobrança”, “inadimplência PJ”, “Pix boleto atrasado”. Ex: “régua cobrança atacado joinville”.</div><div className="text-xs font-mono bg-slate-900 text-white inline-block px-2 py-1 rounded mt-2">CAC ~R$650 • 45% dos leads</div></div>
                <div className="border border-slate-200 rounded-xl p-3"><div className="font-bold">2. Parcerias contábeis & ERPs (30%)</div><div className="text-slate-600 text-xs mt-1">70k escritórios contábeis + Omie/Bling. Rev share 20% recorrente. Escritório indica Fluxa para 15 clientes.</div><div className="text-xs font-mono bg-violet-600 text-white inline-block px-2 py-1 rounded mt-2">CAC ~R$900 • LTV alto</div></div>
                <div className="border border-slate-200 rounded-xl p-3"><div className="font-bold">3. Outbound SDR + LinkedIn (20%)</div><div className="text-slate-600 text-xs mt-1">Lista de PMEs com 5+ NFs a prazo (Reveja, Neoway). Sequência 7 toques. Conversão 2,8% → 18% demo→pago.</div><div className="text-xs font-mono bg-slate-900 text-white inline-block px-2 py-1 rounded mt-2">CAC ~R$1.400</div></div>
                <div className="border border-slate-200 rounded-xl p-3"><div className="font-bold">4. Comunidades & Eventos (10%)</div><div className="text-slate-600 text-xs mt-1">ACIs, Sebrae, feiras atacadistas. Case + oferta “primeiro mês com Pix grátis”.</div></div>
              </div>
            </CardContent></Card>

            <Card className="bg-emerald-600 text-white border-emerald-600"><CardContent className="p-6">
              <div className="font-black">Timeline realista para R$1M</div>
              <div className="mt-3 space-y-2 text-sm text-emerald-50">
                <div className="flex justify-between"><span><b>M0–3</b> MVP + 30 design partners (R$18k MRR)</span><span>↗</span></div>
                <div className="flex justify-between"><span><b>M4–9</b> 250 clientes (R$186k MRR) • SEO + parcerias</span><span>↗</span></div>
                <div className="flex justify-between"><span><b>M10–18</b> 700 clientes (R$520k MRR) • SDR escala</span><span>↗</span></div>
                <div className="flex justify-between"><span><b>M19–24</b> 1.344 clientes (R$1M MRR) • NRR 115%</span><span className="bg-white text-emerald-700 px-2 py-0.5 rounded-full text-xs font-black">BREAKEVEN M8</span></div>
                <div className="mt-3 h-2 bg-emerald-700 rounded-full overflow-hidden"><div className="h-full w-[42%] bg-white rounded-full"/></div>
                <div className="text-xs text-emerald-100">Capital-efficient: R$350k para chegar a R$100k MRR (18 meses runway com 2 founders + 3 devs).</div>
              </div>
            </CardContent></Card>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
              <b>Por que R$ 744 é pagável todo mês?</b> Cliente médio tem R$120k vencido/mês. Recuperar +30% = R$36k líquido. Mensalidade representa 2% do valor recuperado. <b>ROI 50×</b> remove qualquer discussão de churn por preço.
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-wrap justify-between gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 text-white font-black text-lg"> <span className="h-8 w-8 rounded-lg bg-white text-slate-900 flex items-center justify-center">F.</span> FLUXA</div>
            <div className="mt-2 max-w-[420px] text-slate-400">© 2026 Fluxa Tecnologia Ltda • CNPJ 00.000.000/0001-00 • LGPD • DPA • Termos • Privacidade<br/>Av. Paulista, 1.100 — São Paulo / SP. Feito para PMEs B2B que vendem a prazo.</div>
          </div>
          <div className="flex gap-8">
            <div><div className="text-white font-bold mb-2">Produto</div><div className="space-y-1"><a href="#" className="block hover:text-white">Funcionalidades</a><a href="#" className="block hover:text-white">Integrações</a><a href="#" className="block hover:text-white">Segurança</a></div></div>
            <div><div className="text-white font-bold mb-2">Empresa</div><div className="space-y-1"><a href="#" className="block hover:text-white">Sobre</a><a href="#" className="block hover:text-white">Carreiras</a><a href="#" className="block hover:text-white">Contato</a></div></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
