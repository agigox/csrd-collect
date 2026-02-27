import { test, expect } from "@playwright/test";
import { loginAsMember, loginAsAdmin } from "../helpers/auth";

const API_BASE_URL = "http://localhost:4000";
const REAL_API_URL =
  "http://dev-csrd-load-balancer-1990765532.eu-west-3.elb.amazonaws.com/api";

test.describe("Admin toggle switch", () => {
  test.beforeEach(async ({ page }) => {
    // Mock user refresh API (called on store rehydration)
    await page.route(`${API_BASE_URL}/users/*`, (route) =>
      route.fulfill({ status: 404, json: {} })
    );
    // Mock API calls (use specific hosts to avoid intercepting page navigation)
    await page.route(`${REAL_API_URL}/declarations`, (route) =>
      route.fulfill({ json: [] })
    );
    await page.route(`${REAL_API_URL}/form-templates`, (route) =>
      route.fulfill({ json: [] })
    );
    await page.route(`${API_BASE_URL}/category-codes`, (route) =>
      route.fulfill({ json: [] })
    );
  });

  test("le toggle admin est visible pour un utilisateur admin", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/declarations");
    await expect(page.getByTestId("admin-toggle")).toBeVisible();
  });

  test("le toggle admin n'est PAS visible pour un utilisateur membre", async ({
    page,
  }) => {
    await loginAsMember(page);
    await page.goto("/declarations");
    await expect(page.getByTestId("admin-toggle")).not.toBeVisible();
  });

  test("activer le toggle navigue vers /admin et affiche les menus admin", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/declarations");

    await page.getByTestId("admin-toggle").getByText("Admin").click();
    await expect(page).toHaveURL(/\/admin/);

    // Admin menu items should be visible
    await expect(
      page.getByRole("link", { name: "Admin. déclarations" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Admin. d'équipe" })
    ).toBeVisible();
  });

  test("désactiver le toggle navigue vers /declarations", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");

    // Wait for React to sync adminMode with pathname before clicking
    await expect(page.getByTestId("admin-toggle").getByRole("switch")).toBeChecked();
    await page.getByTestId("admin-toggle").getByText("Admin").click();
    await expect(page).toHaveURL(/\/declarations/);
  });

  test("un membre ne peut pas accéder aux routes /admin", async ({
    page,
  }) => {
    await loginAsMember(page);
    await page.goto("/admin");

    // Should be redirected to /declarations
    await expect(page).toHaveURL(/\/declarations/);
  });

  test("un admin peut accéder à /declarations et /admin", async ({
    page,
  }) => {
    await loginAsAdmin(page);

    // Access declarations
    await page.goto("/declarations");
    await expect(page).toHaveURL(/\/declarations/);

    // Access admin
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin/);
  });

  test("la sidebar affiche les infos d'équipe quand le toggle est OFF", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/declarations");

    // Team data should be visible when toggle is OFF (default on /declarations)
    await expect(page.getByText("Maintenance")).toBeVisible();
    await expect(page.getByText("GMR Lyon Est")).toBeVisible();
  });

  test("la sidebar masque les infos d'équipe quand le toggle est ON", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");

    // Team data should NOT be visible when in admin mode
    await expect(page.getByText("Maintenance")).not.toBeVisible();
  });
});
