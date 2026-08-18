import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/asistentes")({
  component: Page,
});

function Page() {
  return null;
}
