import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  const url =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=200&precision=2';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': process.env.GECKO_API_KEY ?? '',
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Mapeia os dados para o formato esperado pelo Prisma
    const cryptos = data.map((crypto) => ({
      externalId: crypto.id,
      name: crypto.name,
      image: crypto.image,
      currentPrice: crypto.current_price,
      marketCapRank: crypto.market_cap_rank,
      marketCap: crypto.market_cap,
      priceChangePercentage24h: crypto.price_change_percentage_24h,
      totalVolume: crypto.total_volume,
    }));

    // Insere em batch usando createMany
    await prisma.cryptos.createMany({
      data: cryptos,
      skipDuplicates: true, // Ignora entradas que já existam (baseado em `unique` constraint)
    });

    console.log('Dados das criptomoedas sincronizados com sucesso.');
  } catch (err) {
    console.error('Erro ao sincronizar os dados das criptomoedas:', err);
  } finally {
    await prisma.$disconnect();
  }
})();
