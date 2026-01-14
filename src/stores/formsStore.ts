import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { FieldConfig } from "@/lib/form-fields";

export interface FormDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  norme: string;
  createdAt: string;
  updatedAt: string;
  schema: FieldConfig[];
}

interface FormsState {
  forms: FormDefinition[];
  loading: boolean;
  error: string | null;
  currentForm: FormDefinition | null;
  setCurrentForm: (form: FormDefinition | null) => void;
  saveForm: (form: FormDefinition) => void;
  createForm: (form: Omit<FormDefinition, "id" | "code" | "createdAt" | "updatedAt">) => FormDefinition;
  deleteForm: (id: string) => void;
  fetchForms: () => Promise<void>;
}

export const useFormsStore = create<FormsState>()(
  devtools(
    (set) => ({
      forms: [],
      loading: true,
      error: null,
      currentForm: null,

      setCurrentForm: (form: FormDefinition | null) =>
        set(
          { currentForm: form },
          false,
          form ? "FORMS/SET_CURRENT_FORM" : "FORMS/CLEAR_CURRENT_FORM"
        ),

      saveForm: (updatedForm: FormDefinition) => {
        const today = new Date().toISOString().split("T")[0];
        const formWithDate = { ...updatedForm, updatedAt: today };

        set(
          (state) => {
            const index = state.forms.findIndex((f) => f.id === updatedForm.id);
            if (index !== -1) {
              const newForms = [...state.forms];
              newForms[index] = formWithDate;
              return {
                forms: newForms,
                currentForm: state.currentForm?.id === updatedForm.id ? formWithDate : state.currentForm,
              };
            }
            return state;
          },
          false,
          "FORMS/SAVE_FORM"
        );
      },

      createForm: (formData) => {
        const today = new Date().toISOString().split("T")[0];
        const normePrefix = formData.norme.split("-")[0] || "E1";
        const randomSuffix = Math.floor(Math.random() * 100).toString().padStart(2, "0");
        const generatedCode = `${normePrefix}-${Date.now().toString().slice(-4)}_${randomSuffix}`;

        const newForm: FormDefinition = {
          ...formData,
          id: Date.now().toString(),
          code: generatedCode,
          createdAt: today,
          updatedAt: today,
        };

        set(
          (state) => ({ forms: [...state.forms, newForm] }),
          false,
          "FORMS/CREATE_FORM"
        );

        return newForm;
      },

      deleteForm: (id: string) => {
        set(
          (state) => ({
            forms: state.forms.filter((f) => f.id !== id),
            currentForm: state.currentForm?.id === id ? null : state.currentForm,
          }),
          false,
          "FORMS/DELETE_FORM"
        );
      },

      fetchForms: async () => {
        set(
          { loading: true, error: null },
          false,
          "FORMS/FETCH_START"
        );

        try {
          const response = await fetch("/data/forms.json");

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const data = await response.json();
          set(
            { forms: data.forms, loading: false },
            false,
            "FORMS/FETCH_SUCCESS"
          );
        } catch (err) {
          set(
            {
              error: err instanceof Error ? err.message : "Erreur lors du chargement",
              loading: false,
            },
            false,
            "FORMS/FETCH_ERROR"
          );
          console.error("Erreur lors du chargement des formulaires:", err);
        }
      },
    }),
    { name: "forms-store" }
  )
);
