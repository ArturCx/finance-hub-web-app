import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const prisma = new PrismaClient();

// Configuração para respeitar o limite de requisições
const RATE_LIMIT = 30; // Requisições permitidas por minuto
const DELAY_MS = (60 / RATE_LIMIT) * 1000; // Intervalo entre requisições em milissegundos

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  try {
    // Obter todas as moedas registradas no banco
    const cryptos = await prisma.cryptos.findMany();
    console.log(`Encontradas ${cryptos.length} moedas no banco.`);

    for (const crypto of cryptos) {
      console.log(`Buscando gráfico para: ${crypto.name} (${crypto.externalId})`);
      const url = `https://api.coingecko.com/api/v3/coins/${crypto.externalId}/market_chart?vs_currency=brl&days=365&precision=1`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": process.env.GECKO_API_KEY ?? "",
        },
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const marketChartData = await response.json();

        if (marketChartData.prices) {
          // Realiza o upsert no banco de dados
          await prisma.cryptoCharts.upsert({
            where: { externalId: crypto.externalId },
            create: {
              externalId: crypto.externalId,
              prices: marketChartData.prices,
              marketCaps: marketChartData.market_caps,
              totalVolumes: marketChartData.total_volumes,
            },
            update: {
              prices: marketChartData.prices,
              marketCaps: marketChartData.market_caps,
              totalVolumes: marketChartData.total_volumes,
            },
          });

          console.log(
            `Gráfico para ${crypto.name} (${crypto.externalId}) salvo no banco.`
          );
        } else {
          console.warn(`Gráfico não encontrado para ${crypto.name} (${crypto.externalId}).`);
        }
      } catch (error) {
        console.error(
          `Erro ao buscar gráfico para ${crypto.name} (${crypto.externalId}):`,
          error.message
        );
      }

      // Respeita o intervalo de requisições
      await delay(DELAY_MS);
    }

    console.log("Importação de gráficos concluída.");
  } catch (error) {
    console.error("Erro na importação de gráficos:", error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
