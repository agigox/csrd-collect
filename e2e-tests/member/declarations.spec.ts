import { test, expect } from "@playwright/test";
import { loginAsMember } from "../helpers/auth";
import {
  mockFormTemplates,
  mockDeclarations,
} from "../helpers/mock-data";

test.describe("Page des déclarations", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMember(page);

    // Mock API calls
    await page.route("**/form-templates", (route) =>
      route.fulfill({ json: mockFormTemplates })
    );
    await page.route("**/declarations", (route) =>
      route.fulfill({ json: mockDeclarations })
    );

    await page.goto("/");
  });

  test("affiche le titre Déclarations", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Déclarations" })
    ).toBeVisible();
  });

  test("affiche les cartes de déclarations", async ({ page }) => {
    // Wait for declarations to load — use author names which are unique per card
    await expect(page.getByText("Jean Dupont")).toBeVisible();
    await expect(page.getByText("Marie Martin")).toBeVisible();
  });

  test("les cartes affichent l'auteur et la description", async ({
    page,
  }) => {
    await expect(page.getByText("Jean Dupont")).toBeVisible();
    await expect(
      page.getByText("Fuite détectée au niveau du transformateur T3")
    ).toBeVisible();
  });

  test("le bouton Déclarer est présent", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Déclarer" })
    ).toBeVisible();
  });

  test("le bouton Déclarer ouvre le dialogue de sélection de formulaire", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Déclarer" }).click();
    await expect(
      page.getByRole("heading", { name: "Nouvelle déclaration" })
    ).toBeVisible();
  });

  test("le bouton filtre affiche/masque le panneau de filtres", async ({
    page,
  }) => {
    // Filter panel should be hidden initially
    await expect(page.getByText("Type de déclaration")).not.toBeVisible();

    // Click the filter toggle button
    const filterButton = page.getByRole("button", {
      name: "Afficher/masquer les filtres",
    });
    await filterButton.click();

    // Filter panel should now be visible
    await expect(page.getByText("Type de déclaration")).toBeVisible();
    await expect(page.getByText("Utilisateurs")).toBeVisible();
  });

  test("le panneau de filtres contient les sections attendues", async ({
    page,
  }) => {
    // Open filters
    const filterButton = page.getByRole("button", {
      name: "Afficher/masquer les filtres",
    });
    await filterButton.click();

    await expect(page.getByText("Type de déclaration")).toBeVisible();
    await expect(page.getByText("Utilisateurs")).toBeVisible();
  });
});
