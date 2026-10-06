"use client";

import { Button } from "@/app/_components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import UpsertCreditCardDialog from "./upsertCreditCardDialog";

const AddCreditCardButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        className="rounded-full font-bold"
        onClick={() => setDialogIsOpen(true)}
      >
        <PlusIcon />
        <span className="hidden sm:inline">Adicionar cartão</span>
        <span className="sm:hidden">Adicionar</span>
      </Button>
      <UpsertCreditCardDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddCreditCardButton;
