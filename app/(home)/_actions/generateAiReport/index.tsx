"use server";

import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { buildReportContext } from "./buildReportContext";
import { generateAiReportSchema, GenerateAiReportSchema } from "./schema";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const AI_REPORT_MODEL = "openai/gpt-oss-120b";

const SYSTEM_PROMPT = `Você é um planejador financeiro pessoal brasileiro, direto e prático.
Você recebe um resumo do mês de um usuário, já calculado pelo sistema, e escreve um relatório em português do Brasil.

Regras:
- Use somente os números fornecidos. Nunca invente valores, transações, rendas ou categorias.
- Não refaça somas dos dados; os totais já estão corretos.
- Cada economia sugerida deve partir de uma despesa listada e ter uma conta simples e verificável: "valor atual − valor proposto" ou "quantidade reduzida × média" (ex.: "reduzir de 14 para 8 pedidos × R$ 44,30 = R$ 265,80 por mês").
- Diferencie gastos recorrentes (que se repetem ou são mensais por natureza, como assinaturas, delivery, internet, academia) de gastos pontuais (viagens, compras grandes únicas). Priorize economias em recorrentes; para pontuais, no máximo sugira planejamento.
- Se a seção "Possíveis lançamentos duplicados" listar itens, aponte cada um em "Pontos de atenção" (pode ser cobrança em duplicidade ou recorrência legítima; peça para o usuário conferir).
- Nunca repita a mesma despesa em duas sugestões de economia; possíveis duplicidades vão só em "Pontos de atenção".
- Se o mês anterior não tiver dados (aparece "novo no mês"), não fale em mudança ou comparação com o mês anterior.
- Investir não é economia: sugestões de investimento ficam apenas no "Plano para o próximo mês".
- Não dê alertas genéricos; só aponte riscos que os números sustentem (ex.: não alerte sobre limite do cartão se o uso for baixo).
- Seja específico: cite as descrições, categorias e valores exatos que justificam cada ponto.
- Se o mês estiver em andamento, trate os valores como parciais e evite conclusões definitivas.
- Não use tabelas. Use títulos com "##", listas e **negrito** para valores importantes.
- Tom amigável, sem julgamentos e sem jargões. Sem introdução nem despedida.

Estrutura obrigatória:
## Resumo do mês
2 a 3 frases com o saldo, a taxa de poupança e, se houver dados do mês anterior, a principal mudança em relação a ele.
## Para onde foi seu dinheiro
As categorias e os gastos (por descrição) que mais pesaram, com valores e percentuais.
## Onde dá para economizar
Até 5 ações concretas, cada uma com a economia mensal estimada em R$ e a conta usada. Se houver poucos gastos, sugira menos ações em vez de forçar.
## Pontos de atenção
Contas vencidas ou em aberto, uso do cartão de crédito, aumentos fora do padrão e a meta de investimento. Omita a seção se não houver nada relevante.
## Plano para o próximo mês
Até 3 metas numéricas e alcançáveis.`;

export const generateAiReport = async (
  params: GenerateAiReportSchema,
): Promise<{ report: string | null; error: string | null }> => {
  const { month, year } = generateAiReportSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const context = await buildReportContext(userId, month, year);
  if (!context) {
    return {
      report: null,
      error: "Não há transações nem contas neste mês para analisar.",
    };
  }

  try {
    const completion = await groq.chat.completions.create({
      model: AI_REPORT_MODEL,
      temperature: 0.4,
      max_completion_tokens: 4096,
      ...({ reasoning_effort: "medium" } as object),
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: context },
      ],
    });
    const report = completion.choices[0]?.message?.content?.trim();
    if (!report) {
      return { report: null, error: "A IA não retornou um relatório. Tente novamente." };
    }
    return { report, error: null };
  } catch (error) {
    console.error("Falha ao gerar relatório na Groq:", error);
    const status = (error as { status?: number }).status;
    return {
      report: null,
      error:
        status === 429
          ? "Limite de uso da IA atingido. Tente novamente em alguns minutos."
          : "Não foi possível gerar o relatório agora. Tente novamente.",
    };
  }
};
