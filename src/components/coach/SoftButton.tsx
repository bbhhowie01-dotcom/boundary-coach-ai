"use client";

import type { ReactNode } from "react";

type SoftButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "ghost";
  className?: string;
};

export function SoftButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
}: SoftButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold tracking-wide transition duration-300 disabled:cursor-not-allowed disabled:opacity-45";

  const styles =
    variant === "primary"
      ? "bg-soft-blue-deep text-white shadow-[0_10px_30px_-12px_rgba(143,173,196,0.8)] hover:bg-[#7f9fb8] active:scale-[0.98]"
      : "bg-transparent text-warm-gray hover:bg-mist/80 hover:text-warm-ink";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
