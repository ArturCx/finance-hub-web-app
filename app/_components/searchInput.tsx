"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { cn } from "../_lib/utils";
import { Input } from "./ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "Pesquisar...",
  className,
}: SearchInputProps) => (
  <div className={cn("relative w-full sm:w-80", className)}>
    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Escape") onChange("");
      }}
      placeholder={placeholder}
      aria-label={placeholder}
      className="h-9 rounded-full pl-9 pr-9"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        aria-label="Limpar pesquisa"
        className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
      >
        <XIcon className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

export default SearchInput;
