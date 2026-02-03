import { create } from "zustand";
import { devtools } from "zustand/middleware";

const API_BASE_URL = "http://localhost:4000";

export interface CategoryCode {
  value: string;
  label: string;
}

interface CategoryCodesState {
  categoryCodes: CategoryCode[];
  loading: boolean;
  error: string | null;
  fetchCategoryCodes: () => Promise<void>;
}

export const useCategoryCodesStore = create<CategoryCodesState>()(
  devtools(
    (set, get) => ({
      categoryCodes: [],
      loading: false,
      error: null,

      fetchCategoryCodes: async () => {
        // Skip if already loaded
        if (get().categoryCodes.length > 0) {
          return;
        }

        set({ loading: true, error: null }, false, "CATEGORY_CODES/FETCH_START");

        try {
          const response = await fetch(`${API_BASE_URL}/category-codes`);

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const categoryCodes = (await response.json()) as CategoryCode[];
          set(
            { categoryCodes, loading: false },
            false,
            "CATEGORY_CODES/FETCH_SUCCESS"
          );
        } catch (err) {
          set(
            {
              error:
                err instanceof Error
                  ? err.message
                  : "Erreur lors du chargement des codes catégorie",
              loading: false,
            },
            false,
            "CATEGORY_CODES/FETCH_ERROR"
          );
          console.error("Erreur lors du chargement des codes catégorie:", err);
        }
      },
    }),
    { name: "category-codes-store" }
  )
);
