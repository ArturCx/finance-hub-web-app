import { Button } from "@/app/_components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface MarketPaginationProps {
  page: number;
  totalPages: number;
  query?: string;
}

const MarketPagination = ({ page, totalPages, query }: MarketPaginationProps) => {
  if (totalPages <= 1) return null;
  const href = (target: number) => {
    const params = new URLSearchParams({ tab: "mercado", page: String(target) });
    if (query) params.set("q", query);
    return `/crypto?${params.toString()}`;
  };
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="rounded-full" asChild disabled={page <= 1}>
          <Link
            href={href(Math.max(page - 1, 1))}
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            scroll={false}
          >
            <ChevronLeftIcon /> Anterior
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link
            href={href(Math.min(page + 1, totalPages))}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
            scroll={false}
          >
            Próxima <ChevronRightIcon />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MarketPagination;
