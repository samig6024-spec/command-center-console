import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/briefings")({
  component: Page,
});

function Page() {
  return null;
}
