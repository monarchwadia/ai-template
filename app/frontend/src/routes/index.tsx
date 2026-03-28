import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "../lib/components/atoms/Heading";
import { Text } from "../lib/components/atoms/Text";
import { Label } from "../lib/components/atoms/Label";
import { Button } from "../lib/components/atoms/Button";
import { Card } from "../lib/components/molecules/Card";
import { SectionHeading } from "../lib/components/molecules/SectionHeading";
import { Takeaway } from "../lib/components/molecules/Takeaway";

export const Route = createFileRoute("/")({
  component: Index,
});

const features = [
  {
    label: "Design System",
    title: "Atoms & Molecules",
    body: "A ready-made component library built with Tailwind CSS v4. Atoms handle all visual styling. Molecules compose atoms into larger patterns. Add your own and the rules enforce themselves.",
  },
  {
    label: "Architecture",
    title: "ESLint Guardrails",
    body: "Custom ESLint rules encode architecture decisions — no visual Tailwind outside atoms, no barrel files. LLMs and teammates get real-time lint errors when they drift. No docs required.",
  },
  {
    label: "Full-Stack",
    title: "Frontend + Backend",
    body: "React 19, Vite 7, and TanStack Router on the frontend. Fastify 5 and Zod 4 on the backend. Shared types package in between. All wired up in a pnpm monorepo with Turborepo.",
  },
  {
    label: "AI-Native",
    title: "Built for Copilot",
    body: "Session instructions, per-file rules, and enforced conventions make this template easy for GitHub Copilot and other LLMs to work in correctly. Good decisions get encoded, not just documented.",
  },
];

function Index() {
  return (
    <>
      {/* Hero */}
      {/* eslint-disable-next-line tailwind-atoms/no-visual-tailwind-outside-atoms -- one-off hero background */}
      <section className="py-24 bg-linear-to-br from-white to-surface-alt border-b border-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-2xl">
            <div className="mb-2">
              <Label size="md">AI-Native Starter Template</Label>
            </div>
            <div className="mb-6">
              <Heading as="h1" size="display">
                Your new project
                <br />
                starts here.
              </Heading>
            </div>
            <div className="mb-8">
              <Text size="lg">
                A full-stack monorepo with a design system, enforced
                architecture, and first-class AI tooling — ready to build on.
              </Text>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button href="https://github.com">View on GitHub</Button>
              <Button variant="secondary" href="#whats-included">
                What's included
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section id="whats-included" className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12">
            <SectionHeading>What's included</SectionHeading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card key={feature.title}>
                <div className="mb-2">
                  <Label>{feature.label}</Label>
                </div>
                <div className="mb-3">
                  <Heading as="h3" size="lg">
                    {feature.title}
                  </Heading>
                </div>
                <Text>{feature.body}</Text>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Getting started */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <Takeaway>
            Edit <code>routes/index.tsx</code> to build your first page. Explore{" "}
            <code>lib/components/</code> to see the design system. Start the dev
            server with <code>pnpm dev</code> from <code>app/frontend</code>.
          </Takeaway>
        </div>
      </section>
    </>
  );
}
