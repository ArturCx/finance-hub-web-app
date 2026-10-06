import { db } from "@/app/_lib/prisma";

export const DEFAULT_USER_SETTINGS = {
  includeInvoicesInBalance: false,
};

export const getUserSettings = async (userId: string) => {
  const settings = await db.userSettings.findUnique({ where: { userId } });
  return settings ?? { userId, ...DEFAULT_USER_SETTINGS };
};
