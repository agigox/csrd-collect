import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Declaration } from "@/models/Declaration";
import {
  fetchDeclarations as fetchDeclarationsApi,
  updateDeclaration as updateDeclarationApi,
  createDeclaration as createDeclarationApi,
} from "@/api/declarations";
import { normalizeSchema } from "@/lib/utils/normalizeSchema";

interface DeclarationsState {
  declarations: Declaration[];
  loading: boolean;
  hasFetched: boolean;
  error: string | null;
  fetchDeclarations: () => Promise<void>;
  reset: () => void;
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

      reset: () => {
        set(
          { declarations: [], loading: false, hasFetched: false, error: null },
          false,
          "DECLARATIONS/RESET",
        );
      },

      fetchDeclarations: async () => {
        const { hasFetched, loading } = useDeclarationsStore.getState();
        if (hasFetched || loading) return;

        set({ loading: true, error: null }, false, "DECLARATIONS/FETCH_START");

        try {
          // TODO: remove filter when backend supports deleting validated declarations
          const data = (await fetchDeclarationsApi())
            .filter((d) => d.id !== "f6a395e8-1997-4c8f-876d-0f7df71e9d38")
            .map((d) => d.formTemplate
              ? { ...d, formTemplate: { ...d.formTemplate, schema: normalizeSchema(d.formTemplate.schema as Record<string, unknown>) } }
              : d,
            );

          set(
            (state) => {
              // Preserve any temp declarations that were added before fetch completed
              const tempDeclarations = state.declarations.filter((d) => d.isNew);
              return {
                declarations: [...tempDeclarations, ...data],
                loading: false,
                hasFetched: true,
              };
            },
            false,
            "DECLARATIONS/FETCH_SUCCESS",
          );
        } catch (err) {
          set(
            {
              error:
                err instanceof Error
                  ? err.message === "Failed to fetch"
                    ? "Impossible de se connecter au serveur"
                    : "Erreur lors du chargement"
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

          // Use the server response to replace the temp declaration with real data
          const created = await createDeclarationApi(declarationToSave);

          // Preserve formTemplate from temp since server response doesn't include it
          const confirmed = {
            ...created,
            formTemplate: created.formTemplate || declaration.formTemplate,
            isNew: false,
          };

          set(
            (state) => ({
              declarations: state.declarations.map((d) =>
                d.id === id ? confirmed : d,
              ),
            }),
            false,
            "DECLARATIONS/CONFIRM_TEMP",
          );

          // Re-fetch to get authoritative server data (with formTemplate populated)
          set({ hasFetched: false }, false, "DECLARATIONS/INVALIDATE");
          await useDeclarationsStore.getState().fetchDeclarations();
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
