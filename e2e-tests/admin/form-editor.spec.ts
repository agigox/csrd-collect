import { test, expect } from "@playwright/test";
import {
  mockFormTemplates,
  mockCategoryCodes,
} from "../helpers/mock-data";
import { loginAsAdmin } from "../helpers/auth";

const API_BASE_URL = "http://localhost:4000";
const REAL_API_URL = "http://dev-csrd-load-balancer-1990765532.eu-west-3.elb.amazonaws.com/api";

test.describe("Éditeur de formulaire admin", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.route(`${API_BASE_URL}/users/*`, (route) =>
      route.fulfill({ status: 404, json: {} })
    );

    // Mock API calls
    await page.route(`${REAL_API_URL}/form-templates`, (route) => {
      if (route.request().method() === "POST") {
        const body = route.request().postDataJSON();
        return route.fulfill({
          json: {
            id: "form-new",
            ...body,
            version: 1,
            isPublished: false,
            publishedAt: null,
            parentTemplateId: null,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }
      return route.fulfill({ json: mockFormTemplates });
    });
    await page.route(`${REAL_API_URL}/form-templates/*`, (route) => {
      if (route.request().method() === "PATCH") {
        const body = route.request().postDataJSON();
        return route.fulfill({
          json: { ...mockFormTemplates[0], ...body },
        });
      }
      if (route.request().method() === "DELETE") {
        return route.fulfill({ status: 200, json: {} });
      }
      return route.fulfill({ json: mockFormTemplates[0] });
    });
    await page.route(`${API_BASE_URL}/category-codes`, (route) =>
      route.fulfill({ json: mockCategoryCodes })
    );

    // Navigate to admin and click on the first form card heading to open editor
    await page.goto("/admin");
    await page.getByRole("heading", { name: "Fuite d'huile" }).click();
    await page.waitForURL(/\/admin\/parametrage-declaratif/);
  });

  test("le bouton Retour est présent", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Retour" })
    ).toBeVisible();
  });

  test("le bouton Retour navigue vers le dashboard admin", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Retour" }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("le titre du formulaire est affiché en mode édition", async ({
    page,
  }) => {
    // In edit mode, the title area shows the form name instead of the placeholder
    await expect(
      page.getByText("Fuite d'huile", { exact: true })
    ).toBeVisible();
  });

  test("le champ catégorie est présent", async ({ page }) => {
    await expect(page.getByText("Catégorie")).toBeVisible();
  });

  test("le champ description est présent", async ({ page }) => {
    await expect(page.getByText("Description")).toBeVisible();
  });

  test("les champs du formulaire sont affichés", async ({ page }) => {
    // The mock form has 2 fields: "Localisation" and "Gravité"
    // In the editor, they are displayed as sortable field cards with their labels
    await expect(page.getByText("Localisation")).toBeVisible();
  });

  test("le bouton Prévisualiser est présent", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Prévisualiser" })
    ).toBeVisible();
  });

  test("cliquer sur Prévisualiser affiche le panneau de prévisualisation", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Prévisualiser" }).click();
    await expect(page.getByText("Pré visualisation")).toBeVisible();
  });

  test("le bouton Enregistrer est présent", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Enregistrer" })
    ).toBeVisible();
  });

  test("le bouton Supprimer est présent en mode édition", async ({
    page,
  }) => {
    // The delete button uses aria-label "Supprimer le formulaire"
    const deleteButton = page.getByRole("button", {
      name: "Supprimer le formulaire",
    });
    await expect(deleteButton).toBeVisible();
  });
});
