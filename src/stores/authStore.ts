import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User, RegisterData } from "@/models/User";
import type { TeamInfo } from "@/models/User";
import {
  loginUser,
  registerUser,
  patchUserTeamInfo,
  fetchUserById,
} from "@/api/users";

interface AuthState {
  // Core state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Backward-compatible field
  teamInfo: TeamInfo | null;

  // Actions
  login: (nniOrEmail: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateTeamInfo: (teamInfo: TeamInfo) => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

// Shape persisted to / restored from localStorage
interface PersistedAuthState {
  user: User | null;
  isAuthenticated: boolean;
  teamInfo: TeamInfo | null;
}

// Computed selectors (use outside the store via useAuthStore(selectX))
export const selectIsAdmin = (state: AuthState) =>
  state.user?.role === "admin";
export const selectIsMember = (state: AuthState) =>
  state.user?.role === "member";
export const selectIsPendingApproval = (state: AuthState) =>
  state.user?.role === "admin" && state.user?.status === "pending";
export const selectNeedsTeamOnboarding = (state: AuthState) =>
  state.user?.role === "member" && !state.user?.teamInfo;

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        teamInfo: null,

        login: async (nniOrEmail: string, password: string) => {
          set({ isLoading: true, error: null }, false, "AUTH/LOGIN_START");
          try {
            const user = await loginUser(nniOrEmail, password);
            set(
              {
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                teamInfo: user.teamInfo ?? null,
              },
              false,
              "AUTH/LOGIN_SUCCESS"
            );
          } catch (err) {
            set(
              {
                isLoading: false,
                error:
                  err instanceof Error
                    ? err.message
                    : "Erreur de connexion",
              },
              false,
              "AUTH/LOGIN_ERROR"
            );
            throw err;
          }
        },

        register: async (data: RegisterData) => {
          set({ isLoading: true, error: null }, false, "AUTH/REGISTER_START");
          try {
            const user = await registerUser(data);
            set({ isLoading: false }, false, "AUTH/REGISTER_SUCCESS");
            return user;
          } catch (err) {
            set(
              {
                isLoading: false,
                error:
                  err instanceof Error
                    ? err.message
                    : "Erreur lors de l'inscription",
              },
              false,
              "AUTH/REGISTER_ERROR"
            );
            throw err;
          }
        },

        logout: () =>
          set(
            {
              user: null,
              teamInfo: null,
              isAuthenticated: false,
              error: null,
            },
            false,
            "AUTH/LOGOUT"
          ),

        refreshUser: async () => {
          const { user } = get();
          if (!user?.id) return;

          try {
            const freshUser = await fetchUserById(user.id);
            set(
              {
                user: freshUser,
                teamInfo: freshUser.teamInfo ?? null,
              },
              false,
              "AUTH/REFRESH_USER"
            );
          } catch {
            // Server unreachable — keep cached data
          }
        },

        updateTeamInfo: async (teamInfo: TeamInfo) => {
          const { user } = get();
          if (!user) throw new Error("Utilisateur non connecté");

          await patchUserTeamInfo(user.id, teamInfo);
          set(
            {
              user: { ...user, teamInfo },
              teamInfo,
            },
            false,
            "AUTH/UPDATE_TEAM_INFO"
          );
        },

        setLoading: (loading: boolean) =>
          set({ isLoading: loading }, false, "AUTH/SET_LOADING"),

        clearError: () =>
          set({ error: null }, false, "AUTH/CLEAR_ERROR"),
      }),
      {
        name: "csrd_auth",
        version: 1,
        migrate: (persistedState, version): PersistedAuthState => {
          const state = persistedState as Record<string, unknown>;
          if (version === 0) {
            // Migration from v0: add user field from existing teamInfo
            return {
              user: state.isAuthenticated
                ? {
                    id: "migrated",
                    role: "member" as const,
                    teamInfo: (state.teamInfo as TeamInfo) ?? null,
                  }
                : null,
              isAuthenticated: !!state.isAuthenticated,
              teamInfo: (state.teamInfo as TeamInfo) ?? null,
            };
          }
          return state as unknown as PersistedAuthState;
        },
        partialize: (state): PersistedAuthState => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          teamInfo: state.teamInfo,
        }),
        onRehydrateStorage: () => (state) => {
          if (state?.isAuthenticated && state?.user?.id) {
            // Re-fetch user from server to get latest status/teamInfo
            state.refreshUser().finally(() => {
              state.setLoading(false);
            });
          } else {
            state?.setLoading(false);
          }
        },
      }
    ),
    { name: "auth-store" }
  )
);
