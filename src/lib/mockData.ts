export type Cliente = {
  id:string; nome:string; cnpj:string; email:string; telefone:string; endereco:string;
  score:number; risco:'baixo'|'medio'|'alto'; totalFaturado:number; tickets:number;
}
export type Titulo = {
  id:string; clienteId:string; clienteNome:string; numero:string; valor:number; vencimento:string; emissao:string;
  status:'a_vencer'|'vencido'|'pago'|'negociado'|'protestado'; canal?:string; tentativas:number; valorPago?:number; dataPagamento?:string;
}
export type EventoRegua = {
  id:string; dia:number; canal:'whatsapp'|'email'|'sms'|'voz'; template:string; taxaAbertura:number; taxaConversao:number; ativo:boolean;
}
export const clientesMock: Cliente[] = [
  {id:'c1', nome:'Metalúrgica Santa Clara Ltda', cnpj:'12.345.678/0001-90', email:'financeiro@santaclara.ind.br', telefone:'(11) 9 8765-4321', endereco:'São Paulo / SP', score:82, risco:'baixo', totalFaturado:187400, tickets:23},
  {id:'c2', nome:'Distribuidora Boa Vista Atacado', cnpj:'34.567.890/0001-12', email:'contas@boavista.com.br', telefone:'(47) 9 9123-4567', endereco:'Joinville / SC', score:44, risco:'alto', totalFaturado:92300, tickets:12},
  {id:'c3', nome:'Construtora Horizonte Sul', cnpj:'56.789.012/0001-34', email:'financeiro@horizontesul.com.br', telefone:'(51) 9 9988-7766', endereco:'Porto Alegre / RS', score:61, risco:'medio', totalFaturado:312000, tickets:31},
  {id:'c4', nome:'Alimentos Aurora S/A', cnpj:'78.901.234/0001-56', email:'cob@auroraalimentos.com.br', telefone:'(19) 9 8877-6655', endereco:'Campinas / SP', score:38, risco:'alto', totalFaturado:145600, tickets:18},
  {id:'c5', nome:'TechParts Componentes Ltda', cnpj:'90.123.456/0001-78', email:'adm@techparts.com.br', telefone:'(41) 9 9645-3321', endereco:'Curitiba / PR', score:91, risco:'baixo', totalFaturado:267800, tickets:27},
  {id:'c6', nome:'Laboratório Vitalle', cnpj:'11.222.333/0001-44', email:'financeiro@vitalle.lab.br', telefone:'(62) 9 9122-3344', endereco:'Goiânia / GO', score:73, risco:'medio', totalFaturado:198500, tickets:15},
  {id:'c7', nome:'Papéis & Embalagens Nordeste', cnpj:'22.333.444/0001-55', email:'contabil@papelnordeste.com', telefone:'(81) 9 8877-1122', endereco:'Recife / PE', score:55, risco:'medio', totalFaturado:87400, tickets:9},
  {id:'c8', nome:'Transportadora Rápido Carga', cnpj:'33.444.555/0001-66', email:'financeiro@rapidocarga.com', telefone:'(31) 9 9765-4433', endereco:'Belo Horizonte / MG', score:29, risco:'alto', totalFaturado:52300, tickets:7},
]

export const titulosMock: Titulo[] = [
  {id:'t1', clienteId:'c2', clienteNome:'Distribuidora Boa Vista Atacado', numero:'NF 4821', valor:18450, vencimento:'2026-09-10', emissao:'2026-08-10', status:'vencido', tentativas:4, canal:'whatsapp'},
  {id:'t2', clienteId:'c4', clienteNome:'Alimentos Aurora S/A', numero:'NF 4822', valor:32700, vencimento:'2026-09-12', emissao:'2026-08-12', status:'vencido', tentativas:3, canal:'email'},
  {id:'t3', clienteId:'c8', clienteNome:'Transportadora Rápido Carga', numero:'NF 4827', valor:8900, vencimento:'2026-09-14', emissao:'2026-08-14', status:'vencido', tentativas:2, canal:'whatsapp'},
  {id:'t4', clienteId:'c3', clienteNome:'Construtora Horizonte Sul', numero:'NF 4830', valor:45200, vencimento:'2026-09-16', emissao:'2026-08-16', status:'a_vencer', tentativas:0},
  {id:'t5', clienteId:'c1', clienteNome:'Metalúrgica Santa Clara Ltda', numero:'NF 4831', valor:22300, vencimento:'2026-09-18', emissao:'2026-08-18', status:'a_vencer', tentativas:0},
  {id:'t6', clienteId:'c7', clienteNome:'Papéis & Embalagens Nordeste', numero:'NF 4833', valor:12750, vencimento:'2026-09-05', emissao:'2026-08-05', status:'vencido', tentativas:5, canal:'voz'},
  {id:'t7', clienteId:'c5', clienteNome:'TechParts Componentes Ltda', numero:'NF 4835', valor:38900, vencimento:'2026-09-20', emissao:'2026-08-20', status:'a_vencer', tentativas:0},
  {id:'t8', clienteId:'c2', clienteNome:'Distribuidora Boa Vista Atacado', numero:'NF 4799', valor:15200, vencimento:'2026-08-28', emissao:'2026-07-28', status:'negociado', tentativas:6, canal:'whatsapp'},
  {id:'t9', clienteId:'c6', clienteNome:'Laboratório Vitalle', numero:'NF 4805', valor:26800, vencimento:'2026-08-30', emissao:'2026-07-30', status:'pago', tentativas:1, valorPago:26800, dataPagamento:'2026-08-29'},
  {id:'t10', clienteId:'c4', clienteNome:'Alimentos Aurora S/A', numero:'NF 4810', valor:41200, vencimento:'2026-09-02', emissao:'2026-08-02', status:'pago', tentativas:2, valorPago:41200, dataPagamento:'2026-09-01'},
  {id:'t11', clienteId:'c3', clienteNome:'Construtora Horizonte Sul', numero:'NF 4815', valor:18900, vencimento:'2026-09-08', emissao:'2026-08-08', status:'vencido', tentativas:3, canal:'email'},
  {id:'t12', clienteId:'c1', clienteNome:'Metalúrgica Santa Clara Ltda', numero:'NF 4840', valor:34500, vencimento:'2026-09-22', emissao:'2026-08-22', status:'a_vencer', tentativas:0},
  {id:'t13', clienteId:'c5', clienteNome:'TechParts Componentes Ltda', numero:'NF 4842', valor:27800, vencimento:'2026-08-20', emissao:'2026-07-20', status:'pago', tentativas:1, valorPago:27800, dataPagamento:'2026-08-19'},
  {id:'t14', clienteId:'c8', clienteNome:'Transportadora Rápido Carga', numero:'NF 4845', valor:15600, vencimento:'2026-09-01', emissao:'2026-08-01', status:'protestado', tentativas:7, canal:'whatsapp'},
]

export const reguaMock: EventoRegua[] = [
  {id:'r1', dia:-3, canal:'whatsapp', template:'Lembrete gentil: sua NF vence em 3 dias. Pix copia-e-cola anexado.', taxaAbertura:78, taxaConversao:22, ativo:true},
  {id:'r2', dia:0, canal:'whatsapp', template:'Hoje é o vencimento da NF {numero} - R$ {valor}. Pague via Pix ou boleto em 1 clique.', taxaAbertura:84, taxaConversao:31, ativo:true},
  {id:'r3', dia:1, canal:'email', template:'Não identificamos o pagamento. Evite juros - regularize em 1 clique.', taxaAbertura:62, taxaConversao:18, ativo:true},
  {id:'r4', dia:3, canal:'whatsapp', template:'Olá {nome}, seu título está 3 dias em atraso. Negocie em até 3x sem juros no portal.', taxaAbertura:71, taxaConversao:26, ativo:true},
  {id:'r5', dia:7, canal:'voz', template:'Ligação humanizada + envio de link de negociação com desconto de 2% à vista.', taxaAbertura:45, taxaConversao:33, ativo:true},
  {id:'r6', dia:15, canal:'whatsapp', template:'Último aviso amigável antes de negativação. Condição especial hoje apenas.', taxaAbertura:69, taxaConversao:29, ativo:true},
  {id:'r7', dia:20, canal:'email', template:'Aviso de protesto em cartório em 48h. Evite custos extras.', taxaAbertura:58, taxaConversao:41, ativo:false},
]

export const kpisBase = {
  aReceber: 342780,
  vencido: 98700,
  recuperado30d: 187450,
  taxaRecuperacao: 83.2,
  ticketMedio: 23840,
  prazoMedioRecebimento: 28,
  inadimplencia: 12.4,
}
