import { test, expect } from "@playwright/test";
import {
  mockFormTemplates,
  mockCategoryCodes,
} from "../helpers/mock-data";

test.describe("Navigation admin", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls
    await page.route("**/form-templates", (route) =>
      route.fulfill({ json: mockFormTemplates })
    );
    await page.route("**/category-codes", (route) =>
      route.fulfill({ json: mockCategoryCodes })
    );
  });

  test("la page admin se charge sans modal de connexion", async ({
    page,
  }) => {
    await page.goto("/admin");

    // No login modal should appear
    await expect(
      page.getByRole("heading", { name: "Bienvenue sur le collecteur" })
    ).not.toBeVisible();

    // Admin content should be visible
    await expect(
      page.getByText("Administration des formulaires de déclaration")
    ).toBeVisible();
  });

  test("la sidebar affiche le titre Administration", async ({ page }) => {
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Administration" })
    ).toBeVisible();
  });

  test("la sidebar contient les éléments de menu admin", async ({
    page,
  }) => {
    await page.goto("/admin");

    await expect(
      page.getByRole("link", { name: "Administration d'équipe" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Paramètrage déclaratif" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Gestion des données" })
    ).toBeVisible();
  });

  test("le titre de la page est correct", async ({ page }) => {
    await page.goto("/admin");
    await expect(
      page.getByText("Administration des formulaires de déclaration")
    ).toBeVisible();
  });

  test("cliquer sur Gestion des données navigue vers la bonne route", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.getByRole("link", { name: "Gestion des données" }).click();
    await expect(page).toHaveURL(/\/admin\/gestion-donnees/);
  });

  test("cliquer sur Paramètrage déclaratif navigue vers la bonne route", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.getByRole("link", { name: "Paramètrage déclaratif" }).click();
    await expect(page).toHaveURL(/\/admin\/parametrage-declaratif/);
  });
});
