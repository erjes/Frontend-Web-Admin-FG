"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export type FinancialState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "loading"
  | "error"
  | "success";

const financialButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-150 focus-visible:outline-none disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        default:
          "bg-lumatrix-navyDeep text-white shadow-sm hover:bg-lumatrix-primary hover:shadow-md active:translate-y-[1px] active:bg-lumatrix-primaryActive",
        primary:
          "bg-lumatrix-primary text-white shadow-sm hover:bg-lumatrix-primaryHover hover:shadow-md active:translate-y-[1px] active:bg-lumatrix-primaryActive",
        outline:
          "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 active:translate-y-[1px]",
        secondary:
          "bg-slate-100 text-slate-800 shadow-sm hover:bg-slate-200 active:translate-y-[1px]",
        ghost:
          "bg-transparent text-slate-700 hover:bg-slate-100 active:translate-y-[1px]",
      },
      financialState: {
        default: "",
        hover: "bg-lumatrix-primary text-white shadow-md",
        focus: "ring-2 ring-lumatrix-cyanAccent ring-offset-2",
        active: "translate-y-[1px]",
        disabled: "bg-slate-300 text-slate-500 cursor-not-allowed opacity-50",
        loading: "cursor-wait opacity-90",
        error: "bg-rose-600 text-white shadow-sm ring-1 ring-rose-400",
        success: "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      financialState: "default",
      size: "default",
    },
  }
);

export interface FinancialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof financialButtonVariants> {
  financialState?: FinancialState;
  variant?: "default" | "primary" | "outline" | "secondary" | "ghost";
  loadingText?: string;
  successText?: string;
  errorText?: string;
}

export const FinancialButton = React.forwardRef<HTMLButtonElement, FinancialButtonProps>(
  (
    {
      className,
      children,
      variant = "default",
      financialState = "default",
      size,
      disabled,
      loadingText = "Memproses Transaksi...",
      successText = "Transaksi Terverifikasi (SHA-256)",
      errorText = "Gagal Mengeksekusi",
      ...props
    },
    ref
  ) => {
    const isActuallyDisabled = disabled || financialState === "disabled" || financialState === "loading";

    return (
      <button
        ref={ref}
        disabled={isActuallyDisabled}
        className={cn(financialButtonVariants({ variant, financialState, size, className }))}
        {...props}
      >
        {financialState === "loading" && (
          <span className="inline-flex items-center justify-center gap-1.5 leading-none">
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            <span className="truncate">{loadingText}</span>
          </span>
        )}
        {financialState === "success" && (
          <span className="inline-flex items-center justify-center gap-1.5 leading-none">
            <CheckCircle2 className="h-4 w-4 text-emerald-200 shrink-0" />
            <span className="truncate">{successText}</span>
          </span>
        )}
        {financialState === "error" && (
          <span className="inline-flex items-center justify-center gap-1.5 leading-none">
            <AlertCircle className="h-4 w-4 text-rose-200 shrink-0" />
            <span className="truncate">{errorText}</span>
          </span>
        )}
        {financialState !== "loading" &&
          financialState !== "success" &&
          financialState !== "error" && (
            <span className="inline-flex items-center justify-center gap-1.5 max-w-full leading-none [&>svg]:shrink-0 [&>svg]:inline-block">
              {children}
            </span>
          )}
      </button>
    );
  }
);

FinancialButton.displayName = "FinancialButton";
