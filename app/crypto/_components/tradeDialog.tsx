"use client";

import FormDialogHeader from "@/app/_components/formDialogHeader";
import { MoneyInput } from "@/app/_components/moneyInput";
import { OptionCard, OptionCards } from "@/app/_components/optionCards";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { SearchableSelect } from "@/app/_components/ui/searchableSelect";
import { TRANSACTION_PAYMENT_METHOD_OPTIONS } from "@/app/_constants/transactions";
import { cn } from "@/app/_lib/utils";
import { formatCurrency } from "@/app/_utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { CryptoTradeType, TransactionPaymentMethod } from "@prisma/client";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BitcoinIcon,
  Loader2Icon,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";
import { createCryptoTrade } from "../_actions/createCryptoTrade";
import { CoinOption } from "../_data/getCoinOptions";
import { formatQuantity } from "../_lib/format";

const TYPE_OPTIONS: OptionCard<CryptoTradeType>[] = [
  {
    value: CryptoTradeType.BUY,
    label: "Compra",
    icon: ArrowDownLeftIcon,
    activeClassName: "border-sucess/60 bg-sucess/15 text-sucess shadow-sucess/20",
  },
  {
    value: CryptoTradeType.SELL,
    label: "Venda",
    icon: ArrowUpRightIcon,
    activeClassName: "border-danger/60 bg-danger/15 text-danger shadow-danger/20",
  },
];

const formSchema = z.object({
  type: z.nativeEnum(CryptoTradeType),
  coinId: z.string({ required_error: "Escolha a moeda." }).min(1, "Escolha a moeda."),
  quantity: z
    .number({ required_error: "Informe a quantidade." })
    .positive("A quantidade deve ser positiva."),
  price: z
    .number({ required_error: "Informe o preço." })
    .positive("O preço deve ser positivo."),
  date: z.date({ required_error: "A data é obrigatória." }),
  registerTransaction: z.boolean(),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
});

type FormSchema = z.infer<typeof formSchema>;

interface TradeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  coins: CoinOption[];
  holdings: Record<string, number>;
  defaultCoinId?: string;
  defaultType?: CryptoTradeType;
}

const TradeDialog = ({
  isOpen,
  setIsOpen,
  coins,
  holdings,
  defaultCoinId,
  defaultType = CryptoTradeType.BUY,
}: TradeDialogProps) => {
  const form = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (isOpen) {
      const coin = coins.find((option) => option.id === defaultCoinId);
      form.reset({
        type: defaultType,
        coinId: defaultCoinId,
        quantity: undefined,
        price: coin?.price,
        date: new Date(),
        registerTransaction: true,
        paymentMethod: TransactionPaymentMethod.PIX,
      });
    }
  }, [isOpen, defaultCoinId, defaultType, coins, form]);

  const [type, coinId, quantity, price, registerTransaction] = form.watch([
    "type",
    "coinId",
    "quantity",
    "price",
    "registerTransaction",
  ]);
  const isSell = type === CryptoTradeType.SELL;
  const available = coinId ? (holdings[coinId] ?? 0) : 0;
  const total = (quantity ?? 0) * (price ?? 0);

  const coinOptions = useMemo(
    () =>
      coins
        .filter((coin) => !isSell || (holdings[coin.id] ?? 0) > 0)
        .map((coin) => ({ value: coin.id, label: coin.name })),
    [coins, holdings, isSell],
  );

  const onSubmit = async (data: FormSchema) => {
    if (data.type === CryptoTradeType.SELL && data.quantity > available + 1e-10) {
      form.setError("quantity", {
        message: `Você tem ${formatQuantity(available)} disponível.`,
      });
      return;
    }
    try {
      const result = await createCryptoTrade(data);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(isSell ? "Venda registrada!" : "Compra registrada!");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível registrar a operação.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <FormDialogHeader
          icon={<BitcoinIcon />}
          title="Registrar operação"
          description="Compras e vendas compõem o preço médio e o resultado da carteira."
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-5">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <OptionCards
                      aria-label="Tipo da operação"
                      options={TYPE_OPTIONS}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        if (value === CryptoTradeType.SELL && !(holdings[coinId] > 0)) {
                          form.setValue("coinId", "");
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coinId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moeda</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={coinOptions}
                      value={field.value || undefined}
                      onValueChange={(value) => {
                        field.onChange(value);
                        const coin = coins.find((option) => option.id === value);
                        if (coin) {
                          form.setValue("price", coin.price, { shouldValidate: true });
                        }
                      }}
                      placeholder={isSell ? "Selecione uma moeda da carteira..." : "Selecione..."}
                      searchPlaceholder="Pesquisar moeda..."
                      emptyText={isSell ? "Nenhuma moeda na carteira." : undefined}
                    />
                  </FormControl>
                  {isSell && coinId && (
                    <FormDescription>
                      Disponível: {formatQuantity(available)}{" "}
                      <button
                        type="button"
                        className="font-semibold text-primary hover:underline"
                        onClick={() =>
                          form.setValue("quantity", available, { shouldValidate: true })
                        }
                      >
                        Vender tudo
                      </button>
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <NumericFormat
                        customInput={Input}
                        placeholder="0,00"
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={10}
                        allowNegative={false}
                        inputMode="decimal"
                        value={field.value ?? ""}
                        onValueChange={({ floatValue }) => field.onChange(floatValue)}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço por unidade</FormLabel>
                    <FormControl>
                      <MoneyInput
                        placeholder="R$ 0,00"
                        decimalScale={8}
                        value={field.value ?? ""}
                        onValueChange={({ floatValue }) => field.onChange(floatValue)}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <span className="text-sm text-muted-foreground">Total da operação</span>
              <span className="text-lg font-bold tabular-nums">{formatCurrency(total)}</span>
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div
              className={cn(
                "space-y-4 rounded-xl border p-4 transition-colors",
                registerTransaction
                  ? "border-primary/25 bg-primary/[0.05]"
                  : "border-white/[0.06] bg-white/[0.02]",
              )}
            >
              <FormField
                control={form.control}
                name="registerTransaction"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={field.value ?? false}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#0097b2]"
                    />
                    <span>
                      <span className="block text-sm font-semibold">
                        Lançar também em Transações
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {isSell
                          ? "Cria um depósito com o valor recebido na venda."
                          : "Cria um investimento com o valor da compra (conta para a meta)."}
                      </span>
                    </span>
                  </label>
                )}
              />
              {registerTransaction && (
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isSell ? "Recebido via" : "Pago com"}</FormLabel>
                      <FormControl>
                        <SearchableSelect
                          options={TRANSACTION_PAYMENT_METHOD_OPTIONS}
                          value={field.value}
                          onValueChange={field.onChange}
                          searchPlaceholder="Pesquisar método..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
                {isSell ? "Registrar venda" : "Registrar compra"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TradeDialog;
