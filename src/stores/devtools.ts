// Expose stores globally in development for debugging
// Access in console: window.stores.auth.getState()

import { useAuthStore } from "./authStore";
import { useCategoryCodesStore } from "./categoryCodesStore";
import { useDeclarationsStore } from "./declarationsStore";
import { useFormEditorStore } from "./formEditorStore";
import { useFormsStore } from "./formsStore";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as unknown as Record<string, unknown>).stores = {
    auth: useAuthStore,
    categoryCodes: useCategoryCodesStore,
    declarations: useDeclarationsStore,
    formEditor: useFormEditorStore,
    forms: useFormsStore,
  };
}

export {};
