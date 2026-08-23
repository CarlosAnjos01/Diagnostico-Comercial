export const dimensions = [
  {
    id: "estrategia",
    name: "Estratégia",
    short: "Estratégia",
    description: "Clareza sobre mercado, cliente ideal, posicionamento e direção comercial.",
  },
  {
    id: "processo",
    name: "Processo Comercial",
    short: "Processo",
    description: "Como a oportunidade percorre o funil até o fechamento e pós-venda.",
  },
  {
    id: "pessoas",
    name: "Pessoas",
    short: "Pessoas",
    description: "Papéis, responsabilidades, capacitação, metas e rotina do time.",
  },
  {
    id: "gestao",
    name: "Gestão e Indicadores",
    short: "Gestão",
    description: "Metas, indicadores, forecast, reuniões e tomada de decisão.",
  },
  {
    id: "tecnologia",
    name: "Tecnologia e Dados",
    short: "Tecnologia",
    description: "CRM, dados, automações e uso das ferramentas no processo.",
  },
  {
    id: "marketing",
    name: "Marketing e Geração de Demanda",
    short: "Marketing",
    description: "Aquisição, canais, campanhas e qualidade da demanda.",
  },
  {
    id: "retencao",
    name: "Retenção e Expansão",
    short: "Retenção",
    description: "Onboarding, pós-venda, recompra, indicação e expansão.",
  },
];

const q = (id, dimension, text, weight = 1) => ({
  id,
  dimension,
  text,
  weight,
});

export const questions = [
  q("estr-01", "estrategia", "A empresa sabe descrever com clareza quem é seu cliente ideal (ICP)?"),
  q("estr-02", "estrategia", "Existe um posicionamento ou proposta de valor comercial clara?"),
  q("estr-03", "estrategia", "Os segmentos prioritários são definidos com base em dados ou critérios objetivos?"),
  q("estr-04", "estrategia", "A empresa sabe quais produtos/serviços têm maior potencial de margem e crescimento?"),
  q("estr-05", "estrategia", "Existe uma estratégia comercial formal para os próximos 6 a 12 meses?"),

  q("proc-01", "processo", "Existe um processo comercial definido do primeiro contato ao fechamento?"),
  q("proc-02", "processo", "Os critérios de qualificação de oportunidades são claros e utilizados?"),
  q("proc-03", "processo", "Existe uma etapa padrão para diagnóstico da necessidade do cliente?"),
  q("proc-04", "processo", "As propostas comerciais seguem um padrão e têm critérios de acompanhamento?"),
  q("proc-05", "processo", "Existe uma rotina definida para follow-up de oportunidades abertas?"),

  q("pess-01", "pessoas", "Cada pessoa do time comercial sabe exatamente seu papel e responsabilidade?"),
  q("pess-02", "pessoas", "Novos vendedores conseguem aprender o processo sem depender apenas de uma pessoa-chave?"),
  q("pess-03", "pessoas", "O time recebe treinamento ou coaching comercial de forma recorrente?"),
  q("pess-04", "pessoas", "As metas individuais e coletivas estão claramente definidas?"),
  q("pess-05", "pessoas", "Existe uma rotina de gestão do desempenho dos vendedores?"),

  q("gest-01", "gestao", "A empresa acompanha o número de oportunidades abertas no funil?"),
  q("gest-02", "gestao", "A taxa de conversão entre as principais etapas é conhecida?"),
  q("gest-03", "gestao", "O ticket médio e a margem são acompanhados comercialmente?"),
  q("gest-04", "gestao", "As metas são construídas a partir de histórico, capacidade e funil necessário?"),
  q("gest-05", "gestao", "Existe uma reunião periódica de gestão comercial baseada em indicadores?"),

  q("tec-01", "tecnologia", "Existe um CRM ou sistema central para registrar oportunidades?"),
  q("tec-02", "tecnologia", "O CRM é efetivamente utilizado pela equipe, e não apenas cadastrado?"),
  q("tec-03", "tecnologia", "A empresa consegue consultar rapidamente o status das oportunidades?"),
  q("tec-04", "tecnologia", "Existem automações que reduzem tarefas manuais repetitivas do comercial?"),
  q("tec-05", "tecnologia", "Os dados comerciais são confiáveis o suficiente para orientar decisões?"),

  q("mkt-01", "marketing", "A empresa possui canais previsíveis de geração de oportunidades?"),
  q("mkt-02", "marketing", "Marketing e vendas compartilham critérios sobre o que é um lead qualificado?"),
  q("mkt-03", "marketing", "As campanhas são avaliadas por impacto no pipeline e não apenas por métricas de vaidade?"),
  q("mkt-04", "marketing", "Existe conteúdo ou comunicação direcionada aos principais perfis de cliente?"),
  q("mkt-05", "marketing", "A origem dos leads é registrada e analisada?"),

  q("ret-01", "retencao", "Existe um processo definido de onboarding após a venda?"),
  q("ret-02", "retencao", "A empresa acompanha satisfação, recompra ou renovação dos clientes?"),
  q("ret-03", "retencao", "Existe uma estratégia ativa para gerar recompra ou expansão?"),
  q("ret-04", "retencao", "Clientes satisfeitos são estimulados de forma estruturada a indicar novos clientes?"),
  q("ret-05", "retencao", "O time comercial recebe informações do pós-venda para melhorar novas vendas?"),
];

export const answerOptions = [
  { value: 1, label: "Não existe", helper: "Não há prática definida." },
  { value: 2, label: "Informal", helper: "Acontece, mas depende de pessoas." },
  { value: 3, label: "Parcial", helper: "Existe em alguns casos, sem padrão." },
  { value: 4, label: "Estruturado", helper: "Existe padrão e é utilizado." },
  { value: 5, label: "Gerenciado", helper: "É padrão, medido e melhorado." },
];
