import type { ReactNode } from "react";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";

interface TakeawayProps {
  children: ReactNode;
}

export function Takeaway({ children }: TakeawayProps) {
  return (
    <section className="bg-surface-alt rounded-sm p-8 mb-10">
      <div className="mb-3">
        <Heading as="h2">The Takeaway</Heading>
      </div>
      <Text size="lg">{children}</Text>
    </section>
  );
}
