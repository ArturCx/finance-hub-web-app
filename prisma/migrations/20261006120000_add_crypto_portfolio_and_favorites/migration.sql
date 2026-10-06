-- CreateEnum
CREATE TYPE "CryptoTradeType" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "crypto_trades" (
    "id" TEXT NOT NULL,
    "type" "CryptoTradeType" NOT NULL,
    "coinId" TEXT NOT NULL,
    "quantity" DECIMAL(28,10) NOT NULL,
    "price" DECIMAL(18,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "transactionId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crypto_trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crypto_favorites" (
    "userId" TEXT NOT NULL,
    "coinId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crypto_favorites_pkey" PRIMARY KEY ("userId","coinId")
);

-- CreateIndex
CREATE INDEX "crypto_trades_userId_idx" ON "crypto_trades"("userId");

-- AddForeignKey
ALTER TABLE "crypto_trades" ADD CONSTRAINT "crypto_trades_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "cryptos"("externalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crypto_favorites" ADD CONSTRAINT "crypto_favorites_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "cryptos"("externalId") ON DELETE RESTRICT ON UPDATE CASCADE;

