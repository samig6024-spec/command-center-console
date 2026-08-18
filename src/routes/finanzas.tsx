import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/finanzas")({
  component: Page,
});

function Page() {
  return null;
}
