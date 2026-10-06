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
import { deleteCreditCard } from "../_actions/deleteCreditCard";

interface DeleteCreditCardButtonProps {
  creditCardId: string;
  name: string;
}

const DeleteCreditCardButton = ({
  creditCardId,
  name,
}: DeleteCreditCardButtonProps) => {
  const handleConfirmDeleteClick = async () => {
    try {
      await deleteCreditCard({ creditCardId });
      toast.success("Cartão removido!");
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao remover o cartão.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-danger"
          aria-label={`Remover ${name}`}
        >
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover o cartão {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            O cartão e o histórico de pagamentos da fatura serão apagados. As
            despesas já lançadas em Transações continuam lá.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDeleteClick}>
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCreditCardButton;
