import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    // Base styles - Figma-inspired
    `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium 
   transition-all duration-200 ease-out
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]
   disabled:pointer-events-none disabled:opacity-50
   active:scale-[0.98] select-none`,
    {
        variants: {
            variant: {
                // Primary - Figma blue gradient with glow
                primary: `bg-gradient-to-b from-[#0084FF] to-[#0066CC] text-white 
                  shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]
                  hover:from-[#1a8fff] hover:to-[#0077ee]
                  focus-visible:ring-[#0084FF]`,

                // Secondary - Glass morphism style
                secondary: `bg-white/5 text-white border border-white/10
                    backdrop-blur-xl
                    hover:bg-white/10 hover:border-white/20
                    focus-visible:ring-white/20`,

                // Outline - Linear style
                outline: `border border-white/15 bg-transparent text-white
                  hover:bg-white/5 hover:border-white/25
                  focus-visible:ring-white/20`,

                // Ghost - Minimal
                ghost: `text-zinc-400 hover:text-white hover:bg-white/5
                focus-visible:ring-white/10`,

                // Destructive
                destructive: `bg-gradient-to-b from-red-500 to-red-600 text-white
                      shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]
                      hover:from-red-400 hover:to-red-500
                      focus-visible:ring-red-500`,

                // Success
                success: `bg-gradient-to-b from-emerald-500 to-emerald-600 text-white
                  shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]
                  hover:from-emerald-400 hover:to-emerald-500
                  focus-visible:ring-emerald-500`,

                // Premium - Vercel style dark
                premium: `bg-white text-black font-semibold
                  shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                  hover:bg-zinc-100
                  focus-visible:ring-white`,

                // Glow - Creative with animated glow
                glow: `bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white
               shadow-[0_0_20px_rgba(139,92,246,0.5)]
               hover:shadow-[0_0_30px_rgba(139,92,246,0.7)]
               focus-visible:ring-purple-500`,
            },
            size: {
                xs: "h-7 px-2.5 text-xs rounded-md",
                sm: "h-8 px-3 text-xs",
                default: "h-9 px-4 text-sm",
                md: "h-10 px-5 text-sm",
                lg: "h-11 px-6 text-base",
                xl: "h-12 px-8 text-base font-semibold",
                icon: "h-9 w-9 p-0",
                "icon-sm": "h-8 w-8 p-0",
                "icon-lg": "h-10 w-10 p-0",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
    children?: React.ReactNode;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
        return (
            <motion.button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                {...props}
            >
                {isLoading ? (
                    <motion.div
                        className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                ) : leftIcon ? (
                    <span className="shrink-0">{leftIcon}</span>
                ) : null}
                {children}
                {rightIcon && !isLoading && <span className="shrink-0">{rightIcon}</span>}
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
