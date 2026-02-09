import { Page } from "@playwright/test";

/**
 * Sets up auth state in localStorage to bypass the login modal.
 * The auth store uses the key "csrd_auth" with Zustand persist middleware.
 */
export async function loginAsMember(
  page: Page,
  teamInfo = {
    direction: "Maintenance",
    centre: "Aura",
    gmr: "",
    equipe: "",
  }
) {
  await page.addInitScript((info) => {
    const authState = {
      state: {
        isAuthenticated: true,
        teamInfo: info,
        isLoading: false,
      },
      version: 0,
    };
    localStorage.setItem("csrd_auth", JSON.stringify(authState));
  }, teamInfo);
}

/**
 * Clears auth state so the login modal appears.
 */
export async function clearAuth(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("csrd_auth");
  });
}
