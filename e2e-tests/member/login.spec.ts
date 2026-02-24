import { test, expect } from "@playwright/test";
import { clearAuth, loginAsMember } from "../helpers/auth";
import {
  mockFormTemplates,
  mockDeclarations,
} from "../helpers/mock-data";

/**
 * Helper to select a value from an @rte-ds/react Select (combobox → menuitem).
 */
async function selectOption(
  page: import("@playwright/test").Page,
  comboboxId: string,
  optionLabel: string
) {
  await page.locator(`#${comboboxId}`).click();
  await page.getByRole("menuitem", { name: optionLabel }).click();
}

test.describe("Authentification membre", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);

    // Mock API calls so the app doesn't depend on the backend
    await page.route("**/form-templates", (route) =>
      route.fulfill({ json: mockFormTemplates })
    );
    await page.route("**/declarations", (route) =>
      route.fulfill({ json: mockDeclarations })
    );
  });

  test("affiche le modal de connexion sur la route membre", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Bienvenue sur le collecteur" })
    ).toBeVisible();
  });

  test("affiche la description du modal", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Avant de commencer, veuillez renseigner votre équipe")
    ).toBeVisible();
  });

  test("le bouton Valider est désactivé tant que les champs requis ne sont pas remplis", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Bienvenue sur le collecteur" })
    ).toBeVisible();

    const validerButton = page.getByRole("button", { name: "Valider" });
    await expect(validerButton).toBeDisabled();
  });

  test("sélectionner Direction et Centre active le bouton Valider", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Bienvenue sur le collecteur" })
    ).toBeVisible();

    await selectOption(page, "direction", "Maintenance");
    await selectOption(page, "centre", "Aura");

    const validerButton = page.getByRole("button", { name: "Valider" });
    await expect(validerButton).toBeEnabled();
  });

  test("la connexion sauvegarde l'authentification dans localStorage", async ({
    page,
  }) => {
    await page.goto("/");

    await selectOption(page, "direction", "Maintenance");
    await selectOption(page, "centre", "Aura");

    await page.getByRole("button", { name: "Valider" }).click();

    // Verify localStorage was set (don't wait for page render due to hooks order issue)
    await expect
      .poll(async () => {
        const authData = await page.evaluate(() =>
          localStorage.getItem("csrd_auth")
        );
        if (!authData) return null;
        return JSON.parse(authData);
      })
      .toBeTruthy();

    const authData = await page.evaluate(() =>
      localStorage.getItem("csrd_auth")
    );
    const parsed = JSON.parse(authData!);
    expect(parsed.state.isAuthenticated).toBe(true);
    expect(parsed.state.team.direction).toBe("Maintenance");
    expect(parsed.state.team.centre).toBe("Aura");
  });

  test("après authentification, la page des déclarations est visible au rechargement", async ({
    page,
  }) => {
    // Pre-authenticate via localStorage
    await loginAsMember(page);
    await page.goto("/");

    // Should see the declarations page directly, no login modal
    await expect(
      page.getByRole("heading", { name: "Déclarations" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Bienvenue sur le collecteur" })
    ).not.toBeVisible();
  });
});
