import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { FieldConfig } from "@/lib/form-fields";
import { FormTemplate } from "models/FormTemplate";

const API_BASE_URL = "http://localhost:4000";

interface FormsState {
  forms: FormTemplate[];
  loading: boolean;
  error: string | null;
  currentForm: FormTemplate | null;
  activeFieldName: string | null;
  setCurrentForm: (form: FormTemplate | null) => void;
  setActiveFieldName: (name: string | null) => void;
  saveForm: (form: FormTemplate) => Promise<void>;
  createForm: (form: {
    name: string;
    description: string;
    categoryCode: string;
    schema: { fields: FieldConfig[] };
  }) => Promise<FormTemplate>;
  deleteForm: (id: string) => Promise<void>;
  fetchForms: () => Promise<void>;
}

export const useFormsStore = create<FormsState>()(
  devtools(
    (set) => ({
      forms: [],
      loading: true,
      error: null,
      currentForm: null,
      activeFieldName: null,

      setActiveFieldName: (name: string | null) =>
        set({ activeFieldName: name }, false, "FORMS/SET_ACTIVE_FIELD"),

      setCurrentForm: (form: FormTemplate | null) =>
        set(
          { currentForm: form },
          false,
          form ? "FORMS/SET_CURRENT_FORM" : "FORMS/CLEAR_CURRENT_FORM",
        ),

      saveForm: async (updatedForm: FormTemplate) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/form-templates/${updatedForm.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: updatedForm.name,
                description: updatedForm.description,
                categoryCode: updatedForm.categoryCode,
                schema: updatedForm.schema,
              }),
            },
          );

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const savedForm = (await response.json()) as FormTemplate;

          set(
            (state) => {
              const index = state.forms.findIndex(
                (f) => f.id === updatedForm.id,
              );
              if (index !== -1) {
                const newForms = [...state.forms];
                newForms[index] = savedForm;
                return {
                  forms: newForms,
                  currentForm:
                    state.currentForm?.id === updatedForm.id
                      ? savedForm
                      : state.currentForm,
                };
              }
              return state;
            },
            false,
            "FORMS/SAVE_FORM",
          );
        } catch (err) {
          console.error("Erreur lors de la sauvegarde du formulaire:", err);
        }
      },

      createForm: async (formData) => {
        const categoryPrefix = formData.categoryCode.split("-")[0] || "E1";
        const randomSuffix = Math.floor(Math.random() * 100)
          .toString()
          .padStart(2, "0");
        const generatedCode = `${categoryPrefix}-${Date.now().toString().slice(-4)}_${randomSuffix}`;

        const newFormPayload = {
          code: generatedCode,
          name: formData.name,
          description: formData.description,
          categoryCode: formData.categoryCode,
          schema: formData.schema,
        };

        try {
          const response = await fetch(`${API_BASE_URL}/form-templates`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newFormPayload),
          });

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const createdForm = (await response.json()) as FormTemplate;

          set(
            (state) => ({ forms: [...state.forms, createdForm] }),
            false,
            "FORMS/CREATE_FORM",
          );

          return createdForm;
        } catch (err) {
          console.error("Erreur lors de la création du formulaire:", err);
          throw err;
        }
      },

      deleteForm: async (id: string) => {
        try {
          const response = await fetch(`${API_BASE_URL}/form-templates/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          set(
            (state) => ({
              forms: state.forms.filter((f) => f.id !== id),
              currentForm:
                state.currentForm?.id === id ? null : state.currentForm,
            }),
            false,
            "FORMS/DELETE_FORM",
          );
        } catch (err) {
          console.error("Erreur lors de la suppression du formulaire:", err);
        }
      },

      fetchForms: async () => {
        set({ loading: true, error: null }, false, "FORMS/FETCH_START");

        try {
          const response = await fetch(`${API_BASE_URL}/form-templates`);

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const forms = (await response.json()) as FormTemplate[];
          set({ forms, loading: false }, false, "FORMS/FETCH_SUCCESS");
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
            "FORMS/FETCH_ERROR",
          );
          console.error("Erreur lors du chargement des formulaires:", err);
        }
      },
    }),
    { name: "forms-store" },
  ),
);

export type { FormTemplate };
