import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";

const prisma = db;

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
    const limit = parseInt(
      request.nextUrl.searchParams.get("limit") || "10",
      10
    );

    const offset = page > 0 && limit > 0 ? (page - 1) * limit : 0;

    const [charts, total] = await prisma.$transaction([
      prisma.cryptoCharts.findMany({
        skip: offset,
        take: limit,
        select: {
          externalId: true,
          prices: true,
          marketCaps: true,
          totalVolumes: true,
        },
      }),
      prisma.cryptoCharts.count(),
    ]);

    return NextResponse.json({ charts, total });
  } catch (error) {
    console.error("Erro ao buscar gráficos com paginação:", error);
    return NextResponse.json(
      { message: "Erro ao buscar gráficos com paginação", error },
      { status: 500 }
    );
  }
}
