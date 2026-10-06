import { cn } from "@/app/_lib/utils";

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("animate-pulse rounded-xl bg-white/[0.05]", className)}
    {...props}
  />
);

export { Skeleton };
