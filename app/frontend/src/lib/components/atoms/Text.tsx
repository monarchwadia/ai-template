import type { ComponentPropsWithoutRef } from "react";

type TextProps = {
  as?: "p" | "span";
  size?: "lg" | "md" | "sm" | "xs";
  tone?: "default" | "subtle" | "inverse";
} & Omit<ComponentPropsWithoutRef<"p">, "className">;

const sizes = {
  lg: "text-lg leading-relaxed",
  md: "text-base leading-relaxed",
  sm: "text-sm leading-relaxed",
  xs: "text-xs leading-relaxed",
};

const tones = {
  default: "text-muted",
  subtle: "text-subtle",
  inverse: "text-surface",
};

export function Text({
  as: Tag = "p",
  size = "md",
  tone = "default",
  ...props
}: TextProps) {
  return <Tag className={`${sizes[size]} ${tones[tone]}`} {...props} />;
}
