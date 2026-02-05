import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { FieldConfig } from "@/models/FieldTypes";
import type { FormTemplate } from "models/FormTemplate";

interface FormEditorState {
  // Form metadata
  formId: string | null;
  formName: string;
  formDescription: string;
  formCategoryCode: string;
  schema: FieldConfig[];

  // UI state
  isSaving: boolean;
  showPreview: boolean;

  // Preview state
  previewValues: Record<string, unknown>;
  previewErrors: Record<string, string>;

  // Actions
  setFormName: (name: string) => void;
  setFormDescription: (description: string) => void;
  setFormCategoryCode: (code: string) => void;
  setSchema: (schema: FieldConfig[]) => void;
  updateFieldConfig: (fieldName: string, config: FieldConfig) => void;
  setIsSaving: (saving: boolean) => void;
  setShowPreview: (show: boolean) => void;
  setPreviewValues: (values: Record<string, unknown>) => void;
  setPreviewErrors: (errors: Record<string, string>) => void;
  resetEditor: () => void;
  initializeFromForm: (form: FormTemplate | null) => void;
}

const DEFAULT_CATEGORY_CODE = "E2-4";

const initialState = {
  formId: null as string | null,
  formName: "",
  formDescription: "",
  formCategoryCode: DEFAULT_CATEGORY_CODE,
  schema: [] as FieldConfig[],
  isSaving: false,
  showPreview: false,
  previewValues: {} as Record<string, unknown>,
  previewErrors: {} as Record<string, string>,
};

export const useFormEditorStore = create<FormEditorState>()(
  devtools(
    (set) => ({
      ...initialState,

      setFormName: (name) =>
        set({ formName: name }, false, "FORM_EDITOR/SET_NAME"),

      setFormDescription: (description) =>
        set({ formDescription: description }, false, "FORM_EDITOR/SET_DESCRIPTION"),

      setFormCategoryCode: (code) =>
        set({ formCategoryCode: code }, false, "FORM_EDITOR/SET_CATEGORY_CODE"),

      setSchema: (schema) =>
        set({ schema }, false, "FORM_EDITOR/SET_SCHEMA"),

      updateFieldConfig: (fieldName, newConfig) =>
        set(
          (state) => {
            const oldField = state.schema.find((f) => f.name === fieldName);
            const newSchema = state.schema.map((f) =>
              f.name === fieldName ? newConfig : f
            );

            // Check if defaultValue changed - clear preview value if so
            const oldDefault = oldField?.defaultValue;
            const newDefault = newConfig.defaultValue;
            const defaultValueChanged = oldDefault !== newDefault;

            if (defaultValueChanged) {
              const restPreviewValues = Object.fromEntries(
                Object.entries(state.previewValues).filter(([key]) => key !== fieldName)
              );
              return {
                schema: newSchema,
                previewValues: restPreviewValues,
              };
            }

            return { schema: newSchema };
          },
          false,
          "FORM_EDITOR/UPDATE_FIELD_CONFIG"
        ),

      setIsSaving: (saving) =>
        set({ isSaving: saving }, false, "FORM_EDITOR/SET_SAVING"),

      setShowPreview: (show) =>
        set({ showPreview: show }, false, "FORM_EDITOR/SET_SHOW_PREVIEW"),

      setPreviewValues: (values) =>
        set({ previewValues: values }, false, "FORM_EDITOR/SET_PREVIEW_VALUES"),

      setPreviewErrors: (errors) =>
        set({ previewErrors: errors }, false, "FORM_EDITOR/SET_PREVIEW_ERRORS"),

      resetEditor: () =>
        set(initialState, false, "FORM_EDITOR/RESET"),

      initializeFromForm: (form: FormTemplate | null) =>
        set(
          {
            formId: form?.id ?? null,
            formName: form?.name ?? "",
            formDescription: form?.description ?? "",
            formCategoryCode: form?.categoryCode ?? DEFAULT_CATEGORY_CODE,
            schema: form?.schema?.fields ?? [],
            previewValues: {},
            previewErrors: {},
          },
          false,
          "FORM_EDITOR/INITIALIZE"
        ),
    }),
    { name: "form-editor-store" }
  )
);
