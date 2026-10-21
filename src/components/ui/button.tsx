import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// shadcn/ui Button, restyled for the day-to-night sky: pill-shaped,
// ink, gradient or frosted-glass surfaces, and a gentle press-down.

const buttonVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Deep ink pill — the main action on the daytime sky.
        default:
          "bg-ink text-white shadow-float hover:-translate-y-0.5 hover:bg-ink-soft",
        // Sky-to-lilac gradient — the main action at night.
        dream:
          "bg-linear-to-r from-sky-light via-sky to-lilac text-midnight shadow-glow hover:-translate-y-0.5 hover:brightness-110",
        glass: "glass text-ink hover:-translate-y-0.5 hover:bg-white/70",
        "glass-night":
          "glass-night text-starlight hover:-translate-y-0.5 hover:bg-white/15",
        ghost: "text-current hover:bg-white/20",
        link: "text-current underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-sm",
        lg: "h-13 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
