/* eslint-disable @next/next/no-img-element */
import { cn } from "@/app/_lib/utils";

interface CoinAvatarProps {
  image: string;
  name: string;
  className?: string;
}

const CoinAvatar = ({ image, name, className }: CoinAvatarProps) => (
  <img
    src={image}
    alt={name}
    loading="lazy"
    className={cn("h-8 w-8 shrink-0 rounded-full bg-white/5", className)}
  />
);

export default CoinAvatar;
