import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/incubadora")({
  component: Page,
});

function Page() {
  return null;
}
