// Expose stores globally in development for debugging
// Access in console: window.stores.auth.getState()

import { useAuthStore } from "./authStore";
import { useSidebarStore } from "./sidebarStore";
import { useDeclarationsStore } from "./declarationsStore";
import { useFormsStore } from "./formsStore";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as unknown as Record<string, unknown>).stores = {
    auth: useAuthStore,
    sidebar: useSidebarStore,
    declarations: useDeclarationsStore,
    forms: useFormsStore,
  };
}

export {};
