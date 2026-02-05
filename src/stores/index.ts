export { useAuthStore, type TeamInfo } from "./authStore";
export {
  useCategoryCodesStore,
  type CategoryCode,
} from "./categoryCodesStore";
export {
  useDeclarationsStore,
  type Declaration,
  type DeclarationStats,
  type ModificationEntry,
  type ModificationDetail,
} from "./declarationsStore";
export { useFormEditorStore } from "./formEditorStore";
export { useFormsStore, type FormTemplate } from "./formsStore";
export type { FormTemplate as FormDefinition } from "./formsStore";

// Expose stores in dev mode for debugging
import "./devtools";
