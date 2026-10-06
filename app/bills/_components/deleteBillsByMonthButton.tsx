"use client";

import { useTransition } from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/_components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { deleteBillsByMonth } from "../_actions/deleteBillsByMonth";

interface DeleteBillsByMonthButtonProps {
  month: string;
  year: string;
  totalCount: number;
}

const DeleteBillsByMonthButton = ({
  month,
  year,
  totalCount,
}: DeleteBillsByMonthButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleConfirmDeleteClick = () => {
    startTransition(async () => {
      try {
        const result = await deleteBillsByMonth({ month, year });
        toast.success(
          result.deletedCount > 0
            ? `${result.deletedCount} conta(s) excluída(s) com sucesso.`
            : "Nenhuma conta encontrada para excluir neste período."
        );
      } catch (error) {
        console.error(error);
        toast.error("Ocorreu um erro ao excluir as contas do período.");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="dangerSoft"
          size="sm"
          className="h-9 gap-2 rounded-full px-3.5 text-[13px]"
          disabled={isPending || totalCount === 0}
        >
          <Trash2Icon />
          <span>Limpar mês</span>
          {totalCount > 0 && (
            <span className="rounded-full bg-danger/20 px-1.5 py-px text-[11px] tabular-nums">
              {totalCount}
            </span>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deseja excluir em massa as contas de {month}/{year}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação apagará {totalCount} registro(s) da tabela e não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDeleteClick}
            className="bg-danger text-white hover:bg-danger/90"
          >
            {isPending ? "Excluindo..." : "Confirmar exclusão"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBillsByMonthButton;
