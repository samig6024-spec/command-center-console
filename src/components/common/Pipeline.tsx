import {
  BadgeDollarSign,
  BrainCircuit,
  ClipboardCheck,
  Code2,
  Lightbulb,
  LineChart,
  PenTool,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { Fragment } from "react";
import type { Product, Stage } from "@/types";
import { STAGES, stageLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const ICONS: Record<Stage, typeof Lightbulb> = {
  idea: Lightbulb,
  inteligencia: BrainCircuit,
  validacion: ClipboardCheck,
  diseno: PenTool,
  desarrollo: Code2,
  qa: ShieldCheck,
  lanzamiento: Rocket,
  crecimiento: LineChart,
  venta: BadgeDollarSign,
};

export function Pipeline({
  products,
  selected,
  onSelect,
}: {
  products: Product[];
  selected: Stage | null;
  onSelect: (stage: Stage) => void;
}) {
  const occupied = new Set(products.map((p) => p.stage));

  return (
    <div className="overflow-x-auto pb-2">
      <ol className="flex min-w-max items-start gap-1">
        {STAGES.map((stage, index) => {
          const Icon = ICONS[stage.id];
          const isOccupied = occupied.has(stage.id);
          const isSelected = selected === stage.id;
          const count = products.filter((p) => p.stage === stage.id).length;
          return (
            <Fragment key={stage.id}>
              <li>
                <button
                  type="button"
                  onClick={() => onSelect(stage.id)}
                  aria-pressed={isSelected}
                  className="focus-visible:ring-ring group flex w-24 flex-col items-center gap-2 rounded-lg py-1 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "relative flex size-12 items-center justify-center rounded-full border transition-all",
                      isSelected
                        ? "border-primary bg-primary/15 text-primary shadow-glow"
                        : isOccupied
                          ? "border-primary/45 bg-primary/8 text-primary"
                          : "border-border bg-secondary/50 text-muted-foreground group-hover:border-primary/35",
                    )}
                  >
                    <Icon className="size-5" />
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full border border-primary/40 bg-background text-[10px] font-semibold text-primary">
                        {count}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-center text-[11px] leading-tight",
                      isSelected ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {stageLabel(stage.id)}
                  </span>
                </button>
              </li>
              {index < STAGES.length - 1 && (
                <li aria-hidden className="mt-6 w-6 shrink-0">
                  <span
                    className={cn(
                      "block h-px w-full",
                      isOccupied ? "bg-primary/45" : "bg-border",
                    )}
                  />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
