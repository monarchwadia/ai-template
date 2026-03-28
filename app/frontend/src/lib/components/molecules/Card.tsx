import type { ComponentPropsWithoutRef } from "react";

type CardProps = Omit<ComponentPropsWithoutRef<"div">, "className">;

export function Card(props: CardProps) {
  return (
    <div
      className="bg-white p-8 border-l-3 border-brand rounded-sm shadow-sm hover:shadow-md transition-shadow"
      {...props}
    />
  );
}
