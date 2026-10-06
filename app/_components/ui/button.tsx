import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/_lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/35",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-white/10 bg-white/[0.03] shadow-sm hover:border-white/20 hover:bg-white/[0.07]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        brand:
          "relative overflow-hidden rounded-full bg-gradient-to-b from-[#19b8d4] to-primary text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(0,151,178,0.6),0_8px_20px_-8px_rgba(0,151,178,0.8)] before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_0_1px_rgba(0,151,178,0.8),0_10px_28px_-8px_rgba(0,151,178,0.95)] hover:before:translate-x-full",
        dangerSoft:
          "rounded-full border border-danger/25 bg-danger/[0.08] text-danger hover:border-danger/45 hover:bg-danger/15",
      },
      size: {
        default: "h-10 rounded-lg px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8",
        icon: "h-9 w-9",
        pill: "h-9 rounded-full pl-1.5 pr-4 text-[13px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const ButtonIconChip = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-inset ring-white/30 [&_svg]:size-3.5",
      className
    )}
    {...props}
  />
);

export { Button, ButtonIconChip, buttonVariants };
