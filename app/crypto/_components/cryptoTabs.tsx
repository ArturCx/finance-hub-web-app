import { cn } from "@/app/_lib/utils";
import { CalculatorIcon, LineChartIcon, WalletIcon } from "lucide-react";
import Link from "next/link";

export const CRYPTO_TABS = [
  { value: "carteira", label: "Minha carteira", icon: WalletIcon },
  { value: "mercado", label: "Mercado", icon: LineChartIcon },
  { value: "simulador", label: "Simulador", icon: CalculatorIcon },
] as const;

export type CryptoTab = (typeof CRYPTO_TABS)[number]["value"];

export const parseCryptoTab = (value?: string): CryptoTab =>
  CRYPTO_TABS.some((tab) => tab.value === value) ? (value as CryptoTab) : "carteira";

const CryptoTabs = ({ active }: { active: CryptoTab }) => (
  <nav
    aria-label="Seções de cripto"
    className="flex w-full gap-1 overflow-x-auto rounded-full border border-white/[0.06] bg-white/[0.02] p-1 sm:w-fit"
  >
    {CRYPTO_TABS.map(({ value, label, icon: Icon }) => (
      <Link
        key={value}
        href={`/crypto?tab=${value}`}
        aria-current={active === value ? "page" : undefined}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-all sm:flex-none",
          active === value
            ? "bg-primary/15 font-bold text-primary ring-1 ring-primary/30"
            : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    ))}
  </nav>
);

export default CryptoTabs;
