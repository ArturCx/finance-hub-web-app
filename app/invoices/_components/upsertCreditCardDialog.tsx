"use client";

import FormDialogHeader from "@/app/_components/formDialogHeader";
import { MoneyInput } from "@/app/_components/moneyInput";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { cn } from "@/app/_lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, CreditCardIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { upsertCreditCard } from "../_actions/upsertCreditCard";
import { CARD_COLORS } from "../_constants";
import CreditCardVisual from "./creditCardVisual";

const dayField = (label: string) =>
  z.coerce
    .number({ invalid_type_error: `O dia de ${label} é obrigatório.` })
    .int()
    .min(1, { message: "Use um dia entre 1 e 31." })
    .max(31, { message: "Use um dia entre 1 e 31." });

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório." }),
  color: z.string(),
  closingDay: dayField("fechamento"),
  dueDay: dayField("vencimento"),
  limit: z.number().positive().nullable().optional(),
  currentAmount: z
    .number({ required_error: "Informe o valor atual (pode ser 0)." })
    .min(0),
});

export type CreditCardFormSchema = z.infer<typeof formSchema>;

interface UpsertCreditCardDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  creditCardId?: string;
  defaultValues?: CreditCardFormSchema;
}

const UpsertCreditCardDialog = ({
  isOpen,
  setIsOpen,
  creditCardId,
  defaultValues,
}: UpsertCreditCardDialogProps) => {
  const formDefaultValues: Partial<CreditCardFormSchema> = defaultValues ?? {
    name: "",
    color: CARD_COLORS[0],
    closingDay: undefined,
    dueDay: undefined,
    limit: null,
    currentAmount: 0,
  };

  const form = useForm<CreditCardFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const isUpdate = Boolean(creditCardId);
  const [name, color, dueDay] = form.watch(["name", "color", "dueDay"]);

  const onSubmit = async (data: CreditCardFormSchema) => {
    try {
      await upsertCreditCard({ ...data, id: creditCardId });
      toast.success(isUpdate ? "Cartão atualizado!" : "Cartão adicionado!");
      setIsOpen(false);
      form.reset(isUpdate ? data : formDefaultValues);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar o cartão.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset(formDefaultValues);
        }
      }}
    >
      <DialogContent>
        <FormDialogHeader
          icon={<CreditCardIcon />}
          title={isUpdate ? "Editar cartão" : "Novo cartão"}
          description="Configure o ciclo da fatura para acompanhar o vencimento."
        />

        <div className="relative mx-auto w-full max-w-[280px]">
          <CreditCardVisual
            name={name}
            color={color}
            dueDay={Number(dueDay) || undefined}
          />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do cartão</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Nubank, Inter..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <div
                    role="radiogroup"
                    aria-label="Cor do cartão"
                    className="flex flex-wrap gap-2"
                  >
                    {CARD_COLORS.map((option) => {
                      const isActive = option === field.value;
                      return (
                        <button
                          key={option}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          aria-label={option}
                          onClick={() => field.onChange(option)}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 ring-offset-[#0b1116] transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            isActive && "scale-110 ring-2 ring-white/80",
                          )}
                          style={{ backgroundColor: option }}
                        >
                          {isActive && <CheckIcon className="h-4 w-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="closingDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de fechamento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={31}
                        placeholder="Ex.: 3"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de vencimento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={31}
                        placeholder="Ex.: 10"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="currentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fatura em aberto</FormLabel>
                    <FormControl>
                      <MoneyInput
                        placeholder="R$ 0,00"
                        value={field.value}
                        onValueChange={({ floatValue }) =>
                          field.onChange(floatValue ?? 0)
                        }
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite (opcional)</FormLabel>
                    <FormControl>
                      <MoneyInput
                        placeholder="R$ 0,00"
                        value={field.value ?? ""}
                        onValueChange={({ floatValue }) =>
                          field.onChange(floatValue || null)
                        }
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormDescription>Mostra quanto do limite já foi usado.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {isUpdate ? "Salvar alterações" : "Adicionar cartão"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertCreditCardDialog;
