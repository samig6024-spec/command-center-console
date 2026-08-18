import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  Building2,
  ChevronsLeft,
  Coins,
  DoorOpen,
  Home,
  Lightbulb,
  Megaphone,
  Moon,
  Radio,
  Settings,
  Stamp,
  Sun,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";

export const NAV_ITEMS = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/portafolio", label: "Portafolio", icon: LayoutGrid },
  { to: "/incubadora", label: "Incubadora", icon: Lightbulb },
  { to: "/departamentos", label: "Departamentos", icon: Building2 },
  { to: "/agentes", label: "Agentes", icon: Bot },
  { to: "/aprobaciones", label: "Aprobaciones", icon: Stamp },
  { to: "/distribucion", label: "Distribución", icon: Megaphone },
  { to: "/finanzas", label: "Finanzas", icon: Coins },
  { to: "/exit-room", label: "Exit Room", icon: DoorOpen },
  { to: "/briefings", label: "Briefings de voz", icon: Radio },
  { to: "/configuracion", label: "Configuración", icon: Settings },
] as const;

export function AppSidebar({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  onToggle?: (() => void) | undefined;
  onNavigate?: (() => void) | undefined;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggleTheme } = useSession();

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn("flex items-center gap-2.5 px-4 py-5", collapsed && "justify-center px-2")}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/35 bg-primary/12">
          <Radio className="size-4.5 text-primary" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Command Center</p>
            <p className="truncate text-[11px] text-muted-foreground">Incubadora de aplicaciones</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to);
          const link = (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-visible:ring-ring group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                active
                  ? "bg-primary/12 font-medium text-primary"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              {active && <span className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-primary" />}
              <item.icon className="size-4.5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
          return collapsed ? (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            link
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border border-nova/30 bg-nova/10 px-3 py-2.5 text-[11px] font-semibold tracking-wide text-nova uppercase",
            collapsed && "justify-center px-0",
          )}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-2 animate-ping rounded-full bg-nova/60" />
            <span className="relative inline-flex size-2 rounded-full bg-nova" />
          </span>
          {!collapsed && "Datos demo"}
        </div>
        <div className={cn("flex items-center gap-1", collapsed && "flex-col")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"}
          >
            {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="ml-auto"
              aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            >
              <ChevronsLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
