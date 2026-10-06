"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const toggleCryptoFavoriteSchema = z.object({
  coinId: z.string().min(1),
  favorite: z.boolean(),
});

export const toggleCryptoFavorite = async (
  params: z.infer<typeof toggleCryptoFavoriteSchema>,
) => {
  const { coinId, favorite } = toggleCryptoFavoriteSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  if (favorite) {
    await db.cryptoFavorite.upsert({
      where: { userId_coinId: { userId, coinId } },
      create: { userId, coinId },
      update: {},
    });
  } else {
    await db.cryptoFavorite.deleteMany({ where: { userId, coinId } });
  }
  revalidatePath("/crypto", "layout");
};
