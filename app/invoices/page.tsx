import { auth } from "@clerk/nextjs/server";
import { CreditCardIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import PageHeader from "../_components/pageHeader";
import { db } from "../_lib/prisma";
import AddCreditCardButton from "./_components/addCreditCardButton";
import CreditCardInvoice from "./_components/creditCardInvoice";
import InvoiceSummary from "./_components/invoiceSummary";
import PaymentHistory from "./_components/paymentHistory";
import { CreditCardView, InvoicePaymentView } from "./_types";
import { getBillingCycle } from "./_utils/billingCycle";

const InvoicesPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const [creditCards, payments] = await Promise.all([
    db.creditCard.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    }),
    db.invoicePayment.findMany({
      where: { userId },
      orderBy: { paidAt: "desc" },
      take: 8,
      include: { creditCard: { select: { name: true, color: true } } },
    }),
  ]);

  const cards: CreditCardView[] = creditCards
    .map((card) => {
      const cycle = getBillingCycle(card.closingDay, card.dueDay);
      return {
        id: card.id,
        name: card.name,
        color: card.color,
        closingDay: card.closingDay,
        dueDay: card.dueDay,
        limit: card.limit ? Number(card.limit) : null,
        currentAmount: Number(card.currentAmount),
        updatedAt: card.updatedAt.toISOString(),
        dueDate: cycle.dueDate.toISOString(),
        closingDate: cycle.closingDate.toISOString(),
        daysUntilDue: cycle.daysUntilDue,
        isClosed: cycle.isClosed,
      };
    })
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

  const paymentViews: InvoicePaymentView[] = payments.map((payment) => ({
    id: payment.id,
    amount: Number(payment.amount),
    paidAt: payment.paidAt.toISOString(),
    cardName: payment.creditCard.name,
    cardColor: payment.creditCard.color,
  }));

  return (
    <>
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto p-4 md:space-y-6 md:p-6">
        <PageHeader
          title="Fatura"
          description="Acompanhe o valor em aberto de cada cartão."
          icon={<CreditCardIcon />}
        >
          <AddCreditCardButton />
        </PageHeader>

        {cards.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center animate-fade-in-up">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-primary shadow-lg shadow-primary/20">
              <CreditCardIcon className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold">Nenhum cartão cadastrado</h2>
            <p className="mb-6 mt-1 max-w-sm text-sm text-muted-foreground">
              Adicione seus cartões de crédito para acompanhar a fatura em
              aberto, o vencimento e o limite disponível.
            </p>
            <AddCreditCardButton />
          </div>
        ) : (
          <>
            <InvoiceSummary cards={cards} />
            <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-[1fr,360px]">
              <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:grid-cols-2">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${150 + index * 80}ms` }}
                  >
                    <CreditCardInvoice card={card} />
                  </div>
                ))}
              </div>
              <div className="animate-fade-in-up animation-delay-300">
                <PaymentHistory payments={paymentViews} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default InvoicesPage;
