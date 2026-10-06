import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import { Resend } from "resend";
import { EmailTemplate } from "./emailTemplate";
import { getAuth } from "@clerk/nextjs/server";

const prisma = db;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não está logado." },
        { status: 401 }
      );
    }

    const user = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then((res) => res.json());

    if (!user || !user.email_addresses || user.email_addresses.length === 0) {
      return NextResponse.json(
        { error: "Não foi possível encontrar o e-mail do usuário." },
        { status: 400 }
      );
    }

    const userEmail = user.email_addresses[0].email_address;
    const userName = user.first_name || "Usuário";

    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 5);

    const billsDueSoon = await prisma.bills.findMany({
      where: {
        userId,
        expireDate: targetDate,
        status: "PAYABLE",
      },
    });

    if (billsDueSoon.length === 0) {
      return NextResponse.json({
        message: "Nenhuma conta para enviar lembrete.",
      });
    }

    for (const bill of billsDueSoon) {
      const emailContent = EmailTemplate({
        firstName: userName,
        billName: bill.name,
        amount: bill.amount.toFixed(2),
        dueDate: bill.expireDate.toLocaleDateString("pt-BR"),
      });

      await resend.emails.send({
        from: "Finance Hub <no-reply@financehub.dev>",
        to: [userEmail],
        subject: `Sua conta "${bill.name}" vence em 5 dias!`,
        react: emailContent,
      });

      console.log(`Lembrete enviado para ${userEmail}`);
    }

    return NextResponse.json({ message: "Lembretes enviados com sucesso." });
  } catch (error) {
    console.error("Erro ao enviar lembretes:", error);
    return NextResponse.json(
      { error: "Erro ao enviar lembretes." },
      { status: 500 }
    );
  }
}
