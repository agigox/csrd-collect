import { test, expect } from "@playwright/test";
import {
  mockFormTemplates,
  mockCategoryCodes,
} from "../helpers/mock-data";

test.describe("Embranchement conditionnel", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls
    await page.route("**/form-templates", (route) => {
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
    await page.route("**/form-templates/*", (route) => {
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
    await page.route("**/category-codes", (route) =>
      route.fulfill({ json: mockCategoryCodes })
    );

    // Navigate directly to the form editor (new form mode = empty schema)
    await page.goto("/admin/parametrage-declaratif");
  });

  test("le bouton embranchement est visible uniquement pour les champs radio", async ({ page }) => {
    await page.getByRole("button", { name: "Ajouter un champ" }).click();
    await page.getByText("Choix unique").click();

    await expect(
      page.getByRole("button", { name: "Embranchement conditionnel" })
    ).toBeVisible();
  });

  test("le bouton embranchement est absent pour un champ texte", async ({ page }) => {
    await page.getByRole("button", { name: "Ajouter un champ" }).click();
    await page.getByText("Champ libre").click();

    await expect(
      page.getByRole("button", { name: "Embranchement conditionnel" })
    ).not.toBeVisible();
  });

  test("le bouton embranchement est visible pour les champs checkbox", async ({ page }) => {
    await page.getByRole("button", { name: "Ajouter un champ" }).click();
    await page.getByText("Choix multiple").click();

    await expect(
      page.getByRole("button", { name: "Embranchement conditionnel" })
    ).toBeVisible();
  });

  test("cliquer sur embranchement affiche les multi-selects avec 'Aucun' par défaut", async ({ page }) => {
    await page.getByRole("button", { name: "Ajouter un champ" }).click();
    await page.getByText("Choix unique").click();

    await page.getByRole("button", { name: "Embranchement conditionnel" }).click();

    const branchingSelects = page.locator('[id^="branching-"]');
    await expect(branchingSelects.first()).toBeVisible();

    // Each branching select should show "Aucun" when no field types are selected
    await expect(branchingSelects.first()).toContainText("Aucun");
  });

  test("ajouter deux types crée exactement deux champs enfants, pas trois", async ({ page }) => {
    // Add a radio field and enable branching
    await page.getByRole("button", { name: "Ajouter un champ" }).click();
    await page.getByText("Choix unique").click();
    await page.getByRole("button", { name: "Embranchement conditionnel" }).click();

    // Select "Champ libre" (text) for Choix 1
    await page.locator("#branching-option_1").click();
    await page.getByRole("option", { name: "Champ libre" }).click();
    await page.keyboard.press("Escape");

    // "Champ obligatoire" appears once per expanded card:
    // Parent radio (1) + child text (1) = 2
    await expect(page.getByText("Champ obligatoire")).toHaveCount(2);

    // Now also select "Nombre" for Choix 1
    await page.locator("#branching-option_1").click();
    await page.getByRole("option", { name: "Nombre" }).click();
    await page.keyboard.press("Escape");

    // Should have exactly 2 children (not 3 from duplication bug):
    // Parent radio (1) + child text (1) + child number (1) = 3
    await expect(page.getByText("Champ obligatoire")).toHaveCount(3);
  });

  test("les tags enfants affichent le numéro de l'option parente", async ({ page }) => {
    // Add a radio field, enable branching, add 2 types for Choix 1
    await page.getByRole("button", { name: "Ajouter un champ" }).click();
    await page.getByText("Choix unique").click();
    await page.getByRole("button", { name: "Embranchement conditionnel" }).click();

    // Select "Champ libre" and "Nombre" for Choix 1 (option index = 1)
    await page.locator("#branching-option_1").click();
    await page.getByRole("option", { name: "Champ libre" }).click();
    await page.getByRole("option", { name: "Nombre" }).click();
    await page.keyboard.press("Escape");

    // Both BranchingTags should show "1" (the option's index),
    // not "1" and "2" (sequential sibling numbering)
    // BranchingTag renders: <span>{branchingNumber}</span> inside a rounded-full div
    const branchingTags = page.locator(".rounded-full span");
    await expect(branchingTags).toHaveCount(2);
    await expect(branchingTags.nth(0)).toHaveText("1");
    await expect(branchingTags.nth(1)).toHaveText("1");
  });

  test("activer l'embranchement sur un enfant radio ne provoque pas d'erreur", async ({ page }) => {
    // Add a checkbox field and enable branching
    await page.getByRole("button", { name: "Ajouter un champ" }).click();
    await page.getByText("Choix multiple").click();
    await page.getByRole("button", { name: "Embranchement conditionnel" }).click();

    // Select "Choix unique" (radio) as a branching child for Choix 1
    await page.locator("#branching-option_1").click();
    await page.getByRole("option", { name: "Choix unique" }).click();
    await page.keyboard.press("Escape");

    // A child radio card should appear
    await expect(page.getByText("Champ obligatoire")).toHaveCount(2);

    // Now enable branching on the child radio — should NOT crash
    const branchingButtons = page.getByRole("button", { name: "Embranchement conditionnel" });
    // The second "Embranchement conditionnel" button belongs to the child radio
    await branchingButtons.nth(1).click();

    // Verify no crash: the child radio's branching selects should appear
    // The child radio has 3 options (Choix 1, 2, 3), so 3 new branching selects
    // Plus the parent checkbox's 3 selects = 6 total branching selects
    const branchingSelects = page.locator('[id^="branching-"]');
    await expect(branchingSelects).toHaveCount(6);
  });

  test("changer le type d'un champ en radio puis ajouter un embranchement affiche le BranchingTag", async ({ page }) => {
    // Add a number field, then change its type to radio
    await page.getByRole("button", { name: "Ajouter un champ" }).click();
    await page.getByText("Nombre").click();

    // Change field type from Nombre to Choix unique (radio) via the type selector
    await page.getByRole("combobox").filter({ hasText: "Nombre" }).click();
    await page.getByRole("menuitem", { name: "Choix unique" }).click();

    // Enable branching
    await page.getByRole("button", { name: "Embranchement conditionnel" }).click();

    // Select "Champ libre" for Choix 1
    await page.locator("#branching-option_1").click();
    await page.getByRole("option", { name: "Champ libre" }).click();
    await page.keyboard.press("Escape");

    // The child should have a BranchingTag with "1"
    const branchingTags = page.locator(".rounded-full span");
    await expect(branchingTags).toHaveCount(1);
    await expect(branchingTags.first()).toHaveText("1");
  });

  test("les cartes enfants sont ouvertes quand le parent est ouvert", async ({ page }) => {
    // Add a radio field and enable branching
    await page.getByRole("button", { name: "Ajouter un champ" }).click();
    await page.getByText("Choix unique").click();
    await page.getByRole("button", { name: "Embranchement conditionnel" }).click();

    // Select "Champ libre" for Choix 1
    await page.locator("#branching-option_1").click();
    await page.getByRole("option", { name: "Champ libre" }).click();
    await page.keyboard.press("Escape");

    // The child card should be expanded (not collapsed):
    // "Champ obligatoire" switch appears in every expanded card's footer
    // Parent has one + child should also have one = 2 total
    await expect(page.getByText("Champ obligatoire")).toHaveCount(2);
  });
});
