"use client";

import { Button, ButtonIconChip } from "@/app/_components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import UpsertCreditCardDialog from "./upsertCreditCardDialog";

const AddCreditCardButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button variant="brand" size="pill" onClick={() => setDialogIsOpen(true)}>
        <ButtonIconChip>
          <PlusIcon />
        </ButtonIconChip>
        <span className="hidden sm:inline">Novo cartão</span>
        <span className="sm:hidden">Novo</span>
      </Button>
      <UpsertCreditCardDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddCreditCardButton;
