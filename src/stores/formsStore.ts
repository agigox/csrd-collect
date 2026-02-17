import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { FieldConfig } from "@/models/FieldTypes";
import type { FormTemplate } from "@/models/FormTemplate";
import { getAllDescendantIds } from "@/lib/utils/branching";
import {
  fetchFormTemplates,
  saveFormTemplate,
  createFormTemplate as createFormTemplateApi,
  deleteFormTemplate,
} from "@/api/forms";

interface FormsState {
  forms: FormTemplate[];
  loading: boolean;
  error: string | null;
  currentForm: FormTemplate | null;
  activeFieldNames: string[];
  primaryActiveFieldName: string | null;
  setCurrentForm: (form: FormTemplate | null) => void;
  setActiveFieldName: (name: string | null, schema?: FieldConfig[]) => void;
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
      activeFieldNames: [],
      primaryActiveFieldName: null,

      setActiveFieldName: (name: string | null, schema?: FieldConfig[]) => {
        if (!name) {
          set(
            { activeFieldNames: [], primaryActiveFieldName: null },
            false,
            "FORMS/SET_ACTIVE_FIELD",
          );
          return;
        }

        const names: string[] = [name];

        if (schema) {
          const field = schema.find((f) => f.name === name);
          if (field) {
            // If it's a child, also open the parent
            if (field.parentFieldId) {
              const parent = schema.find((f) => f.id === field.parentFieldId);
              if (parent && !names.includes(parent.name)) {
                names.push(parent.name);
              }
            }
            // Open all descendants (children, grandchildren, etc.)
            const descendantIds = getAllDescendantIds(field.id, schema);
            for (const descendantId of descendantIds) {
              const descendant = schema.find((f) => f.id === descendantId);
              if (descendant && !names.includes(descendant.name)) {
                names.push(descendant.name);
              }
            }
          }
        }

        set(
          { activeFieldNames: names, primaryActiveFieldName: name },
          false,
          "FORMS/SET_ACTIVE_FIELD",
        );
      },

      setCurrentForm: (form: FormTemplate | null) =>
        set(
          { currentForm: form },
          false,
          form ? "FORMS/SET_CURRENT_FORM" : "FORMS/CLEAR_CURRENT_FORM",
        ),

      saveForm: async (updatedForm: FormTemplate) => {
        try {
          const savedForm = await saveFormTemplate(updatedForm);

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
        try {
          const createdForm = await createFormTemplateApi(formData);

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
          await deleteFormTemplate(id);

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
          const forms = await fetchFormTemplates();
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
