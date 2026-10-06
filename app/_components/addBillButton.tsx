"use client";

import { PlusIcon } from "lucide-react";
import { Button, ButtonIconChip } from "./ui/button";
import { useState } from "react";
import UpsertBillDialog from "./upsertBillDialog";

const AddBillButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button variant="brand" size="pill" onClick={() => setDialogIsOpen(true)}>
        <ButtonIconChip>
          <PlusIcon />
        </ButtonIconChip>
        <span className="hidden sm:inline">Nova conta</span>
        <span className="sm:hidden">Nova</span>
      </Button>
      <UpsertBillDialog isOpen={dialogIsOpen} setIsOpen={setDialogIsOpen} />
    </>
  );
};

export default AddBillButton;
