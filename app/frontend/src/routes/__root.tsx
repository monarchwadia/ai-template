import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Text } from "../lib/components/atoms/Text";

function RootLayout() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      {/* eslint-disable-next-line tailwind-atoms/no-visual-tailwind-outside-atoms -- one-off page chrome */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <nav className="flex justify-between items-center">
            <a
              href="/"
              // eslint-disable-next-line tailwind-atoms/no-visual-tailwind-outside-atoms -- bespoke logo
              className="text-xl font-semibold text-dark tracking-tight select-none cursor-pointer"
              draggable={false}
            >
              My App
            </a>
          </nav>
        </div>
      </header>

      <Outlet />

      {/* Footer */}
      {/* eslint-disable-next-line tailwind-atoms/no-visual-tailwind-outside-atoms -- one-off footer background */}
      <footer className="bg-dark py-8 mt-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <Text as="span" size="xs" tone="inverse">
            &copy; {new Date().getFullYear()} My App. All rights reserved.
          </Text>
        </div>
      </footer>

      <TanStackRouterDevtools />
    </div>
  );
}

export const Route = createRootRoute({ component: RootLayout });
