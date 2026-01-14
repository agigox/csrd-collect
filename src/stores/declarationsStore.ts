import { create } from "zustand";
import { devtools } from "zustand/middleware";

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

interface DeclarationsState {
  declarations: Declaration[];
  loading: boolean;
  error: string | null;
  stats: DeclarationStats;
  fetchDeclarations: () => Promise<void>;
}

const computeStats = (declarations: Declaration[]): DeclarationStats => ({
  declarationsAFaire: declarations.filter((d) => d.status === "pending").length,
  declarationsEffectuees: declarations.filter((d) => d.status === "completed").length,
  declarationsModifiees: declarations.filter((d) => d.status === "modified").length,
});

export const useDeclarationsStore = create<DeclarationsState>()(
  devtools(
    (set) => ({
      declarations: [],
      loading: true,
      error: null,
      stats: {
        declarationsAFaire: 0,
        declarationsEffectuees: 0,
        declarationsModifiees: 0,
      },

      fetchDeclarations: async () => {
        set(
          { loading: true, error: null },
          false,
          "DECLARATIONS/FETCH_START"
        );

        try {
          const response = await fetch("/data/declarations.json");

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const data = await response.json();
          const declarations = data.declarations as Declaration[];

          set(
            {
              declarations,
              stats: computeStats(declarations),
              loading: false,
            },
            false,
            "DECLARATIONS/FETCH_SUCCESS"
          );
        } catch (err) {
          set(
            {
              error: err instanceof Error ? err.message : "Erreur lors du chargement",
              loading: false,
            },
            false,
            "DECLARATIONS/FETCH_ERROR"
          );
          console.error("Erreur lors du chargement des déclarations:", err);
        }
      },
    }),
    { name: "declarations-store" }
  )
);
