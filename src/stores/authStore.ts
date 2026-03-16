import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { User, RegisterData } from "@/models/User";
import type { Team } from "@/models/User";
import {
  loginUser,
  registerUser,
  patchCurrentUserTeam,
  fetchCurrentUser,
  setAccessToken,
} from "@/api/users";
import { useDeclarationsStore } from "./declarationsStore";

interface AuthState {
  // Core state
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Backward-compatible field
  team: Team | null;

  // Actions
  login: (nniOrEmail: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateTeam: (team: Team) => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

// Shape persisted to / restored from sessionStorage
interface PersistedAuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  team: Team | null;
}

// Computed selectors (use outside the store via useAuthStore(selectX))
export const selectIsAdmin = (state: AuthState) => {
  const role = state.user?.role;
  return role === "ADMIN" || role === "SUPER_ADMIN";
};
export const selectIsSuperAdmin = (state: AuthState) =>
  state.user?.role === "SUPER_ADMIN";
export const selectIsMember = (state: AuthState) => {
  const role = state.user?.role;
  return role === "OPERATOR" || role === "TEAM_LEADER";
};
export const selectIsPendingApproval = (state: AuthState) => {
  const status = state.user?.status;
  return status === "PENDING";
};
export const selectNeedsTeamOnboarding = (state: AuthState) =>
  !!state.user && !selectIsPendingApproval(state) && !selectIsAdmin(state) && !state.user.team && !state.user.teamId;

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        team: null,

        login: async (nniOrEmail: string, password: string) => {
          set({ isLoading: true, error: null }, false, "AUTH/LOGIN_START");
          try {
            const { user, access_token } = await loginUser(nniOrEmail, password);
            setAccessToken(access_token);
            set(
              {
                user,
                accessToken: access_token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                team: user.team ?? null,
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

        logout: () => {
          setAccessToken(null);
          useDeclarationsStore.getState().reset();
          set(
            {
              user: null,
              accessToken: null,
              team: null,
              isAuthenticated: false,
              error: null,
            },
            false,
            "AUTH/LOGOUT"
          );
        },

        refreshUser: async () => {
          const { accessToken } = get();
          if (!accessToken) return;

          // Restore token in API module on rehydration
          setAccessToken(accessToken);

          try {
            const freshUser = await fetchCurrentUser();
            set(
              {
                user: freshUser,
                team: freshUser.team ?? null,
              },
              false,
              "AUTH/REFRESH_USER"
            );
          } catch {
            // Server unreachable — keep cached data
          }
        },

        updateTeam: async (team: Team) => {
          const { user } = get();
          if (!user) throw new Error("Utilisateur non connecté");

          await patchCurrentUserTeam(team);
          set(
            {
              user: { ...user, team },
              team,
            },
            false,
            "AUTH/UPDATE_TEAM"
          );
        },

        setLoading: (loading: boolean) =>
          set({ isLoading: loading }, false, "AUTH/SET_LOADING"),

        clearError: () =>
          set({ error: null }, false, "AUTH/CLEAR_ERROR"),
      }),
      {
        name: "csrd_auth",
        version: 4,
        storage: createJSONStorage(() => sessionStorage),
        migrate: (persistedState, version): PersistedAuthState => {
          const state = persistedState as Record<string, unknown>;
          if (version < 4) {
            // Clear all old state — force re-login
            return {
              user: null,
              accessToken: null,
              isAuthenticated: false,
              team: null,
            };
          }
          return state as unknown as PersistedAuthState;
        },
        partialize: (state): PersistedAuthState => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
          team: state.team,
        }),
        onRehydrateStorage: () => (state) => {
          if (state?.isAuthenticated && state?.accessToken) {
            // Restore token in API module
            setAccessToken(state.accessToken);
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
