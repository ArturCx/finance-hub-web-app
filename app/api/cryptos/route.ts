import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db as prisma } from "@/app/_lib/prisma";

export const dynamic = "force-dynamic";

interface Params {
  page: number;
  limit: number;
  search?: string;
}

export async function GET(request: NextRequest) {
  const { page, limit, search } = {
    page: Number(request.nextUrl.searchParams.get("page") ?? 1),
    limit: Number(request.nextUrl.searchParams.get("limit") ?? 10),
    search: request.nextUrl.searchParams.get("search"),
  } as Params;

  try {
    const where: Prisma.CryptosWhereInput = {
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    };

    const [cryptos, total] = await prisma.$transaction([
      prisma.cryptos.findMany({
        orderBy: {
          marketCapRank: "asc",
        },
        include: {
          charts: true,
        },
        take: limit,
        skip: (page - 1) * limit,
        where,
      }),

      prisma.cryptos.count({
        where,
      }),
    ]);

    return NextResponse.json({ cryptos, total });
  } catch (error) {
    console.error("Erro ao buscar criptomoedas com gráficos:", error);
    return NextResponse.json(
      { message: "Erro ao buscar criptomoedas com gráficos", error },
      { status: 500 }
    );
  }
}
