interface SectionHeadingProps {
  children: React.ReactNode;
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="font-serif font-semibold text-dark text-4xl border-b-2 border-brand pb-4">
      {children}
    </h2>
  );
}
