"use client";

import { Button, ButtonProps } from "@/app/_components/ui/button";
import { CryptoTradeType } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { CoinOption } from "../_data/getCoinOptions";
import TradeDialog from "./tradeDialog";

interface AddTradeButtonProps extends ButtonProps {
  coins: CoinOption[];
  holdings: Record<string, number>;
  defaultCoinId?: string;
  defaultType?: CryptoTradeType;
  label?: string;
}

const AddTradeButton = ({
  coins,
  holdings,
  defaultCoinId,
  defaultType,
  label = "Registrar operação",
  className,
  ...buttonProps
}: AddTradeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        className={className ?? "rounded-full font-bold"}
        onClick={() => setIsOpen(true)}
        {...buttonProps}
      >
        <PlusIcon />
        {label}
      </Button>
      <TradeDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        coins={coins}
        holdings={holdings}
        defaultCoinId={defaultCoinId}
        defaultType={defaultType}
      />
    </>
  );
};

export default AddTradeButton;
