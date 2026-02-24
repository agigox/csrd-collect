import { test, expect } from "@playwright/test";
import {
  mockFormTemplates,
  mockCategoryCodes,
} from "../helpers/mock-data";

test.describe("Liste des formulaires admin", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls
    await page.route("**/form-templates", (route) =>
      route.fulfill({ json: mockFormTemplates })
    );
    await page.route("**/category-codes", (route) =>
      route.fulfill({ json: mockCategoryCodes })
    );

    await page.goto("/admin");
  });

  test("affiche la liste des cartes de formulaires", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Fuite d'huile" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Incident de sécurité" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Contrôle qualité" })
    ).toBeVisible();
  });

  test("affiche les codes des formulaires", async ({ page }) => {
    await expect(page.getByText("E2-1234_01")).toBeVisible();
    await expect(page.getByText("E1-5678_02")).toBeVisible();
    await expect(page.getByText("E3-9012_03")).toBeVisible();
  });

  test("le SegmentedControl affiche les catégories", async ({ page }) => {
    await expect(page.getByRole("radio", { name: "Tous" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "E1-2" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "E2-4" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "E3-2" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "E4-2" })).toBeVisible();
  });

  test("filtrer par catégorie E2-4 affiche uniquement les formulaires correspondants", async ({
    page,
  }) => {
    // Click the E2-4 segment (radio role)
    await page.getByRole("radio", { name: "E2-4" }).click();

    // Should show E2-4 form
    await expect(
      page.getByRole("heading", { name: "Fuite d'huile" })
    ).toBeVisible();

    // Should NOT show E1-2 or E3-2 forms
    await expect(
      page.getByRole("heading", { name: "Incident de sécurité" })
    ).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Contrôle qualité" })
    ).not.toBeVisible();
  });

  test("filtrer par catégorie E1-2 affiche uniquement les formulaires correspondants", async ({
    page,
  }) => {
    await page.getByRole("radio", { name: "E1-2" }).click();

    await expect(
      page.getByRole("heading", { name: "Incident de sécurité" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Fuite d'huile" })
    ).not.toBeVisible();
  });

  test("revenir à Tous affiche tous les formulaires", async ({ page }) => {
    // Filter first
    await page.getByRole("radio", { name: "E2-4" }).click();
    await expect(
      page.getByRole("heading", { name: "Incident de sécurité" })
    ).not.toBeVisible();

    // Go back to all
    await page.getByRole("radio", { name: "Tous" }).click();

    await expect(
      page.getByRole("heading", { name: "Fuite d'huile" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Incident de sécurité" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Contrôle qualité" })
    ).toBeVisible();
  });

  test("cliquer sur une carte de formulaire navigue vers le paramétrage", async ({
    page,
  }) => {
    await page.getByRole("heading", { name: "Fuite d'huile" }).click();
    await expect(page).toHaveURL(/\/admin\/parametrage-declaratif/);
  });
});
