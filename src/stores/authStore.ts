import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { TeamInfo } from "@/models/TeamInfo";

interface AuthState {
  isAuthenticated: boolean;
  teamInfo: TeamInfo | null;
  isLoading: boolean;
  login: (teamInfo: TeamInfo) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        teamInfo: null,
        isLoading: true,

        login: (teamInfo: TeamInfo) =>
          set(
            { teamInfo, isAuthenticated: true },
            false,
            "AUTH/LOGIN"
          ),

        logout: () =>
          set(
            { teamInfo: null, isAuthenticated: false },
            false,
            "AUTH/LOGOUT"
          ),

        setLoading: (loading: boolean) =>
          set(
            { isLoading: loading },
            false,
            "AUTH/SET_LOADING"
          ),
      }),
      {
        name: "csrd_auth",
        onRehydrateStorage: () => (state) => {
          state?.setLoading(false);
        },
      }
    ),
    { name: "auth-store" }
  )
);
