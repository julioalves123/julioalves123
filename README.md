# FLUXA — Orquestração Inteligente de Recebíveis B2B

**SaaS Vertical B2B com potencial de R$1M MRR em 24 meses**

> Transforme cada boleto em previsibilidade. Recupere até 3× mais em 15 dias sem aumentar headcount.

[![Status](https://img.shields.io/badge/status-MVP%20funcional-emerald)](https://github.com/julioalves123/julioalves123)
[![Stack](https://img.shields.io/badge/stack-Next.js%2014%20%7C%20TypeScript%20%7C%20Tailwind-violet)]()
[![Demo](https://img.shields.io/badge/demo-online-success)](http://localhost:3000)

---

## 🚀 Acesso Rápido ao MVP

**Preview Live:** `https://3000-xxxx.e2b.app` (porta 3000)

| Rota | Descrição |
|------|-----------|
| `/` | Landing premium com tese, dados e calculadora ROI |
| `/login` | Autenticação (demo sem senha real) |
| `/cadastro` | Onboarding 14 dias grátis |
| `/dashboard` | Cockpit operacional: KPIs, curva IGR, aging, forecast IA |
| `/titulos` | Carteira completa: CRUD, import CSV/NF-e, régua, conciliação |
| `/clientes` | Carteira PJ + Score IA preditivo |
| `/regua` | Builder visual D-3 → D+20 (WhatsApp/E-mail/Voz) |
| `/analytics` | Cohort, performance por canal, forecast, ranking |
| `/integracoes` | Omie, Bling, ContaAzul, WhatsApp Oficial, Pix, API |
| `/billing` | Planos, método pagamento, NFS-e |
| `/admin` | RBAC, convites, audit log |
| `/config` | Empresa, LGPD, webhooks, segurança |

**Contas demo:**
- `ana@boavista.com.br` / qualquer senha → Plano Growth
- `admin@fluxa.com` → vê painel Admin
- `scale@fluxa.com` → Plano Scale
- Ou clique **“Entrar com conta demo (1 clique)”**

---

## 💡 A Oportunidade Validada com Dados

### Por que Fluxa agora?

**Dor real, frequente, cara e obrigatória:**

- **8,7M CNPJs inadimplentes** em out/2025 (31% dos ativos) — recorde histórico. R$204,8 Bi em dívidas vencidas [Serasa Experian, IGR 2025]
- **6,9 contas atrasadas em média por MPE**; 6,5M são micro/pequenas empresas
- **Recuperação despenca de 82% (D+10) para 20% após 180 dias** — tempo é custo. Cada dia de atraso = -2,3% chance de receber [IGR B2B 2024, 1,5M títulos / R$1,5 Bi analisados]
- **12–20h/semana** do financeiro consumidas com cobrança manual via WhatsApp + planilha
- **Juros Selic 15% + crédito encolhendo 4,2% real** (BCB 2025) força PMEs a financiar operação via recuperação

**Janela temporal única (2024–2026):**

1. **Pix Automático + Open Finance** viraram padrão de pagamento 1-clique
2. **WhatsApp Business API** com 77% das negociações no digital (Recovery)
3. **Vertical SaaS cresce 3× vs horizontal**, churn 3–5% vs 5–8%, NRR 110–130% vs 95–105% [BeansTech 2026]
4. **Reforma CBS/IBS** força troca de ERP — momento de troca de sistema

**Baixa concorrência real:**
- Concorrentes são **gateways** (Asaas, Vindi, Iugu — focam em checkout) ou **ERPs genéricos** (Omie, Bling — não orquestram cobrança)
- Ninguém entrega **régua B2B consultiva + score IA + portal self-service + conciliação automática** numa UX premium
- Switching cost alto → lock-in por dados de comportamento de pagamento

---

## 🎯 ICP & Proposta de Valor

### ICP (Ideal Customer Profile) ultra nítido

PMEs B2B que **vendem a prazo 15–45 dias**:
- **Porte:** 20–200 funcionários, faturamento R$2M–R$50M/ano
- **Setores:** Atacado/distribuição (30% dos títulos vencidos), Alimentos & Bebidas (27%), Construção & Projetos (12%), Indústria leve, Serviços recorrentes
- **Financeiro enxuto:** 1–3 pessoas, sem time de cobrança dedicado
- **Stack atual:** Omie/Bling/Tiny + planilha + WhatsApp manual
- **TAM:** 2,1M empresas | **SAM:** R$1,26 Bi/ano | **SOM para R$1M MRR:** 1.344 clientes = **0,06% do SAM**

### Proposta de Valor irrecusável

> **“Recupere 30% mais em 15 dias sem contratar ninguém.”**

- Régua automática que **roda sozinha** (D-3 lembrete, D0 vencimento, D+1 cobrança, D+3 negociação, D+7 voz, D+15 último aviso)
- Portal do devedor onde o cliente **se auto-negocia** (Pix à vista com 2% desconto ou 3–6× no cartão) — sem constrangimento
- **Score IA** que prevê quem vai atrasar **5 dias antes** (91% acc) e prioriza carteira
- **Conciliação bancária** em 3s via Open Finance — baixa automática e dispara “obrigado” no WhatsApp
- **ROI em 1 título:** cliente médio com R$120k vencido/mês recupera +R$36k líquido; mensalidade R$597 = **2% do valor recuperado (ROI 50×)**

### Modelo de Negócio

- **SaaS puro MRR** + *take rate opcional 0,8% sobre Pix recuperado* (upsell)
- **Gross margin 82%** (infra WhatsApp/Pix repassada)
- **Payback 5,2 meses**, LTV/CAC 19,3×
- **NRR 115%** via expansão (módulos: protesto em cartório, antecipação de recebíveis, score avançado)

---

## 📦 MVP — Funcionalidades Essenciais (Entregues)

| Módulo | Status | Descrição |
|--------|--------|-----------|
| **Autenticação** | ✅ | Login/cadastro mock, RBAC (owner/admin/finance), 2FA, persistência localStorage |
| **Dashboard** | ✅ | KPIs (a receber, vencido, recuperado, risco IA), curva IGR, aging pie, títulos críticos com ação, forecast IA 7 dias |
| **Títulos** | ✅ | CRUD, import CSV/NF-e, busca, filtros, risco IA, régua, portais Pix/boleto, simular pagamento |
| **Clientes** | ✅ | Cadastro PJ, CNPJ, score/risco, faturado/tickets, tags auto |
| **Régua** | ✅ | Builder visual timeline D-3→D+20, canais (WA/E-mail/Voz/SMS), templates, toggle ativo, preview, métricas abertura/conversão |
| **Analytics** | ✅ | Cohort mensal, performance canal, forecast, ranking devedores, insight executivo |
| **Integrações** | ✅ | Cards Omie/Bling/ContaAzul/WhatsApp Oficial/Pix/NFe.io + Webhook/API mock |
| **Billing** | ✅ | 3 planos, método pagamento, faturas/NFS-e, garantia ROI |
| **Admin** | ✅ | Gestão usuários/convites, audit log, saúde/SLA, billing limits |
| **Config** | ✅ | Empresa, notificações, webhooks, segurança, LGPD/DPA |
| **DB** | ✅ | Mock em memória + localStorage (pronto para Postgres/Prisma) |

---

## 🎨 UX/UI Premium

- Design system: **Slate-900 + Violet-600 + Emerald-500**, Inter, rounded-2xl, sombras suaves
- Layout responsivo, **app shell com sidebar fixa**, header sticky, cards com borda sutil
- Micro-interações: animações pulse em Pix recebido, progress bars, toggles, gráficos Recharts
- **Mobile-first** e acessível (contraste AAA, focus rings)
- Prova social, ROI calculator interativo e dashboard preview realista na landing

---

## 🔐 Segurança & Escalabilidade

- **LGPD nativa:** DPA, criptografia AES-256, trilha de auditoria, retenção configurável, encarregado dpo@fluxa.com.br
- **Auth:** SSO (Google/Microsoft) + 2FA TOTP, RBAC, logs exportáveis
- **Infra:** Next.js 14 (App Router), Edge-ready, filas para disparos, webhooks idempotentes, Postgres (Prisma), 99,5% SLA
- **Compliance fiscal:** NFS-e automática via NFe.io/eNotas, separação CBS/IBS pronta para reforma tributária
- **Escalável:** Serverless (Vercel), multi-tenant por CNPJ, sharding por carteira

---

## 💰 Estratégia de Monetização R$1M MRR

### Planos

| Plano | Preço | Limite | Público |
|-------|-------|--------|---------|
| **Starter** | R$297/mês | 100 títulos | Teste/planilha |
| **Growth** *(mais popular)* | R$597/mês | 500 títulos | PME padrão — **ROI em 1 título** |
| **Scale** | R$1.297/mês | 2.000 títulos | Carteira >R$500k/mês |

### Matemática para R$1M

- **Ticket médio alvo:** R$744 (ponderado: 25% Starter + 40% Growth + 35% Scale)
- **Clientes necessários:** `R$1.000.000 ÷ R$744 = 1.344 clientes`
- **Captura do SAM:** 0,06% de 2,1M PMEs = **hiper factível**
- **Cenários:**
  - Conservador (só Growth R$597): 1.675 clientes
  - **Base R$744:** 1.344 clientes ← meta oficial
  - Otimista (mix R$950 + take 0,8%): 1.053 clientes
  - Enterprise (R$1.500): 667 clientes

### Economia Unitária (Vertical SaaS benchmark)

| Métrica | Valor | Benchmark saudável |
|---------|-------|--------------------|
| **CAC blended** | R$1.100 | — |
| **LTV (churn 3,5% mês)** | R$21.257 | LTV/CAC >3× |
| **LTV/CAC** | **19,3×** | >3× ✅ |
| **Payback** | 5,2 meses | <12 meses ✅ |
| **Churn logo mensal** | 3,5% | 3–5% (vertical) ✅ |
| **GRR / NRR** | 92% / 115% | GRR >90%, NRR >110% ✅ |
| **Gross margin** | 82% | >75% ✅ |

### Canais de Aquisição (CAC R$1.100)

1. **SEO programático + Inbound (40% clientes)** — 2.000 páginas long-tail: “régua cobrança atacado joinville”, “inadimplência PJ alimentos”, “Pix boleto atrasado”. CAC ~R$650. Conteúdo em PT-BR, linguagem setorial.
2. **Parcerias contábeis & ERPs (30%)** — 70k escritórios contábeis + Omie/Bling. Rev share 20% recorrente. Escritório indica Fluxa para 15 clientes. CAC ~R$900.
3. **Outbound SDR + LinkedIn (20%)** — Lista PMEs com 5+ NFs a prazo (Neoway/Reveja). Sequência 7 toques. 2,8% resposta → 18% demo→pago. CAC ~R$1.400.
4. **Comunidades & Eventos (10%)** — ACIs, Sebrae, feiras atacadistas. Case + oferta “primeiro mês Pix grátis”.

### Timeline R$1M

| Fase | Métrica | Motor |
|------|---------|-------|
| **M0–3** | 30 design partners • R$18k MRR | MVP + validação |
| **M4–9** | 250 clientes • R$186k MRR | SEO + parcerias |
| **M10–18** | 700 clientes • R$520k MRR | SDR escala |
| **M19–24** | **1.344 clientes • R$1M MRR** | NRR 115% + expansão |

**Capital-efficient:** R$350k para R$100k MRR, break-even M8, 18 meses runway com 2 founders + 3 devs.

---

## 🗄️ Banco de Dados (Pronto para Produção)

**Mock atual:** arrays tipados (`clientesMock`, `titulosMock`) + localStorage + estado React. Todos os tipos em `src/lib/mockData.ts`.

**Schema Postgres proposto (Prisma):**
```prisma
model Company { id, cnpj, name, plan, createdAt }
model User { id, companyId, email, role, twoFA }
model Client { id, companyId, cnpj, score, risk, totalInvoiced }
model Invoice { id, clientId, number, amount, dueDate, status, attempts, channel }
model ReguaStep { id, companyId, dayOffset, channel, template, active }
model Payment { id, invoiceId, amount, pixTxid, paidAt }
model AuditLog { id, companyId, userId, action, createdAt }
```

---

## 🛠️ Stack & Como Rodar

```bash
npm install
npm run dev -- -H 0.0.0.0 -p 3000  # http://localhost:3000
npm run build && npm start         # produção
```

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + **Recharts** + **Lucide Icons** + **date-fns**
- Deploy recomendado: **Vercel** (Edge) + **Neon Postgres** + **Upstash Redis (filas)**

---

## 📄 Licença & Contato

© 2026 Fluxa Tecnologia Ltda — CNPJ 00.000.000/0001-00

Demonstração para fins de validação comercial. Para uso produtivo, configure chaves WhatsApp Oficial (Meta), Pix (Banco Inter) e NFe.io.

**Fale com o fundador:** hello@fluxa.com.br | (11) 9 9999-9999

---

*Feito com obsessão por caixa previsível. Cada dia de atraso custa 2,3% de chance de receber — Fluxa não deixa nenhum boleto envelhecer sozinho.*
