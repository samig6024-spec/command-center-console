import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role, User } from "@/types";
import { users } from "@/mock-data/organization";

/**
 * Sesión de demostración. La autorización real la resolverá el backend;
 * aquí sólo se representa visualmente el rol activo.
 */
type AssistantState = "inactivo" | "escuchando" | "procesando" | "respondiendo" | "error" | "limite";

interface SessionValue {
  user: User;
  role: Role;
  setRole: (role: Role) => void;
  assistant: "ZADAR" | "NOVA";
  assistantOpen: boolean;
  openAssistant: (a?: "ZADAR" | "NOVA") => void;
  closeAssistant: () => void;
  voiceState: AssistantState;
  setVoiceState: (s: AssistantState) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("ceo");
  const [assistant, setAssistant] = useState<"ZADAR" | "NOVA">("ZADAR");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<AssistantState>("inactivo");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
  }, [theme]);

  const user = useMemo(() => (role === "ceo" ? users[0]! : users[1]!), [role]);

  const handleSetRole = useCallback((next: Role) => {
    setRole(next);
    setAssistant(next === "ceo" ? "ZADAR" : "NOVA");
  }, []);

  const openAssistant = useCallback(
    (a?: "ZADAR" | "NOVA") => {
      if (a) setAssistant(a);
      setAssistantOpen(true);
    },
    [],
  );

  const value: SessionValue = {
    user,
    role,
    setRole: handleSetRole,
    assistant,
    assistantOpen,
    openAssistant,
    closeAssistant: () => setAssistantOpen(false),
    voiceState,
    setVoiceState,
    theme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession debe usarse dentro de SessionProvider");
  return ctx;
}
