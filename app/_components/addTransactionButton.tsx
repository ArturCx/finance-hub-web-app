"use client";

import { PlusIcon } from "lucide-react";
import { Button, ButtonIconChip } from "./ui/button";
import { useState } from "react";
import UpsertTransactionDialog from "./upsertTransactionDialog";

const AddTransactionButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button variant="brand" size="pill" onClick={() => setDialogIsOpen(true)}>
        <ButtonIconChip>
          <PlusIcon />
        </ButtonIconChip>
        <span className="hidden sm:inline">Nova transação</span>
        <span className="sm:hidden">Nova</span>
      </Button>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddTransactionButton;
