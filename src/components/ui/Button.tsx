"use client";

import type { ButtonHTMLAttributes } from "react";
import { ACCENT, type Accent } from "./tone";
import Spinner from "./Spinner";

type Variant = "solid" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  accent: Accent;
  variant?: Variant;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export default function Button({
  accent,
  variant = "solid",
  loading = false,
  loadingText,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const a = ACCENT[accent];

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium " +
    "transition-all duration-200 ease-smooth active:scale-[0.98] " +
    "disabled:opacity-55 disabled:pointer-events-none disabled:active:scale-100 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0";

  const variantClass =
    variant === "solid"
      ? `${a.solid} ${a.solidText} shadow-lg shadow-black/25 hover:shadow-xl hover:-translate-y-0.5`
      : variant === "outline"
        ? `border ${a.borderStrong} ${a.bgSoft} ${a.text} ${a.bgSoftHover} hover:-translate-y-0.5`
        : `${a.text} hover:opacity-75`;

  return (
    <button
      className={`${base} ${variantClass} ${a.ring} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner />}
      <span>{loading && loadingText ? loadingText : children}</span>
    </button>
  );
}
