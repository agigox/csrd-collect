import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ModificationDetail {
  label: string;
}

export interface ModificationEntry {
  id: string;
  userName: string;
  timestamp: string;
  action: string;
  details?: ModificationDetail[];
}

export interface Declaration {
  id: string;
  formId: string;
  date: string;
  author: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "modified";
  formValues?: Record<string, unknown>;
  history?: ModificationEntry[];
  isNew?: boolean;
}

interface DeclarationsState {
  declarations: Declaration[];
  loading: boolean;
  error: string | null;
  fetchDeclarations: () => Promise<void>;
  updateDeclaration: (
    id: string,
    formValues: Record<string, unknown>,
  ) => Promise<void>;
  addTempDeclaration: (declaration: Declaration) => void;
  updateTempDeclaration: (id: string, updates: Partial<Declaration>) => void;
  removeTempDeclaration: (id: string) => void;
  confirmTempDeclaration: (id: string) => Promise<void>;
}

export const useDeclarationsStore = create<DeclarationsState>()(
  devtools(
    (set) => ({
      declarations: [],
      loading: false,
      error: null,

      fetchDeclarations: async () => {
        set({ loading: true, error: null }, false, "DECLARATIONS/FETCH_START");

        try {
          const response = await fetch("http://localhost:4000/declarations");

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const data: Declaration[] = await response.json();

          set(
            {
              declarations: data,
              loading: false,
            },
            false,
            "DECLARATIONS/FETCH_SUCCESS",
          );
        } catch (err) {
          set(
            {
              error:
                err instanceof Error
                  ? err.message
                  : "Erreur lors du chargement",
              loading: false,
            },
            false,
            "DECLARATIONS/FETCH_ERROR",
          );
          console.error("Erreur lors du chargement des déclarations:", err);
        }
      },

      updateDeclaration: async (
        id: string,
        formValues: Record<string, unknown>,
      ) => {
        try {
          // Get current declaration
          const state = useDeclarationsStore.getState();
          const declaration = state.declarations.find((d) => d.id === id);

          if (!declaration) {
            throw new Error("Déclaration non trouvée");
          }

          // Update declaration with new form values
          const updatedDeclaration: Declaration = {
            ...declaration,
            formValues,
            status: "modified",
          };

          const response = await fetch(
            `http://localhost:4000/declarations/${id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedDeclaration),
            },
          );

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          // Update local state
          set(
            (state) => {
              const newDeclarations = state.declarations.map((d) =>
                d.id === id ? updatedDeclaration : d,
              );
              return {
                declarations: newDeclarations,
              };
            },
            false,
            "DECLARATIONS/UPDATE_SUCCESS",
          );
        } catch (err) {
          console.error(
            "Erreur lors de la mise à jour de la déclaration:",
            err,
          );
          throw err;
        }
      },

      addTempDeclaration: (declaration: Declaration) => {
        set(
          (state) => ({
            declarations: [declaration, ...state.declarations],
          }),
          false,
          "DECLARATIONS/ADD_TEMP",
        );
      },

      updateTempDeclaration: (id: string, updates: Partial<Declaration>) => {
        set(
          (state) => ({
            declarations: state.declarations.map((d) =>
              d.id === id ? { ...d, ...updates } : d,
            ),
          }),
          false,
          "DECLARATIONS/UPDATE_TEMP",
        );
      },

      removeTempDeclaration: (id: string) => {
        set(
          (state) => ({
            declarations: state.declarations.filter((d) => d.id !== id),
          }),
          false,
          "DECLARATIONS/REMOVE_TEMP",
        );
      },

      confirmTempDeclaration: async (id: string) => {
        try {
          const state = useDeclarationsStore.getState();
          const declaration = state.declarations.find((d) => d.id === id);

          if (!declaration) {
            throw new Error("Déclaration non trouvée");
          }

          // Remove isNew flag for the API call
          const { isNew, ...declarationToSave } = declaration;

          const response = await fetch("http://localhost:4000/declarations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(declarationToSave),
          });

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          // Update local state - remove isNew flag
          set(
            (state) => {
              const newDeclarations = state.declarations.map((d) =>
                d.id === id ? { ...d, isNew: undefined } : d,
              );
              return {
                declarations: newDeclarations,
              };
            },
            false,
            "DECLARATIONS/CONFIRM_TEMP",
          );
        } catch (err) {
          console.error(
            "Erreur lors de la confirmation de la déclaration:",
            err,
          );
          throw err;
        }
      },
    }),
    { name: "declarations-store" },
  ),
);
