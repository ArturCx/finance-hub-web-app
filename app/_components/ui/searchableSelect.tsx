"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface SearchableSelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SearchableSelectProps<T extends string>
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "value" | "onChange"
  > {
  options: SearchableSelectOption<T>[];
  value?: T;
  onValueChange: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const SearchableSelectInner = <T extends string>(
  {
    options,
    value,
    onValueChange,
    placeholder = "Selecione...",
    searchPlaceholder = "Pesquisar...",
    emptyText = "Nenhuma opção encontrada.",
    className,
    ...triggerProps
  }: SearchableSelectProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const listRef = React.useRef<HTMLUListElement>(null);
  const listId = React.useId();

  const filtered = React.useMemo(() => {
    const term = normalize(query);
    return term
      ? options.filter((option) => normalize(option.label).includes(term))
      : options;
  }, [options, query]);

  const selected = options.find((option) => option.value === value);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      const selectedIndex = options.findIndex((option) => option.value === value);
      setActiveIndex(Math.max(selectedIndex, 0));
    }
  }, [open, options, value]);

  React.useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, filtered]);

  const select = (option: SearchableSelectOption<T>) => {
    onValueChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) {
        select(option);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 whitespace-nowrap rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm shadow-sm transition-colors hover:border-white/20 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50",
            selected ? "text-white" : "text-muted-foreground",
            className,
          )}
          {...triggerProps}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-[220px] overflow-hidden rounded-xl border-white/10 bg-[#0b1116]/95 p-0 shadow-2xl shadow-black/50 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-3">
          <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            aria-controls={listId}
            aria-activedescendant={
              filtered[activeIndex]
                ? `${listId}-${filtered[activeIndex].value}`
                : undefined
            }
            className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="max-h-64 overflow-y-auto p-1"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </li>
          )}
          {filtered.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${listId}-${option.value}`}
                role="option"
                aria-selected={isSelected}
                data-index={index}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => select(option)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive && "bg-white/[0.07]",
                  isSelected && "font-semibold text-primary",
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <CheckIcon className="h-4 w-4 shrink-0" />}
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export const SearchableSelect = React.forwardRef(SearchableSelectInner) as <
  T extends string,
>(
  props: SearchableSelectProps<T> & {
    ref?: React.ForwardedRef<HTMLButtonElement>;
  },
) => ReturnType<typeof SearchableSelectInner>;
