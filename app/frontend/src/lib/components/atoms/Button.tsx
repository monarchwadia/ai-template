import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary";
} & Omit<ComponentPropsWithoutRef<"a">, "className">;

const base =
  "inline-block px-6 py-3 rounded-sm font-sans text-sm font-medium transition-colors cursor-pointer";

const variants = {
  primary: "bg-brand text-white border border-brand hover:bg-brand-dark",
  secondary:
    "bg-transparent text-brand border border-brand hover:bg-surface-alt",
};

export function Button({ variant = "primary", ...props }: ButtonProps) {
  return <a className={`${base} ${variants[variant]}`} {...props} />;
}
