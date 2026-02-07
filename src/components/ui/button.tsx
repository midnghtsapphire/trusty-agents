import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-[0_0_30px_hsl(350_80%_55%/0.5)]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-[0_0_25px_hsl(320_40%_30%/0.4)]",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Magic themed variants - INTENSE GLOW
        magic: "bg-magic text-magic-foreground hover:bg-magic/90 shadow-[0_0_30px_hsl(280_60%_55%/0.5)] hover:shadow-[0_0_50px_hsl(280_60%_55%/0.7),0_0_80px_hsl(280_60%_55%/0.4)] font-bold tracking-wide",
        magicOutline: "border-2 border-magic/50 bg-transparent text-magic hover:bg-magic/15 hover:border-magic shadow-[0_0_20px_hsl(280_60%_55%/0.3)] hover:shadow-[0_0_40px_hsl(280_60%_55%/0.5)]",
        sparkle: "bg-sparkle text-sparkle-foreground hover:bg-sparkle/90 shadow-[0_0_30px_hsl(40_95%_55%/0.5)] hover:shadow-[0_0_50px_hsl(40_95%_55%/0.7),0_0_80px_hsl(40_95%_55%/0.4)] font-bold",
        glass: "glass-card text-foreground hover:bg-card/90 shadow-[0_0_20px_hsl(280_60%_55%/0.2)] hover:shadow-[0_0_40px_hsl(280_60%_55%/0.4),0_0_60px_hsl(40_95%_55%/0.2)]",
        poof: "bg-gradient-to-r from-magic via-magic/80 to-sparkle text-white font-bold shadow-[0_0_40px_hsl(280_60%_55%/0.5),0_0_60px_hsl(40_95%_55%/0.3)] hover:shadow-[0_0_60px_hsl(280_60%_55%/0.7),0_0_100px_hsl(40_95%_55%/0.5)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
