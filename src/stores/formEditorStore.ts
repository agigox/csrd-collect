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
  formVisibilityLevel: string;
  schema: FieldConfig[];

  // UI state
  isSaving: boolean;
  showPreview: boolean;

  // Navigation guard
  pendingNavigation: string | null;

  // Actions
  setFormName: (name: string) => void;
  setFormDescription: (description: string) => void;
  setFormCategoryCode: (code: string) => void;
  setFormVisibilityLevel: (visibilityLevel: string) => void;
  setSchema: (schema: FieldConfig[]) => void;
  setIsSaving: (saving: boolean) => void;
  setShowPreview: (show: boolean) => void;
  initializeFromForm: (form: FormTemplate | null) => void;
  setPendingNavigation: (path: string | null) => void;
  hasUnsavedContent: () => boolean;
  reset: () => void;
}

const DEFAULT_CATEGORY_CODE = "E2-4";

const initialState = {
  formId: null as string | null,
  formName: "",
  formDescription: "",
  formCategoryCode: DEFAULT_CATEGORY_CODE,
  formVisibilityLevel: "",
  schema: [] as FieldConfig[],
  isSaving: false,
  showPreview: false,
  pendingNavigation: null as string | null,
};

export const useFormEditorStore = create<FormEditorState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setFormName: (name) =>
        set({ formName: name }, false, "FORM_EDITOR/SET_NAME"),

      setFormDescription: (description) =>
        set({ formDescription: description }, false, "FORM_EDITOR/SET_DESCRIPTION"),

      setFormCategoryCode: (code) =>
        set({ formCategoryCode: code }, false, "FORM_EDITOR/SET_CATEGORY_CODE"),

      setFormVisibilityLevel: (visibilityLevel) =>
        set({ formVisibilityLevel: visibilityLevel }, false, "FORM_EDITOR/SET_VISIBILITY_LEVEL"),

      setSchema: (schema) =>
        set({ schema }, false, "FORM_EDITOR/SET_SCHEMA"),

      setIsSaving: (saving) =>
        set({ isSaving: saving }, false, "FORM_EDITOR/SET_SAVING"),

      setShowPreview: (show) =>
        set({ showPreview: show }, false, "FORM_EDITOR/SET_SHOW_PREVIEW"),

      initializeFromForm: (form: FormTemplate | null) =>
        set(
          {
            formId: form?.id ?? null,
            formName: form?.name ?? "",
            formDescription: form?.description ?? "",
            formCategoryCode: form?.categoryCode ?? DEFAULT_CATEGORY_CODE,
            formVisibilityLevel: form?.visibilityLevel ?? "",
            schema: form?.schema?.fields ?? [],
          },
          false,
          "FORM_EDITOR/INITIALIZE"
        ),

      setPendingNavigation: (path) =>
        set({ pendingNavigation: path }, false, "FORM_EDITOR/SET_PENDING_NAV"),

      hasUnsavedContent: () => {
        const { schema, formName, formId } = get();
        return !formId && (schema.length > 0 || formName.trim() !== "");
      },

      reset: () =>
        set({ ...initialState }, false, "FORM_EDITOR/RESET"),
    }),
    { name: "form-editor-store" }
  )
);
