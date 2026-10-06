"use client";

import { cn } from "@/app/_lib/utils";
import { StarIcon } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { toggleCryptoFavorite } from "../_actions/toggleCryptoFavorite";

interface FavoriteButtonProps {
  coinId: string;
  coinName: string;
  isFavorite: boolean;
  className?: string;
}

const FavoriteButton = ({ coinId, coinName, isFavorite, className }: FavoriteButtonProps) => {
  const [, startTransition] = useTransition();
  const [favorite, setOptimisticFavorite] = useOptimistic(isFavorite);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const next = !favorite;
    startTransition(async () => {
      setOptimisticFavorite(next);
      try {
        await toggleCryptoFavorite({ coinId, favorite: next });
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível atualizar os favoritos.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={favorite}
      aria-label={favorite ? `Remover ${coinName} dos favoritos` : `Favoritar ${coinName}`}
      className={cn(
        "rounded-full p-1.5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        className,
      )}
    >
      <StarIcon
        className={cn(
          "h-4 w-4 transition-all",
          favorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground",
        )}
      />
    </button>
  );
};

export default FavoriteButton;
