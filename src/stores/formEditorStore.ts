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

  // Actions
  setFormName: (name: string) => void;
  setFormDescription: (description: string) => void;
  setFormCategoryCode: (code: string) => void;
  setSchema: (schema: FieldConfig[]) => void;
  setIsSaving: (saving: boolean) => void;
  setShowPreview: (show: boolean) => void;
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
            schema: form?.schema?.fields ?? [],
          },
          false,
          "FORM_EDITOR/INITIALIZE"
        ),
    }),
    { name: "form-editor-store" }
  )
);
