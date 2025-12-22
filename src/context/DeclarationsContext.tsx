"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

export interface Declaration {
  id: string;
  date: string;
  author: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "modified";
}

export interface DeclarationStats {
  declarationsAFaire: number;
  declarationsEffectuees: number;
  declarationsModifiees: number;
}

interface DeclarationsContextType {
  declarations: Declaration[];
  stats: DeclarationStats;
  loading: boolean;
  error: string | null;
}

const DeclarationsContext = createContext<DeclarationsContextType | null>(null);

interface DeclarationsProviderProps {
  children: ReactNode;
}

export function DeclarationsProvider({ children }: DeclarationsProviderProps) {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Compute stats from declarations array based on status
  const stats = useMemo<DeclarationStats>(() => {
    return {
      declarationsAFaire: declarations.filter((d) => d.status === "pending")
        .length,
      declarationsEffectuees: declarations.filter(
        (d) => d.status === "completed"
      ).length,
      declarationsModifiees: declarations.filter((d) => d.status === "modified")
        .length,
    };
  }, [declarations]);

  const fetchDeclarations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/data/declarations.json");

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setDeclarations(data.declarations);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
      console.error("Erreur lors du chargement des déclarations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeclarations();
  }, [fetchDeclarations]);

  const value: DeclarationsContextType = {
    declarations,
    stats,
    loading,
    error,
  };

  return <DeclarationsContext value={value}>{children}</DeclarationsContext>;
}

export function useDeclarations() {
  const context = useContext(DeclarationsContext);

  if (!context) {
    throw new Error(
      "useDeclarations doit être utilisé dans un DeclarationsProvider"
    );
  }

  return context;
}
