import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { MoneyInput } from "./moneyInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  BILL_CATEGORY_OPTIONS,
  BILL_PAYMENT_METHOD_OPTIONS,
} from "../_constants/bills";
import { DatePicker } from "./ui/datePicker";
import { z } from "zod";
import { BillStatus, BillCategory, BillPaymentMethod } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertBill } from "../_actions/upsertBill";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  Loader2Icon,
  ReceiptTextIcon,
} from "lucide-react";
import { toast } from "sonner";
import FormDialogHeader from "./formDialogHeader";
import { OptionCard, OptionCards } from "./optionCards";

const STATUS_OPTIONS: OptionCard<BillStatus>[] = [
  {
    value: BillStatus.PAYABLE,
    label: "Aberta",
    icon: CircleDashedIcon,
    activeClassName: "border-white/50 bg-white/10 text-white shadow-white/10",
  },
  {
    value: BillStatus.PAID,
    label: "Paga",
    icon: CheckCircle2Icon,
    activeClassName:
      "border-primary/60 bg-primary/15 text-primary shadow-primary/20",
  },
  {
    value: BillStatus.EXPIRED,
    label: "Vencida",
    icon: AlertCircleIcon,
    activeClassName:
      "border-danger/60 bg-danger/15 text-danger shadow-danger/20",
  },
];

interface UpsertBillDialogProps {
  isOpen: boolean;
  defaultValues?: FormSchema;
  billId?: string;
  setIsOpen: (isOpen: boolean) => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório.",
  }),
  amount: z
    .number({
      required_error: "O valor é obrigatório.",
    })
    .positive({
      message: "O valor deve ser positivo.",
    }),
  status: z.nativeEnum(BillStatus, {
    required_error: "O status é obrigatório.",
  }),
  category: z.nativeEnum(BillCategory, {
    required_error: "A categoria é obrigatória.",
  }),
  paymentMethod: z.nativeEnum(BillPaymentMethod, {
    required_error: "O método de pagamento é obrigatório.",
  }),
  expireDate: z.date({
    required_error: "A data de vencimento é obrigatória.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const UpsertBillDialog = ({
  isOpen,
  defaultValues,
  billId,
  setIsOpen,
}: UpsertBillDialogProps) => {
  const formDefaultValues: Partial<FormSchema> = defaultValues ?? {
    amount: undefined,
    category: undefined,
    expireDate: new Date(),
    name: "",
    paymentMethod: undefined,
    status: undefined,
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const isUpdate = Boolean(billId);

  const onSubmit = async (data: FormSchema) => {
    try {
      await upsertBill({ ...data, id: billId });
      toast.success(isUpdate ? "Conta atualizada!" : "Conta adicionada!");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar a conta.");
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
          icon={<ReceiptTextIcon />}
          title={isUpdate ? "Editar conta" : "Nova conta"}
          description="Cadastre uma conta para acompanhar o vencimento."
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative space-y-5"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <OptionCards
                      aria-label="Status da conta"
                      options={STATUS_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <MoneyInput
                      placeholder="R$ 0,00"
                      className="h-14 text-2xl font-bold tabular-nums md:text-2xl"
                      value={field.value}
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Conta de luz, aluguel..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className={
                            field.value ? "text-white" : "text-muted-foreground"
                          }
                        >
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BILL_CATEGORY_OPTIONS.map((option) => (
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
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de pagamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className={
                            field.value ? "text-white" : "text-muted-foreground"
                          }
                        >
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BILL_PAYMENT_METHOD_OPTIONS.map((option) => (
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
            </div>
            <FormField
              control={form.control}
              name="expireDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de vencimento</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
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
                {isUpdate ? "Salvar alterações" : "Adicionar conta"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertBillDialog;
