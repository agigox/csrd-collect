"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-md border-none cursor-pointer text-sm font-medium transition-all duration-150";

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    ghost: "bg-transparent text-sidebar-text hover:bg-sidebar-hover",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
}
