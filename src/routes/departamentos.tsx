import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/departamentos")({
  component: Page,
});

function Page() {
  return null;
}
