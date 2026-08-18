import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, CalendarDays, Clock, Menu, Search, Sparkle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusBadge } from "@/components/common/StatusBadge";
import { NAV_ITEMS } from "./AppSidebar";
import { dateTimeLong, timeShort } from "@/lib/format";
import { useSession } from "@/hooks/useSession";
import { incidents } from "@/mock-data/operations";
import { cn } from "@/lib/utils";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Command Center", subtitle: "Visión general de la operación de la incubadora" },
  "/portafolio": { title: "Portafolio", subtitle: "Aplicaciones en operación y su estado" },
  "/incubadora": { title: "Incubadora", subtitle: "Oportunidades y nuevos productos" },
  "/departamentos": { title: "Departamentos", subtitle: "Áreas operativas y su carga de trabajo" },
  "/agentes": { title: "Agentes", subtitle: "Registro central de ejecutores de tareas" },
  "/aprobaciones": { title: "Aprobaciones", subtitle: "Bandeja ejecutiva de decisiones" },
  "/distribucion": { title: "Distribución", subtitle: "Contenido, comunidad y crecimiento" },
  "/finanzas": { title: "Finanzas", subtitle: "Ingresos, costos y control presupuestario" },
  "/exit-room": { title: "Exit Room", subtitle: "Preparación para venta por aplicación" },
  "/briefings": { title: "Briefings de voz", subtitle: "Resúmenes preparados por ZADAR y NOVA" },
  "/configuracion": { title: "Configuración", subtitle: "Preferencias, roles e integración" },
  "/asistentes": { title: "Asistentes", subtitle: "ZADAR y NOVA" },
};

export function AppHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, assistant, openAssistant } = useSession();
  const [commandOpen, setCommandOpen] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const meta = useMemo(() => {
    const key = Object.keys(TITLES)
      .filter((k) => (k === "/" ? pathname === "/" : pathname.startsWith(k)))
      .sort((a, b) => b.length - a.length)[0];
    return TITLES[key ?? "/"]!;
  }, [pathname]);

  const openIncidents = incidents.filter((i) => i.state === "abierta");

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMobileNav} aria-label="Abrir menú">
          <Menu className="size-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold tracking-tight lg:text-xl">{meta.title}</h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">{meta.subtitle}</p>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-border bg-panel px-3 py-1.5 text-xs text-muted-foreground xl:flex">
          <CalendarDays className="size-3.5" />
          <span className="tabular-nums">{dateTimeLong(now)}</span>
          <span className="h-3.5 w-px bg-border" />
          <Clock className="size-3.5" />
          <span className="tabular-nums">{timeShort(now)}</span>
        </div>

        <div className="hidden items-center rounded-lg border border-border bg-panel px-3 py-1.5 md:flex">
          <span className="mr-2 text-xs text-muted-foreground">Sistema</span>
          <StatusBadge tone={openIncidents.length > 1 ? "amber" : "green"}>
            {openIncidents.length > 1 ? "Degradado" : "Óptimo"}
          </StatusBadge>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground hidden lg:flex"
          onClick={() => setCommandOpen(true)}
        >
          <Search className="size-4" /> Buscar
          <kbd className="ml-2 rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </Button>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setCommandOpen(true)} aria-label="Buscar">
          <Search className="size-5" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Alertas">
              <Bell className="size-5" />
              {openIncidents.length > 0 && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Alertas</p>
              <p className="text-xs text-muted-foreground">{openIncidents.length} incidentes abiertos</p>
            </div>
            <ul className="divide-y divide-border">
              {incidents.map((i) => (
                <li key={i.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">{i.title}</p>
                    <StatusBadge tone={i.severity === "critica" ? "red" : i.severity === "alta" ? "amber" : "neutral"}>
                      {i.severity}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{i.openedAt}</p>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <Button
          size="sm"
          onClick={() => openAssistant()}
          className={cn(
            assistant === "NOVA" && "bg-nova text-nova-foreground hover:bg-nova/90",
          )}
        >
          <Sparkle className="size-4" /> Activar {assistant}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus-visible:ring-ring flex items-center gap-2 rounded-lg border border-border bg-panel px-2 py-1.5 text-left transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:outline-none">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 text-[11px] font-semibold text-primary">
                {user.initials}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-xs font-medium">{user.name}</span>
                <span className="block truncate text-[10px] text-muted-foreground">{user.title}</span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/configuracion" })}>Configuración</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: "/briefings" })}>Briefings de voz</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Sesión gestionada por el backend</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Buscar secciones, aplicaciones o agentes..." />
        <CommandList>
          <CommandEmpty>Sin resultados.</CommandEmpty>
          <CommandGroup heading="Secciones">
            {NAV_ITEMS.map((item) => (
              <CommandItem
                key={item.to}
                value={item.label}
                onSelect={() => {
                  setCommandOpen(false);
                  navigate({ to: item.to });
                }}
              >
                <item.icon className="size-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Accesos rápidos">
            <CommandItem
              value="Asistentes ZADAR NOVA"
              onSelect={() => {
                setCommandOpen(false);
                navigate({ to: "/asistentes" });
              }}
            >
              <Sparkle className="size-4" /> ZADAR y NOVA
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Link to="/asistentes" className="sr-only">
        Asistentes
      </Link>
    </header>
  );
}
