import { test, expect } from "@playwright/test";
import { clearAuth, loginAsMember, loginAsAdmin } from "../helpers/auth";

const API_BASE_URL = "http://localhost:4000";

const mockMemberUser = {
  id: "1",
  nni: "AB123",
  nom: "Neuville",
  prenom: "Julien",
  role: "member",
  password: "Abcdef1#ghijk!",
  team: null,
};

const mockAdminApproved = {
  id: "3",
  nni: "ZW456",
  nom: "Dupont",
  prenom: "Marie",
  role: "admin",
  status: "approved",
  password: "Admin1#secure!",
};

test.describe("Connexion", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);

    // Mock user lookup
    await page.route(`${API_BASE_URL}/users*`, (route) => {
      const url = new URL(route.request().url());
      const nni = url.searchParams.get("nni");
      const email = url.searchParams.get("email");

      if (nni === "AB123") {
        return route.fulfill({ json: [mockMemberUser] });
      }
      if (nni === "ZW456") {
        return route.fulfill({ json: [mockAdminApproved] });
      }
      if (email || nni) {
        return route.fulfill({ json: [] });
      }
      return route.continue();
    });
  });

  test("affiche le formulaire de connexion", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: "Se connecter" })
    ).toBeVisible();
    await expect(page.getByTestId("input-nni-email")).toBeVisible();
    await expect(page.getByTestId("input-password")).toBeVisible();
  });

  test("le bouton Se connecter est désactivé tant que les champs sont vides", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page.getByTestId("btn-se-connecter")).toBeDisabled();
  });

  test("le bouton Se connecter s'active quand les deux champs sont remplis", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByTestId("input-nni-email").fill("AB123");
    await page.getByTestId("input-password").fill("password");
    await expect(page.getByTestId("btn-se-connecter")).toBeEnabled();
  });

  test("affiche une erreur avec des identifiants incorrects", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByTestId("input-nni-email").fill("WRONG");
    await page.getByTestId("input-password").fill("wrong");
    await page.getByTestId("btn-se-connecter").click();

    await expect(page.getByTestId("login-error")).toBeVisible();
  });

  test("affiche une erreur avec un mot de passe incorrect", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByTestId("input-nni-email").fill("AB123");
    await page.getByTestId("input-password").fill("wrongpassword");
    await page.getByTestId("btn-se-connecter").click();

    await expect(page.getByTestId("login-error")).toBeVisible();
  });

  test("connexion membre réussie redirige vers /declarations", async ({
    page,
  }) => {
    await page.route("**/declarations", (route) =>
      route.fulfill({ json: [] })
    );
    await page.route("**/form-templates", (route) =>
      route.fulfill({ json: [] })
    );

    await page.goto("/login");
    await page.getByTestId("input-nni-email").fill("AB123");
    await page.getByTestId("input-password").fill("Abcdef1#ghijk!");
    await page.getByTestId("btn-se-connecter").click();

    await expect(page).toHaveURL(/\/declarations/);
  });

  test("connexion admin approuvé redirige vers /admin", async ({ page }) => {
    await page.route("**/form-templates", (route) =>
      route.fulfill({ json: [] })
    );

    await page.goto("/login");
    await page.getByTestId("input-nni-email").fill("ZW456");
    await page.getByTestId("input-password").fill("Admin1#secure!");
    await page.getByTestId("btn-se-connecter").click();

    await expect(page).toHaveURL(/\/admin/);
  });

  test("un utilisateur authentifié (membre) est redirigé depuis /login", async ({
    page,
  }) => {
    await page.route("**/declarations", (route) =>
      route.fulfill({ json: [] })
    );
    await page.route("**/form-templates", (route) =>
      route.fulfill({ json: [] })
    );

    await loginAsMember(page);
    await page.goto("/login");

    // AuthGuard should redirect authenticated member to declarations
    await expect(page).toHaveURL(/\/declarations/);
  });

  test("un utilisateur authentifié (admin) est redirigé depuis /login", async ({
    page,
  }) => {
    await page.route("**/form-templates", (route) =>
      route.fulfill({ json: [] })
    );

    await loginAsAdmin(page, "approved");
    await page.goto("/login");

    await expect(page).toHaveURL(/\/admin/);
  });

  test("le lien S'inscrire pointe vers /register", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByTestId("link-sinscrire")).toHaveAttribute(
      "href",
      "/register"
    );
  });
});
