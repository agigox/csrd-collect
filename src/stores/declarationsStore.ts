import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Declaration } from "@/models/Declaration";
import {
  fetchDeclarations as fetchDeclarationsApi,
  updateDeclaration as updateDeclarationApi,
  createDeclaration as createDeclarationApi,
} from "@/api/declarations";

interface DeclarationsState {
  declarations: Declaration[];
  loading: boolean;
  hasFetched: boolean;
  error: string | null;
  fetchDeclarations: () => Promise<void>;
  updateDeclaration: (
    id: string,
    formData: Record<string, unknown>,
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
      hasFetched: false,
      error: null,

      fetchDeclarations: async () => {
        const { hasFetched, loading } = useDeclarationsStore.getState();
        if (hasFetched || loading) return;

        set({ loading: true, error: null }, false, "DECLARATIONS/FETCH_START");

        try {
          // TODO: remove filter when backend supports deleting validated declarations
          const data = (await fetchDeclarationsApi()).filter(
            (d) => d.id !== "f6a395e8-1997-4c8f-876d-0f7df71e9d38",
          );

          set(
            {
              declarations: data,
              loading: false,
              hasFetched: true,
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
        formData: Record<string, unknown>,
      ) => {
        try {
          // Get current declaration
          const state = useDeclarationsStore.getState();
          const declaration = state.declarations.find((d) => d.id === id);

          if (!declaration) {
            throw new Error("Déclaration non trouvée");
          }

          // Update declaration with new form data
          const updatedDeclaration: Declaration = {
            ...declaration,
            formData,
            status: "pending",
            updatedAt: new Date().toISOString(),
          };

          await updateDeclarationApi(id, updatedDeclaration);

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
          const { isNew: _isNew, ...declarationToSave } = declaration;

          await createDeclarationApi(declarationToSave);

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
