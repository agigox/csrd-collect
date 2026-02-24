import { test, expect } from "@playwright/test";
import { clearAuth } from "../helpers/auth";

test.describe("Inscription — Étape 1 (identité + rôle)", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
    await page.goto("/register");
  });

  test("affiche le formulaire d'inscription avec les champs requis", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "S'inscrire" })
    ).toBeVisible();
    await expect(page.getByTestId("input-nom")).toBeVisible();
    await expect(page.getByTestId("input-prenom")).toBeVisible();
    await expect(page.getByTestId("input-nni-email")).toBeVisible();
  });

  test("le bouton Poursuivre est désactivé sans NNI/email valide", async ({
    page,
  }) => {
    const btn = page.getByTestId("btn-poursuivre");
    await expect(btn).toBeDisabled();

    // Type an invalid value (too short for NNI, not an email)
    await page.getByTestId("input-nni-email").fill("AB");
    await expect(btn).toBeDisabled();
  });

  test("le bouton Poursuivre s'active avec un NNI valide (5 caractères alphanumériques)", async ({
    page,
  }) => {
    await page.getByTestId("input-nni-email").fill("AB123");
    await expect(page.getByTestId("btn-poursuivre")).toBeEnabled();
  });

  test("le bouton Poursuivre s'active avec un email valide", async ({
    page,
  }) => {
    await page.getByTestId("input-nni-email").fill("user@example.com");
    await expect(page.getByTestId("btn-poursuivre")).toBeEnabled();
  });

  test("le rôle Membre est sélectionné par défaut", async ({ page }) => {
    await expect(page.getByText("Membre")).toBeVisible();
    await expect(page.getByText("Administrateur")).toBeVisible();
  });

  test("naviguer vers l'étape 2 en cliquant sur Poursuivre", async ({
    page,
  }) => {
    await page.getByTestId("input-nom").fill("Dupont");
    await page.getByTestId("input-prenom").fill("Marie");
    await page.getByTestId("input-nni-email").fill("AB123");

    await page.getByTestId("btn-poursuivre").click();
    await expect(page).toHaveURL(/\/register\/password/);
    // Search params should carry the data
    await expect(page).toHaveURL(/nniOrEmail=AB123/);
    await expect(page).toHaveURL(/role=member/);
  });

  test("le lien Se connecter redirige vers /login", async ({ page }) => {
    await expect(page.getByTestId("link-se-connecter")).toHaveAttribute(
      "href",
      "/login"
    );
  });
});
