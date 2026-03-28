import type { ComponentPropsWithoutRef } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = {
  as?: HeadingLevel;
  size?: "display" | "xl" | "lg" | "md" | "sm";
  tone?: "default" | "inverse";
} & Omit<ComponentPropsWithoutRef<"h1">, "className">;

const sizes = {
  display: "text-3xl md:text-5xl leading-tight",
  xl: "text-3xl leading-snug",
  lg: "text-xl",
  md: "text-lg",
  sm: "text-sm font-sans",
};

const tones = {
  default: "text-dark",
  inverse: "text-white",
};

export function Heading({
  as: Tag = "h2",
  size = "md",
  tone = "default",
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={`font-serif font-semibold ${sizes[size]} ${tones[tone]}`}
      {...props}
    />
  );
}
