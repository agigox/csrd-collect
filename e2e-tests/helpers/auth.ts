import { Page } from "@playwright/test";
import type { User } from "../../src/models/User";

/**
 * Sets up auth state in localStorage to bypass login.
 * The auth store uses the key "csrd_auth" with Zustand persist middleware (version 2).
 */
export async function loginAsMember(
  page: Page,
  team: User["team"] = {
    directionId: "dir-1",
    direction: "Maintenance",
    maintenanceCenterId: "mc-1",
    centre: "Aura",
    gmrId: "gmr-1",
    gmr: "GMR Lyon Est",
    teamId: "team-1",
    team: "Équipe Alpha",
  }
) {
  const user: User = {
    id: "member-1",
    nni: "AB123",
    lastName: "Neuville",
    firstName: "Julien",
    role: "member",
    team,
  };

  await page.addInitScript(
    ({ user, team }) => {
      const authState = {
        state: {
          user,
          isAuthenticated: true,
          team,
        },
        version: 2,
      };
      localStorage.setItem("csrd_auth", JSON.stringify(authState));
    },
    { user, team }
  );
}

/**
 * Sets up auth state as an admin (approved or pending).
 */
export async function loginAsAdmin(
  page: Page,
  status: "pending" | "approved" = "approved"
) {
  const user: User = {
    id: "admin-1",
    nni: "ZW456",
    lastName: "Dupont",
    firstName: "Marie",
    role: "admin",
    status,
  };

  await page.addInitScript(
    ({ user }) => {
      const authState = {
        state: {
          user,
          isAuthenticated: true,
          team: null,
        },
        version: 2,
      };
      localStorage.setItem("csrd_auth", JSON.stringify(authState));
    },
    { user }
  );
}

/**
 * Clears auth state so the user is logged out.
 */
export async function clearAuth(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("csrd_auth");
  });
}
