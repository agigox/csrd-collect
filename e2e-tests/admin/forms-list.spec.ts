import { test, expect } from "@playwright/test";
import {
  mockFormTemplates,
  mockCategoryCodes,
} from "../helpers/mock-data";
import { loginAsAdmin } from "../helpers/auth";

const API_BASE_URL = "http://localhost:4000";
const REAL_API_URL =
  "http://dev-csrd-load-balancer-1990765532.eu-west-3.elb.amazonaws.com/api";

test.describe("Liste des formulaires admin - Redesign", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.route(`${API_BASE_URL}/users/*`, (route) =>
      route.fulfill({ status: 404, json: {} })
    );
    await page.route(`${REAL_API_URL}/form-templates`, (route) =>
      route.fulfill({ json: mockFormTemplates })
    );
    await page.route(`${API_BASE_URL}/category-codes`, (route) =>
      route.fulfill({ json: mockCategoryCodes })
    );
    await page.goto("/admin");
  });

  test("affiche le titre Admin. des déclarations", async ({ page }) => {
    await expect(page.getByText("Admin. des déclarations")).toBeVisible();
  });

  test("le bouton Créer un formulaire est visible et navigue vers /admin/new", async ({
    page,
  }) => {
    const createBtn = page.getByRole("button", {
      name: /Créer un formulaire/i,
    });
    await expect(createBtn).toBeVisible();
    await createBtn.click();
    await expect(page).toHaveURL(/\/admin\/new/);
  });

  test("la barre de recherche filtre les formulaires par nom", async ({
    page,
  }) => {
    // First accordion (E2-4) should be open by default, showing its forms
    await expect(page.getByText("Fuite d'huile")).toBeVisible();

    // Search for a specific form
    const searchbar = page.getByLabel("Rechercher");
    await searchbar.fill("Incident");

    // Only matching form should be visible
    await expect(page.getByText("Incident de sécurité")).toBeVisible();
    await expect(page.getByText("Fuite d'huile")).not.toBeVisible();
  });

  test("la recherche peut être effacée", async ({ page }) => {
    const searchbar = page.getByLabel("Rechercher");
    await searchbar.fill("Incident");
    await expect(page.getByText("Fuite d'huile")).not.toBeVisible();

    // Clear search
    await searchbar.clear();
    await expect(page.getByText("Fuite d'huile")).toBeVisible();
  });

  test("affiche un message quand aucun formulaire ne correspond", async ({
    page,
  }) => {
    const searchbar = page.getByLabel("Rechercher");
    await searchbar.fill("zzzznonexistent");
    await expect(page.getByText("Aucun formulaire trouvé")).toBeVisible();
  });

  test("les accordéons groupent les formulaires par catégorie", async ({
    page,
  }) => {
    await expect(page.getByTestId("accordion-E2-4")).toBeVisible();
    await expect(page.getByTestId("accordion-E1-2")).toBeVisible();
    await expect(page.getByTestId("accordion-E3-2")).toBeVisible();
  });

  test("cliquer sur un formulaire ouvre le panneau de détail", async ({
    page,
  }) => {
    await page.getByText("Fuite d'huile").click();
    const panel = page.locator("[data-slot='dialog-content']");
    await expect(panel.getByText("Fuite d'huile")).toBeVisible();
  });

  test("le panneau affiche le statut et les boutons", async ({ page }) => {
    await page.getByText("Fuite d'huile").click();
    const panel = page.locator("[data-slot='dialog-content']");
    // Status chip for published form
    await expect(panel.getByText("Publié")).toBeVisible();
    // Edit button always visible
    await expect(
      panel.getByRole("button", { name: /diter/i })
    ).toBeVisible();
    // Publish button NOT visible for published form
    await expect(
      panel.getByRole("button", { name: /Publier/i })
    ).not.toBeVisible();
  });

  test("le bouton Publier est visible uniquement pour les formulaires en brouillon", async ({
    page,
  }) => {
    // Click on the draft form (Audit environnemental - form-4)
    await page.getByText("Audit environnemental").click();
    const panel = page.locator("[data-slot='dialog-content']");
    await expect(panel.getByText("Essai")).toBeVisible();
    await expect(
      panel.getByRole("button", { name: /Publier/i })
    ).toBeVisible();
  });

  test("publier un formulaire appelle l'API", async ({ page }) => {
    let publishCalled = false;
    await page.route(
      `${REAL_API_URL}/form-templates/form-4/publish`,
      (route) => {
        publishCalled = true;
        const draftForm = mockFormTemplates.find((f) => f.id === "form-4");
        route.fulfill({
          json: {
            ...draftForm,
            isPublished: true,
            publishedAt: new Date().toISOString(),
          },
        });
      }
    );

    await page.getByText("Audit environnemental").click();
    const panel = page.locator("[data-slot='dialog-content']");
    await panel.getByRole("button", { name: /Publier/i }).click();
    await page.waitForTimeout(2000);
    expect(publishCalled).toBe(true);
  });

  test("le bouton close ferme le panneau", async ({ page }) => {
    await page.getByText("Fuite d'huile").click();
    const panel = page.locator("[data-slot='dialog-content']");
    await expect(panel).toBeVisible();

    await panel.getByRole("button", { name: /close/i }).click();
    await expect(panel).not.toBeVisible();
  });
});
