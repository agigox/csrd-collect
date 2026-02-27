import { test, expect } from "@playwright/test";
import {
  mockFormTemplates,
  mockCategoryCodes,
} from "../helpers/mock-data";
import { loginAsAdmin } from "../helpers/auth";

const API_BASE_URL = "http://localhost:4000";
const REAL_API_URL = "http://dev-csrd-load-balancer-1990765532.eu-west-3.elb.amazonaws.com/api";

test.describe("Navigation admin", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Mock API calls
    await page.route(`${API_BASE_URL}/users/*`, (route) =>
      route.fulfill({ status: 404, json: {} })
    );
    await page.route(`${REAL_API_URL}/form-templates`, (route) =>
      route.fulfill({ json: mockFormTemplates })
    );
    await page.route(`${API_BASE_URL}/category-codes`, (route) =>
      route.fulfill({ json: mockCategoryCodes })
    );
    await page.route(`${REAL_API_URL}/declarations`, (route) =>
      route.fulfill({ json: [] })
    );
  });

  test("la page admin se charge correctement pour un admin authentifié", async ({
    page,
  }) => {
    await page.goto("/admin");

    // Admin content should be visible
    await expect(
      page.getByText("Administration des formulaires de déclaration")
    ).toBeVisible();
  });

  test("la sidebar affiche le titre CSRD collecte", async ({ page }) => {
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "CSRD collecte" })
    ).toBeVisible();
  });

  test("la sidebar contient les éléments de menu admin", async ({
    page,
  }) => {
    await page.goto("/admin");

    await expect(
      page.getByRole("link", { name: "Admin. déclarations" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Admin. d'équipe" })
    ).toBeVisible();
    await expect(
      page.locator("nav").getByRole("link", { name: "Déclarations" })
    ).toBeVisible();
  });

  test("le titre de la page est correct", async ({ page }) => {
    await page.goto("/admin");
    await expect(
      page.getByText("Administration des formulaires de déclaration")
    ).toBeVisible();
  });

  test("cliquer sur Admin. d'équipe navigue vers la bonne route", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.getByRole("link", { name: "Admin. d'équipe" }).click();
    await expect(page).toHaveURL(/\/admin\/gestion-donnees/);
  });

  test("cliquer sur Déclarations navigue vers /declarations", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.locator("nav").getByRole("link", { name: "Déclarations" }).click();
    await expect(page).toHaveURL(/\/declarations/);
  });
});
