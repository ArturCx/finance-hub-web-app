import { cn } from "@/app/_lib/utils";

interface CreditCardVisualProps {
  name: string;
  color: string;
  dueDay?: number;
  className?: string;
}

const CreditCardVisual = ({
  name,
  color,
  dueDay,
  className,
}: CreditCardVisualProps) => {
  return (
    <div
      className={cn(
        "relative aspect-[1.586] w-full overflow-hidden rounded-2xl p-4 text-white shadow-2xl shadow-black/40 ring-1 ring-white/15",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 45%, #0b1116 120%)`,
      }}
    >
      <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/15 blur-sm" />
      <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-black/20" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.18)_50%,transparent_60%)]" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="max-w-[75%] truncate text-sm font-bold tracking-wide drop-shadow">
            {name || "Meu cartão"}
          </span>
          <div className="flex -space-x-2">
            <span className="h-6 w-6 rounded-full bg-white/70" />
            <span className="h-6 w-6 rounded-full bg-white/40" />
          </div>
        </div>
        <div className="h-7 w-10 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-inner" />
        <div className="flex items-end justify-between text-[11px] font-medium text-white/80">
          <span className="tracking-[0.3em]">•••• ••••</span>
          {dueDay && <span>Vence dia {dueDay}</span>}
        </div>
      </div>
    </div>
  );
};

export default CreditCardVisual;
