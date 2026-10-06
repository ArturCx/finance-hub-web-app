"use client";

import { Button, ButtonIconChip, ButtonProps } from "@/app/_components/ui/button";
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
  variant,
  ...buttonProps
}: AddTradeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isBrand = !variant;
  return (
    <>
      <Button
        variant={variant ?? "brand"}
        size={isBrand ? "pill" : undefined}
        className={className}
        onClick={() => setIsOpen(true)}
        {...buttonProps}
      >
        {isBrand ? (
          <ButtonIconChip>
            <PlusIcon />
          </ButtonIconChip>
        ) : (
          <PlusIcon />
        )}
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
