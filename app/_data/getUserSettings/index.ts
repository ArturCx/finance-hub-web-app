import { db } from "@/app/_lib/prisma";

export interface UserSettingsView {
  includeInvoicesInBalance: boolean;
  investmentGoal: number | null;
}

export const getUserSettings = async (
  userId: string,
): Promise<UserSettingsView> => {
  const settings = await db.userSettings.findUnique({ where: { userId } });
  return {
    includeInvoicesInBalance: settings?.includeInvoicesInBalance ?? false,
    investmentGoal: settings?.investmentGoal
      ? Number(settings.investmentGoal)
      : null,
  };
};
