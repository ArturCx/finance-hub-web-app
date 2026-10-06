"use client";

import FormDialogHeader from "@/app/_components/formDialogHeader";
import { MoneyInput } from "@/app/_components/moneyInput";
import { Button } from "@/app/_components/ui/button";
import { DatePicker } from "@/app/_components/ui/datePicker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { TRANSACTION_PAYMENT_METHOD_OPTIONS } from "@/app/_constants/transactions";
import { formatCurrency } from "@/app/_utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionPaymentMethod } from "@prisma/client";
import { BadgeCheckIcon, InfoIcon, Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { payInvoice } from "../_actions/payInvoice";
import { CreditCardView } from "../_types";

const PAYMENT_OPTIONS = TRANSACTION_PAYMENT_METHOD_OPTIONS.filter(
  (option) => option.value !== TransactionPaymentMethod.CREDIT_CARD,
);

const formSchema = z.object({
  amount: z
    .number({ required_error: "O valor é obrigatório." })
    .positive({ message: "O valor deve ser positivo." }),
  paidAt: z.date({ required_error: "A data é obrigatória." }),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
    required_error: "O método de pagamento é obrigatório.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

interface PayInvoiceDialogProps {
  card: CreditCardView;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const PayInvoiceDialog = ({ card, isOpen, setIsOpen }: PayInvoiceDialogProps) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        amount: card.currentAmount || undefined,
        paidAt: new Date(),
        paymentMethod: TransactionPaymentMethod.PIX,
      });
    }
  }, [isOpen, card.currentAmount, form]);

  const amount = form.watch("amount") ?? 0;
  const remaining = Math.max(card.currentAmount - amount, 0);

  const onSubmit = async (data: FormSchema) => {
    try {
      await payInvoice({ ...data, creditCardId: card.id });
      toast.success("Pagamento registrado e lançado em Transações!");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível registrar o pagamento.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <FormDialogHeader
          icon={<BadgeCheckIcon />}
          title={`Pagar fatura · ${card.name}`}
          description={`Em aberto: ${formatCurrency(card.currentAmount)}`}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative space-y-5"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor pago</FormLabel>
                  <FormControl>
                    <MoneyInput
                      placeholder="R$ 0,00"
                      className="h-14 text-2xl font-bold tabular-nums md:text-2xl"
                      value={field.value ?? ""}
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pago com</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paidAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do pagamento</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/[0.06] p-3 text-xs leading-relaxed text-muted-foreground">
              <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                Uma despesa &quot;Fatura {card.name}&quot; será criada em
                Transações. Fatura restante após o pagamento:{" "}
                <span className="font-semibold text-foreground">
                  {formatCurrency(remaining)}
                </span>
                .
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2Icon className="animate-spin" />
                )}
                Confirmar pagamento
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PayInvoiceDialog;
