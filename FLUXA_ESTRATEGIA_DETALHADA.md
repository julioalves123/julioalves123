# FLUXA — Dossiê Estratégico R$1M MRR

## 1. Tese de Investimento (1 parágrafo)

Fluxa é um **Vertical SaaS de orquestração de recebíveis B2B** que ataca a dor mais cara e recorrente das PMEs brasileiras que vendem a prazo: **inadimplência sistêmica e caixa imprevisível**. Com 8,7M de CNPJs negativados e R$204,8 Bi em dívidas vencidas (Serasa out/25), e recuperação caindo de 82% para 20% quando a cobrança demora (IGR B2B), Fluxa automatiza a janela de ouro (D-3 a D+15) com régua multicanal (WhatsApp Oficial + Pix + IA), portal de auto-negociação e conciliação bancária. Ticket R$297–1.297, LTV/CAC 19,3×, churn 3,5%, NRR 115% e necessidade de apenas **0,06% do SAM** (1.344 clientes) para R$1M MRR. Moat = dados proprietários de comportamento de pagamento.

---

## 2. Escolha da Oportunidade — Justificativa com Dados

### 2.1 Critérios de Seleção
- Dor **diária, obrigatória, mensurável em R$** (não “nice to have”)
- Mercado **amplo** (milhões) + **disposição a pagar** (ROI visível em dias)
- **Baixa concorrência direta** + switching cost
- **Janela regulatória/tecnológica** que cria urgência
- **Capital-efficient** para bootstrap/seed

### 2.2 Dados Primários Validadores

| Dado | Fonte | Implicação |
|------|-------|------------|
| 8,7M empresas inadimplentes (31% dos ativos) — recorde out/25, R$204,8 Bi | Serasa Experian (out/25) | Dor não é ciclo; é estrutural e crescente |
| 6,9 títulos atrasados por MPE em média; MPEs = 6,5M dos 6,9M inadimplentes | Serasa | Concentração em quem menos tem estrutura para cobrar |
| Recuperação: 82–98% em D+10 → 44% em 61–90 dias → 20% após 180 dias | IGR Global B2B 2024 (1,5M títulos) | **Tempo é dinheiro**: automação no D-3/D+1 é 4× mais eficaz que cobrança manual tardia |
| 52,8% dos inadimplentes são Serviços, 35% Comércio | Fecomércio 2025 | ICP = atacado, alimentos, construção — setores com venda a prazo intrínseca |
| Crédito empresarial -4,2% real (maior queda desde 2017), Selic 15% | BCB Boletim Focus 2025 | Empresas financiam operação via recuperação — dor vira prioridade CFO |
| 43,1M acionamentos digitais de cobrança em 2024 | Global (IGR) | Canal digital já domina; WhatsApp = 77% das negociações (Recovery) |
| Vertical SaaS churn 3–5% vs horizontal 5–8%; NRR 110–130% vs 95–105%; LTV/CAC 4–6× vs 2–3× | BeansTech SaaS B2B Brasil 2026 | Verticalizar = sobrevivência; generalista = commodity |

### 2.3 Por que não outras ideias avaliadas?

| Ideia | Porque descartamos |
|-------|---------------------|
| **Gestão para clínicas/estética** | Mercado saturado (Belasis, Trinks, Simples Agenda a R$39,90), ticket baixo, churn alto, sem dor “pague ou quebre” |
| **Automacão fiscal DCTFWeb/eSocial** | Dor real mas TAM restrito a 70k escritórios; vendas enterprise lentas; legado TOTVS/Domínio com lock-in; reforma tributária traz incerteza |
| **Licitações B2G** | Ticket alto mas ciclo longo, dependência de edital, marketplaces take-rate, expansão limitada |
| **CRM genérico** | Oceano vermelho (RD Station, HubSpot), CAC altíssimo |

**Vencedora: Recebíveis B2B** — única que combina TAM de milhões + dor diária com cronômetro (dias de atraso) + stack tecnológica pronta (Pix, WA) + prova de ROI em horas.

---

## 3. Proposta de Valor & ICP

### 3.1 Proposta de Valor (1 linha + 3 bullets)

**“Recupere 30% mais em 15 dias sem contratar ninguém.”**
- **Automação que preserva relacionamento:** tom consultivo, opt-in LGPD, parcelamento sem constrangimento — cliente paga porque *quer*, não porque foi coagido
- **Dinheiro visível no D+7:** Pix copia-e-cola + QR + boleto no WhatsApp com botão 1-clique; portal negocia sozinho (à vista 2% desc ou 3–6×)
- **Inteligência que prioriza:** score IA por CNPJ (pontualidade, setor, sazonalidade) alerta 5 dias antes; foca esforço onde importa

### 3.2 ICP Quantificado

- **Firma:** Ltda/EPP, 20–200 funcionários, R$2M–R$50M/ano, vende a prazo (15–45 dias) com NF-e/boleto
- **Persona:** Ana, 34, analista/coordenadora financeira, 1–3 pessoas no financeiro, faz cobrança “quando sobra tempo” no WhatsApp pessoal, usa Omie/Bling + planilha, perde 12–20h/semana
- **Trigger:** fechamento mensal com 2+ títulos >5 dias atrasados; diretoria cobra previsibilidade
- **Anti-ICP:** MEI sem venda a prazo, empresa >500 funcionários (já tem cobrança dedicada + ERP SAP)

---

## 4. Produto — MVP Entregue vs Roadmap

### 4.1 O que está no MVP (funcional hoje)

Ver seção “MVP — Funcionalidades Essenciais” no README. 100% navegável, com dados mock realistas de 8 clientes e 14 títulos cobrindo todos os estados (a vencer, vencido, pago, negociado, protestado).

### 4.2 Roadmap 6 meses

- **M1:** Pix Automático (Banco Inter/Stone) + conciliação OFX real + import NF-e XML real + WhatsApp sandbox
- **M2:** Integrações Omie/Bling OAuth + NFe.io NFS-e + DPA assinável + 2FA real
- **M3:** Score IA v1 (modelo logístico com histórico 6 meses) + forecast ARIMA
- **M4:** Protesto em cartório via API (Protesto 24h) + antecipação com parceiro FIDC
- **M5:** App mobile (React Native) para financeiro aprovar negociação em push
- **M6:** Multi-empresa/CNPJ + SSO SAML + audit log S3 imutável

---

## 5. Métricas de Sucesso do MVP (para validação comercial)

| Métrica | Meta 30 dias com 10 design partners |
|---------|--------------------------------------|
| Onboarding <10 min sem ajuda | >80% concluem sozinhos |
| 1º Pix recuperado | <7 dias após ativar régua |
| Taxa D+10 | >75% (vs 48% manual) |
| NPS | >50 |
| Conversão trial→pago | >40% |
| Churn 30 dias | <5% |

Se 7/10 pagarem R$597 após trial, PMF inicial validado e trilha para 250 clientes em 6 meses factível.

---

## 6. Monetização Detalhada

Já descrita no README. Complemento:

- **Expansão NRR:** protesto (R$29/título), antecipação (1,8% fee, split 50% Fluxa), assentos extras (R$49/user), números WA extras (R$99/mês)
- **Assumptions conservadoras:** usamos churn 3,5% (pior caso vertical) e CAC R$1.100 (blended caro). Se CAC cair para R$800 via SEO, LTV/CAC vai a 26,5× e payback a 4 meses.
- **Sensibilidade:** cada R$100 de aumento no ticket reduz 180 clientes necessários (~13%). Foco em migrar 30% da base para Scale no M12 via expansão.

---

## 7. Riscos & Mitigações

| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| Meta muda preço da WABA | Média | Alto | Repasse + uso de E-mail/Voz fallback; templates otimizados reduzem custo por conversão |
| Banco bloqueia Pix de cobrança | Baixa | Alto | Multi-rail (Inter, Stone, Efí) + boleto fallback |
| Cliente recupera e churna (“job done”) | Média | Médio | Virar “sistema operacional” (forecast, score, antecipação) cria uso diário, não pontual |
| Concorrente ERP lança régua nativa | Média | Médio | ERP é generalista; depth B2B + dados de pagamento são moat; parceria > competição |

---

## 8. Go-to-Market 90 Dias (passo a passo)

**Semana 1–2:** lista 150 PMEs atacado/alimentos no Neoway com 5+ NFs a prazo; email+LinkedIn SDR; oferta “diagnóstico gratuito da carteira + 1º mês Pix grátis”
**Semana 3–4:** fechar 10 design partners; onboarding guiado via Meet + WhatsApp; colher métricas D+10
**Semana 5–8:** virar cases (vídeo 60s + R$ recuperado); publicar 50 páginas SEO programáticas; webinar com escritório contábil parceiro
**Semana 9–12:** abrir self-serve; campanha Meta/Google “cobrança B2B” + outbound; meta 50 clientes pagantes

---

## 9. Fontes

- Serasa Experian — Indicador Inadimplência Empresas out/25 (8,7M, R$204,8Bi)
- IGR Global B2B 2024/2025 — 1,5M títulos (citação 82%→20%)
- Fecomércio 2025 — 7M negócios endividados, setor Serviços 52,8%
- BCB Boletim Focus 2025 — PIB 2,1%, Selic 15%, crédito -4,2%
- BeansTech / ABES / Exame — SaaS B2B R$28Bi 2025, 5% PMEs usam SaaS, vertical 3×
- B2BStack / LogikDigital — pagamento SaaS B2B (boleto, NFS-e, Pix)
- Entrevistas 23 PMEs validadoras Fluxa (piloto qualitativo)

---

*Documento vivo. Atualizado em 16/09/2026. Próxima revisão após 30 design partners.*
