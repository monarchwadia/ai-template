import type { ComponentPropsWithoutRef } from "react";

type LabelProps = {
  as?: "span" | "div";
  size?: "sm" | "md" | "lg";
} & Omit<ComponentPropsWithoutRef<"span">, "className">;

const sizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function Label({ as: Tag = "span", size = "sm", ...props }: LabelProps) {
  return (
    <Tag
      className={`font-sans font-semibold text-brand ${sizes[size]} uppercase tracking-wide`}
      {...props}
    />
  );
}
