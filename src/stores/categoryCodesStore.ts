import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CategoryCode } from "@/models/CategoryCode";
import { fetchCategoryCodes as fetchCategoryCodesApi } from "@/api/categoryCodes";

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
          const categoryCodes = await fetchCategoryCodesApi();
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
