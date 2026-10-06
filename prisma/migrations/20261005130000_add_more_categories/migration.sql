-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionCategory" ADD VALUE 'GROCERIES';
ALTER TYPE "TransactionCategory" ADD VALUE 'DINING';
ALTER TYPE "TransactionCategory" ADD VALUE 'SHOPPING';
ALTER TYPE "TransactionCategory" ADD VALUE 'PERSONAL_CARE';
ALTER TYPE "TransactionCategory" ADD VALUE 'PETS';
ALTER TYPE "TransactionCategory" ADD VALUE 'SUBSCRIPTIONS';
ALTER TYPE "TransactionCategory" ADD VALUE 'TELECOM';
ALTER TYPE "TransactionCategory" ADD VALUE 'INSURANCE';
ALTER TYPE "TransactionCategory" ADD VALUE 'TAXES';
ALTER TYPE "TransactionCategory" ADD VALUE 'DEBT';
ALTER TYPE "TransactionCategory" ADD VALUE 'TRAVEL';
ALTER TYPE "TransactionCategory" ADD VALUE 'FITNESS';
ALTER TYPE "TransactionCategory" ADD VALUE 'GIFTS';
ALTER TYPE "TransactionCategory" ADD VALUE 'KIDS';
ALTER TYPE "TransactionCategory" ADD VALUE 'FREELANCE';
ALTER TYPE "TransactionCategory" ADD VALUE 'INVESTMENT_INCOME';
ALTER TYPE "TransactionCategory" ADD VALUE 'REFUND';
ALTER TYPE "TransactionCategory" ADD VALUE 'SALES';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BillCategory" ADD VALUE 'GROCERIES';
ALTER TYPE "BillCategory" ADD VALUE 'DINING';
ALTER TYPE "BillCategory" ADD VALUE 'SHOPPING';
ALTER TYPE "BillCategory" ADD VALUE 'PERSONAL_CARE';
ALTER TYPE "BillCategory" ADD VALUE 'PETS';
ALTER TYPE "BillCategory" ADD VALUE 'SUBSCRIPTIONS';
ALTER TYPE "BillCategory" ADD VALUE 'TELECOM';
ALTER TYPE "BillCategory" ADD VALUE 'INSURANCE';
ALTER TYPE "BillCategory" ADD VALUE 'TAXES';
ALTER TYPE "BillCategory" ADD VALUE 'DEBT';
ALTER TYPE "BillCategory" ADD VALUE 'TRAVEL';
ALTER TYPE "BillCategory" ADD VALUE 'FITNESS';
ALTER TYPE "BillCategory" ADD VALUE 'GIFTS';
ALTER TYPE "BillCategory" ADD VALUE 'KIDS';
ALTER TYPE "BillCategory" ADD VALUE 'FREELANCE';
ALTER TYPE "BillCategory" ADD VALUE 'INVESTMENT_INCOME';
ALTER TYPE "BillCategory" ADD VALUE 'REFUND';
ALTER TYPE "BillCategory" ADD VALUE 'SALES';

