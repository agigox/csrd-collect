import { test, expect } from "@playwright/test";
import { clearAuth } from "../helpers/auth";

const API_BASE_URL = "http://localhost:4000";

test.describe("Inscription — Étape 2 (mot de passe)", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);

    // Mock the register API
    await page.route(`${API_BASE_URL}/users`, (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 201,
          json: {
            id: "new-user-1",
            nni: "AB123",
            email: "marie.dupont@rte-france.com",
            lastName: "Dupont",
            firstName: "Marie",
            role: "member",
            status: "pending",
            team: null,
          },
        });
      }
      return route.continue();
    });

    // Navigate to step 2 with query params (simulating step 1 completion)
    await page.goto(
      "/register/password?nni=AB123&email=marie.dupont%40rte-france.com&lastName=Dupont&firstName=Marie"
    );
  });

  test("affiche les champs mot de passe et confirmation", async ({ page }) => {
    await expect(page.getByTestId("input-password")).toBeVisible();
    await expect(page.getByTestId("input-confirm-password")).toBeVisible();
  });

  test("le bouton S'inscrire est désactivé initialement", async ({ page }) => {
    await expect(page.getByTestId("btn-sinscrire")).toBeDisabled();
  });

  test("l'indicateur de force affiche Faible pour un mot de passe court", async ({
    page,
  }) => {
    await page.getByTestId("input-password").fill("abc");
    await expect(page.getByTestId("strength-label")).toContainText("Faible");
  });

  test("l'indicateur de force affiche Moyen pour un mot de passe moyen", async ({
    page,
  }) => {
    await page.getByTestId("input-password").fill("Abcdef1#");
    await expect(page.getByTestId("strength-label")).toContainText("Moyen");
  });

  test("l'indicateur de force affiche Fort pour un mot de passe robuste", async ({
    page,
  }) => {
    await page.getByTestId("input-password").fill("Abcdef1#ghijk!");
    await expect(page.getByTestId("strength-label")).toContainText("Fort");
  });

  test("le bouton S'inscrire est désactivé avec un mot de passe moyen", async ({
    page,
  }) => {
    await page.getByTestId("input-password").fill("Abcdef1#");
    await page.getByTestId("input-confirm-password").fill("Abcdef1#");
    await expect(page.getByTestId("btn-sinscrire")).toBeDisabled();
  });

  test("le bouton S'inscrire est désactivé si les mots de passe ne correspondent pas", async ({
    page,
  }) => {
    await page.getByTestId("input-password").fill("Abcdef1#ghijk!");
    await page.getByTestId("input-confirm-password").fill("different");
    await expect(page.getByTestId("btn-sinscrire")).toBeDisabled();
  });

  test("le bouton S'inscrire s'active quand le mot de passe est fort et les deux champs correspondent", async ({
    page,
  }) => {
    await page.getByTestId("input-password").fill("Abcdef1#ghijk!");
    await page.getByTestId("input-confirm-password").fill("Abcdef1#ghijk!");
    await expect(page.getByTestId("btn-sinscrire")).toBeEnabled();
  });

  test("soumettre l'inscription redirige vers /login", async ({ page }) => {
    await page.getByTestId("input-password").fill("Abcdef1#ghijk!");
    await page.getByTestId("input-confirm-password").fill("Abcdef1#ghijk!");
    await page.getByTestId("btn-sinscrire").click();

    await expect(page).toHaveURL(/\/login/);
  });

  test("redirige vers /register si nni manquant", async ({ page }) => {
    await page.goto(
      "/register/password?email=marie.dupont%40rte-france.com"
    );
    await expect(page).toHaveURL(/\/register$/);
  });

  test("redirige vers /register si email manquant", async ({ page }) => {
    await page.goto("/register/password?nni=AB123");
    await expect(page).toHaveURL(/\/register$/);
  });

  test("affiche la mention légale", async ({ page }) => {
    await expect(
      page.getByText(/conditions générales d'utilisation/i)
    ).toBeVisible();
  });
});
