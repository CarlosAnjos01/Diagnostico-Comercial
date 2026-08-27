export const dimensions = [
  { id: "estrategia", name: "Estratégia", short: "Estratégia", description: "Clareza sobre mercado, cliente ideal e direção comercial." },
  { id: "processo", name: "Processo Comercial", short: "Processo", description: "Como a oportunidade percorre o funil até o fechamento." },
  { id: "pessoas", name: "Pessoas", short: "Pessoas", description: "Papéis, responsabilidades, capacitação e rotina do time." },
  { id: "gestao", name: "Gestão e Indicadores", short: "Gestão", description: "Metas, indicadores, forecast e tomada de decisão." },
  { id: "tecnologia", name: "Tecnologia e Dados", short: "Tecnologia", description: "CRM, dados, automações e uso das ferramentas." },
  { id: "marketing", name: "Marketing e Demanda", short: "Marketing", description: "Aquisição, canais, campanhas e qualidade da demanda." },
  { id: "retencao", name: "Retenção e Expansão", short: "Retenção", description: "Onboarding, pós-venda, recompra, indicação e expansão." },
];

const q = (id, dimension, text, weight = 1) => ({ id, dimension, text, weight });

export const questions = [
  // ESTRATÉGIA (3)
  q("estr-01", "estrategia", "A empresa sabe descrever com clareza quem é seu cliente ideal (ICP)?", 1.2),
  q("estr-02", "estrategia", "Existe um posicionamento ou proposta de valor comercial clara para o mercado?", 1.0),
  q("estr-03", "estrategia", "Existe uma estratégia comercial formal definida para os próximos 6 a 12 meses?", 1.0),

  // PROCESSO COMERCIAL (3)
  q("proc-01", "processo", "Existe um processo comercial desenhado com etapas claras do primeiro contato ao fechamento?", 1.3),
  q("proc-02", "processo", "Os critérios para qualificar ou descartar um lead são objetivos e seguidos pelo time?", 1.1),
  q("proc-03", "processo", "Existe uma cadência obrigatória e padronizada de follow-up com os clientes?", 1.1),

  // PESSOAS (3)
  q("pess-01", "pessoas", "Cada pessoa do time comercial conhece exatamente suas responsabilidades e metas?", 1.0),
  q("pess-02", "pessoas", "A empresa consegue vender e rodar a operação sem depender do dono para fechar tudo?", 1.3),
  q("pess-03", "pessoas", "Novos vendedores aprendem o processo através de um playbook sem depender de veteranos?", 1.0),

  // GESTÃO E INDICADORES (3)
  q("gest-01", "gestao", "A liderança acompanha com precisão as taxas de conversão de cada etapa do funil?", 1.2),
  q("gest-02", "gestao", "As metas comerciais são calculadas com base em dados históricos e capacidade de funil?", 1.0),
  q("gest-03", "gestao", "Existe uma reunião semanal rígida para revisar o pipeline e tomar decisões baseadas em dados?", 1.1),

  // TECNOLOGIA E DADOS (3)
  q("tec-01", "tecnologia", "Existe um CRM estruturado onde todas as negociações são obrigatoriamente registradas?", 1.3),
  q("tec-02", "tecnologia", "O CRM é usado no dia a dia como ferramenta de trabalho do vendedor e não como burocracia?", 1.1),
  q("tec-03", "tecnologia", "A empresa utiliza automações (ex: WhatsApp) para acelerar e padronizar o contato?", 1.0),

  // MARKETING E DEMANDA (1)
  q("mkt-01", "marketing", "A empresa possui canais previsíveis e recorrentes para gerar novas oportunidades qualificadas?", 1.2),

  // RETENÇÃO E EXPANSÃO (2)
  q("ret-01", "retencao", "Existe um processo estruturado de onboarding e pós-venda para garantir a satisfação do cliente?", 1.0),
  q("ret-02", "retencao", "A empresa possui uma rotina ativa para gerar recompra, expansão (upsell) e indicações?", 1.1),
];

export const answerOptions = [
  { value: 1, label: "Inexistente", helper: "Não há prática definida ou é totalmente ignorada." },
  { value: 2, label: "Informal", helper: "Acontece no improviso e varia conforme quem executa." },
  { value: 3, label: "Parcial", helper: "Existe em algumas situações, mas falta padrão e rigor." },
  { value: 4, label: "Estruturado", helper: "Processo padronizado, documentado e seguido pelo time." },
  { value: 5, label: "Gerenciado", helper: "É padrão, medido por métricas e continuamente otimizado." },
];
