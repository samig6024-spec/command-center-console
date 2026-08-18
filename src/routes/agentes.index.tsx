import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/agentes/")({
  component: Page,
});

function Page() {
  return null;
}
