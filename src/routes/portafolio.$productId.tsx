import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portafolio/$productId")({
  component: Page,
});

function Page() {
  return null;
}
