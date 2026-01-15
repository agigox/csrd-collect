export { useAuthStore, type TeamInfo } from "./authStore";
export { useSidebarStore } from "./sidebarStore";
export { useDeclarationsStore, type Declaration, type DeclarationStats, type ModificationEntry, type ModificationDetail } from "./declarationsStore";
export { useFormsStore, type FormDefinition } from "./formsStore";

// Expose stores in dev mode for debugging
import "./devtools";
