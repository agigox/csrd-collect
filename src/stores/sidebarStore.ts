import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SidebarState {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    (set) => ({
      isCollapsed: false,

      setCollapsed: (collapsed: boolean) =>
        set(
          { isCollapsed: collapsed },
          false,
          "SIDEBAR/SET_COLLAPSED"
        ),

      toggle: () =>
        set(
          (state) => ({ isCollapsed: !state.isCollapsed }),
          false,
          "SIDEBAR/TOGGLE"
        ),
    }),
    { name: "sidebar-store" }
  )
);
