import { test, expect } from "@playwright/test";
import { clearAuth } from "../helpers/auth";

test.describe("Inscription — Étape 1 (identité)", () => {
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
    await expect(page.getByTestId("input-lastName")).toBeVisible();
    await expect(page.getByTestId("input-firstName")).toBeVisible();
    await expect(page.getByTestId("input-nni")).toBeVisible();
    await expect(page.getByTestId("input-email")).toBeVisible();
  });

  test("le bouton Poursuivre est désactivé sans NNI et email valides", async ({
    page,
  }) => {
    const btn = page.getByTestId("btn-poursuivre");
    await expect(btn).toBeDisabled();

    // Only NNI filled — still disabled (email missing)
    await page.getByTestId("input-nni").fill("AB123");
    await expect(btn).toBeDisabled();
  });

  test("le bouton Poursuivre est désactivé avec seulement un email valide", async ({
    page,
  }) => {
    await page.getByTestId("input-email").fill("user@rte-france.com");
    await expect(page.getByTestId("btn-poursuivre")).toBeDisabled();
  });

  test("le bouton Poursuivre s'active avec un NNI et un email valides", async ({
    page,
  }) => {
    await page.getByTestId("input-nni").fill("AB123");
    await page.getByTestId("input-email").fill("user@rte-france.com");
    await expect(page.getByTestId("btn-poursuivre")).toBeEnabled();
  });

  test("le NNI est converti en majuscules automatiquement", async ({
    page,
  }) => {
    await page.getByTestId("input-nni").fill("ab123");
    await expect(page.getByTestId("input-nni")).toHaveValue("AB123");
  });

  test("l'email est converti en minuscules automatiquement", async ({
    page,
  }) => {
    await page.getByTestId("input-email").fill("User@RTE-France.COM");
    await expect(page.getByTestId("input-email")).toHaveValue(
      "user@rte-france.com"
    );
  });

  test("affiche une erreur pour un NNI avec caractères spéciaux", async ({
    page,
  }) => {
    const nniInput = page.getByTestId("input-nni");
    await nniInput.fill("AB@12");
    await nniInput.blur();
    await expect(
      page.getByText(/caractères alphanumériques/i)
    ).toBeVisible();
  });

  test("affiche une erreur pour un email invalide", async ({ page }) => {
    const emailInput = page.getByTestId("input-email");
    await emailInput.fill("invalid-email");
    await emailInput.blur();
    await expect(page.getByText(/adresse email valide/i)).toBeVisible();
  });

  test("le formulaire ne contient pas de sélecteur de rôle", async ({ page }) => {
    await expect(page.getByTestId("role-selector")).not.toBeVisible();
  });

  test("naviguer vers l'étape 2 en cliquant sur Poursuivre", async ({
    page,
  }) => {
    await page.getByTestId("input-lastName").fill("Dupont");
    await page.getByTestId("input-firstName").fill("Marie");
    await page.getByTestId("input-nni").fill("AB123");
    await page.getByTestId("input-email").fill("marie.dupont@rte-france.com");

    await page.getByTestId("btn-poursuivre").click();
    await expect(page).toHaveURL(/\/register\/password/);
    await expect(page).toHaveURL(/nni=AB123/);
    await expect(page).toHaveURL(/email=marie\.dupont%40rte-france\.com/);
  });

  test("le lien Se connecter redirige vers /login", async ({ page }) => {
    await expect(page.getByTestId("link-se-connecter")).toHaveAttribute(
      "href",
      "/login"
    );
  });
});
