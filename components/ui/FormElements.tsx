import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, leftIcon, rightIcon, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                        {label}
                        {props.required && <span className="text-red-400">*</span>}
                    </label>
                )}
                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            `w-full h-10 rounded-lg bg-white/5 border border-white/10
               px-3 text-sm text-white placeholder:text-zinc-600
               transition-all duration-200
               hover:border-white/20 hover:bg-white/[0.07]
               focus:outline-none focus:border-[#0084FF] focus:bg-white/[0.07]
               focus:ring-2 focus:ring-[#0084FF]/20
               disabled:opacity-50 disabled:cursor-not-allowed`,
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {(error || hint) && (
                    <p className={cn("text-xs", error ? "text-red-400" : "text-zinc-500")}>
                        {error || hint}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

// --- Textarea Component ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, hint, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                        {label}
                        {props.required && <span className="text-red-400">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        `w-full min-h-[100px] rounded-lg bg-white/5 border border-white/10
             px-3 py-2.5 text-sm text-white placeholder:text-zinc-600
             transition-all duration-200 resize-none
             hover:border-white/20 hover:bg-white/[0.07]
             focus:outline-none focus:border-[#0084FF] focus:bg-white/[0.07]
             focus:ring-2 focus:ring-[#0084FF]/20
             disabled:opacity-50 disabled:cursor-not-allowed`,
                        error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
                        className
                    )}
                    {...props}
                />
                {(error || hint) && (
                    <p className={cn("text-xs", error ? "text-red-400" : "text-zinc-500")}>
                        {error || hint}
                    </p>
                )}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

// --- Select Component ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[] | string[];
    error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, options, error, ...props }, ref) => {
        const normalizedOptions = options.map((opt) =>
            typeof opt === "string" ? { value: opt, label: opt } : opt
        );

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-xs font-medium text-zinc-400">{label}</label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={cn(
                            `w-full h-10 rounded-lg bg-white/5 border border-white/10
               px-3 pr-10 text-sm text-white appearance-none cursor-pointer
               transition-all duration-200
               hover:border-white/20 hover:bg-white/[0.07]
               focus:outline-none focus:border-[#0084FF] focus:bg-white/[0.07]
               focus:ring-2 focus:ring-[#0084FF]/20`,
                            error && "border-red-500/50",
                            className
                        )}
                        {...props}
                    >
                        {normalizedOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#1a1a1a]">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }
);
Select.displayName = "Select";

// --- Card Component ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "gradient" | "bordered";
    hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", hover = false, children, ...props }, ref) => {
        const variants = {
            default: "bg-[#141414] border border-white/5",
            glass: "bg-white/5 backdrop-blur-xl border border-white/10",
            gradient: "bg-gradient-to-br from-white/10 to-white/5 border border-white/10",
            bordered: "bg-transparent border border-white/10",
        };

        return (
            <motion.div
                ref={ref}
                className={cn(
                    "rounded-xl overflow-hidden",
                    variants[variant],
                    hover && "transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-black/20",
                    className
                )}
                whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Card.displayName = "Card";

// --- Badge Component ---
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "primary" | "success" | "warning" | "error" | "outline";
    size?: "sm" | "default";
}

export const Badge: React.FC<BadgeProps> = ({
    className,
    variant = "default",
    size = "default",
    children,
    ...props
}) => {
    const variants = {
        default: "bg-white/10 text-zinc-300",
        primary: "bg-[#0084FF]/20 text-[#0084FF]",
        success: "bg-emerald-500/20 text-emerald-400",
        warning: "bg-amber-500/20 text-amber-400",
        error: "bg-red-500/20 text-red-400",
        outline: "border border-white/20 text-zinc-400",
    };

    const sizes = {
        sm: "text-[10px] px-1.5 py-0.5",
        default: "text-xs px-2 py-1",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md font-medium uppercase tracking-wide",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

// --- Separator ---
export const Separator: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn("h-px w-full bg-white/5", className)} />
);

// --- Skeleton Loader ---
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div
        className={cn(
            "animate-pulse rounded-lg bg-white/5",
            className
        )}
    />
);

// --- Avatar ---
interface AvatarProps {
    src?: string;
    fallback: string;
    size?: "sm" | "default" | "lg";
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, fallback, size = "default", className }) => {
    const sizes = {
        sm: "w-7 h-7 text-[10px]",
        default: "w-9 h-9 text-xs",
        lg: "w-12 h-12 text-sm",
    };

    return (
        <div
            className={cn(
                "rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-medium text-white overflow-hidden",
                sizes[size],
                className
            )}
        >
            {src ? (
                <img src={src} alt={fallback} className="w-full h-full object-cover" />
            ) : (
                fallback.slice(0, 2).toUpperCase()
            )}
        </div>
    );
};

// --- Tooltip Wrapper ---
interface TooltipProps {
    children: React.ReactNode;
    content: string;
    side?: "top" | "bottom" | "left" | "right";
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, side = "top" }) => {
    return (
        <div className="group relative inline-flex">
            {children}
            <div
                className={cn(
                    "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-zinc-900 rounded-md shadow-lg",
                    "opacity-0 scale-95 pointer-events-none transition-all duration-150",
                    "group-hover:opacity-100 group-hover:scale-100",
                    side === "top" && "bottom-full mb-2 left-1/2 -translate-x-1/2",
                    side === "bottom" && "top-full mt-2 left-1/2 -translate-x-1/2",
                    side === "left" && "right-full mr-2 top-1/2 -translate-y-1/2",
                    side === "right" && "left-full ml-2 top-1/2 -translate-y-1/2"
                )}
            >
                {content}
            </div>
        </div>
    );
};
