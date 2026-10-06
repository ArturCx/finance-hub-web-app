"use client";

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
import { Button } from "@/app/_components/ui/button";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteCryptoTrade } from "../_actions/deleteCryptoTrade";

interface DeleteTradeButtonProps {
  tradeId: string;
  hasTransaction: boolean;
}

const DeleteTradeButton = ({ tradeId, hasTransaction }: DeleteTradeButtonProps) => {
  const handleConfirm = async () => {
    try {
      const result = await deleteCryptoTrade({ tradeId });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Operação removida.");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível remover a operação.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-danger"
          aria-label="Remover operação"
        >
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover esta operação?</AlertDialogTitle>
          <AlertDialogDescription>
            O preço médio e o resultado da carteira serão recalculados.
            {hasTransaction &&
              " A transação lançada junto com ela também será removida."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Remover</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTradeButton;
