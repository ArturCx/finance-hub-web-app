import { ReactNode } from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface FormDialogHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FormDialogHeader = ({
  icon,
  title,
  description,
}: FormDialogHeaderProps) => {
  return (
    <DialogHeader className="items-center gap-1 text-center sm:items-start sm:text-left">
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-primary shadow-lg shadow-primary/20 [&_svg]:size-5">
        {icon}
      </div>
      <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
  );
};

export default FormDialogHeader;
