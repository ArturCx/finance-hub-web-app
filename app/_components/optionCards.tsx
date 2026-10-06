"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "../_lib/utils";

export interface OptionCard<T extends string> {
  value: T;
  label: string;
  icon: LucideIcon;
  activeClassName: string;
}

interface OptionCardsProps<T extends string> {
  options: OptionCard<T>[];
  value?: T;
  onChange: (value: T) => void;
  "aria-label": string;
}

export const OptionCards = <T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: OptionCardsProps<T>) => {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map(({ value: optionValue, label, icon: Icon, activeClassName }) => {
        const isActive = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(optionValue)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:text-sm",
              isActive
                ? cn("scale-[1.02] shadow-lg", activeClassName)
                : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:bg-white/[0.05] hover:text-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        );
      })}
    </div>
  );
};
