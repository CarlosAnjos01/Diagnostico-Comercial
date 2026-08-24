import { dimensions } from "../data/questions";
import { getMaturityLevel } from "./engine";

// Matriz de gargalos: Problema -> Evidência -> Impacto -> Prioridade -> Ação
const GAP_MATRIX = {
  estrategia: {
    low: {
      gapId: "estr_icp_ausente",
      title: "ICP e Posicionamento Indefinidos",
      evidence: "Time comercial atende qualquer perfil de cliente sem foco em margem.",
      impact: "Ciclo de vendas longo, alta taxa de objeção e desperdício de energia comercial.",
      priority: "ALTA",
      action: "Definir Perfil de Cliente Ideal (ICP) e proposta de valor clara em até 15 dias."
    }
  },
  processo: {
    low: {
      gapId: "proc_sem_padrao",
      title: "Processo Comercial Não Padronizado",
      evidence: "Cada vendedor conduz a negociação à sua maneira sem etapas claras.",
      impact: "Falta de previsibilidade de receita e perda recorrente de oportunidades no funil.",
      priority: "ALTA",
      action: "Mapear o funil de vendas com gatilhos de passagem e cadência obrigatória de follow-up."
    }
  },
  gestao: {
    low: {
      gapId: "gest_sem_indicadores",
      title: "Gestão sem Indicadores Comerciais",
      evidence: "Acompanhamento apenas de faturamento, sem olhar taxas de conversão ou pipeline.",
      impact: "Impossibilidade de prever vendas futuras (forecast) e identificar onde o time erra.",
      priority: "ALTA",
      action: "Implantar reunião semanal de pipeline (Rhythm) e dashboard de métricas primárias."
    }
  },
  tecnologia: {
    low: {
      gapId: "tec_crm_subutilizado",
      title: "CRM Inexistente ou Subutilizado",
      evidence: "Informações de clientes ficam em planilhas ou na cabeça dos vendedores.",
      impact: "Perda de histórico comercial, vazamento de leads e impossibilidade de escala.",
      priority: "MÉDIA",
      action: "Configurar o CRM com o novo processo e estabelecer governança rígida de uso."
    }
  },
  pessoas: {
    low: {
      gapId: "pess_dependencia_chave",
      title: "Dependência de Pessoas-Chave",
      evidence: "Vendas dependem excessivamente do fundador ou de um único vendedor veterano.",
      impact: "Gargalo no crescimento e vulnerabilidade operacional caso a pessoa saia.",
      priority: "MÉDIA",
      action: "Criar o Playbook Comercial e estruturar onboarding escalável para novos vendedores."
    }
  },
  marketing: {
    low: {
      gapId: "mkt_desconexao_vendas",
      title: "Demanda Imprevisível / Desconexão MKT",
      evidence: "Falta de leads qualificados recorrentes para abastecer a equipe de vendas.",
      impact: "Vendedores ociosos ou dedicando tempo excessivo a prospecção fria e ineficiente.",
      priority: "MÉDIA",
      action: "Alinhar SLAs de Lead Qualificado (SLA MKT/Vendas) e canais prioritários de aquisição."
    }
  },
  retencao: {
    low: {
      gapId: "ret_pos_venda_passivo",
      title: "Pós-Venda Passivo sem Expansão",
      evidence: "Não há rotina ativa de onboarding, recompra ou pedido de indicações.",
      impact: "Churn elevado e perda de receita previsível de carteira (LTV baixo).",
      priority: "BAIXA",
      action: "Desenhar régua de relacionamento pós-venda para gatilhos de upsell e indicação."
    }
  }
};

/**
 * Identifica os gargalos prioritários ordenando as dimensões de menor para maior pontuação.
 */
export function identifyGaps(dimensionScores) {
  const sorted = Object.entries(dimensionScores).sort(([, a], [, b]) => a - b);

  return sorted.slice(0, 3).map(([dimId, score]) => {
    const matrixEntry = GAP_MATRIX[dimId]?.low || {
      gapId: `${dimId}_generic`,
      title: `Evolução na Dimensão ${dimId}`,
      evidence: "Sinais de baixo desempenho e falta de padronização.",
      impact: "Redução da eficiência e da margem de crescimento.",
      priority: "MÉDIA",
      action: "Estruturar processos e rotinas para esta dimensão."
    };

    const dimInfo = dimensions.find((d) => d.id === dimId);

    return {
      dimension: dimId,
      dimensionName: dimInfo?.name || dimId,
      score,
      ...matrixEntry
    };
  });
}

/**
 * Define o Fit de Produto Ginga Aí (Diagnóstico, Estruturação ou Aceleração)
 */
export function determineProductFit(overallScore, companyData) {
  const maturity = getMaturityLevel(overallScore);
  const sellersCount = companyData?.sellers || "1-2";

  if (overallScore <= 40 || sellersCount === "Só o dono") {
    return {
      product: "Estruturação Comercial",
      tagline: "Construção da base comercial e padronização do processo.",
      reason: "Sua empresa precisa fundar processos padronizados, organizar o CRM e tirar a venda da cabeça das pessoas antes de tentar acelerar.",
      focus: ["Definição de ICP", "Desenho de Funil", "Governança de CRM", "Playbook Inicial"]
    };
  }

  if (overallScore <= 75) {
    return {
      product: "Estruturação + Aceleração Comercial",
      tagline: "Ajuste de gargalos estruturais e tração de crescimento.",
      reason: "A base existe, mas há gargalos importantes travando a previsibilidade. O foco é otimizar conversões e dar tração ao time.",
      focus: ["Gestão por Indicadores", "Treinamento de Vendedores", "Cadência de Follow-up", "Incentivos e Metas"]
    };
  }

  return {
    product: "Aceleração Comercial",
    tagline: "Escala, dados, automação e expansão de canal.",
    reason: "Operação maturada. O próximo passo é maximizar o LTV, implantar automações avançadas e escalar o volume do pipeline.",
    focus: ["Previsibilidade / Forecast", "Automações Avançadas", "Estratégia de Expansão/Pós-venda", "Coaching de Liderança"]
  };
}

/**
 * Função principal que sintetiza o relatório do motor v2
 */
export function runEngineV2(answersPayload, companyData, questionsList) {
  const dimensionScores = calculateScores(answersPayload, questionsList);
  const overall = calculateOverallScore(dimensionScores);
  const maturity = getMaturityLevel(overall);
  const gaps = identifyGaps(dimensionScores);
  const productFit = determineProductFit(overall, companyData);

  return {
    overall,
    maturity,
    dimensionScores,
    primaryBottleneck: gaps[0],
    gaps,
    productFit,
    calculatedAt: new Date().toISOString()
  };
}
