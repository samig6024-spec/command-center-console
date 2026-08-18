import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/agentes/$agentId")({
  component: Page,
});

function Page() {
  return null;
}
