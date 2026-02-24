import { test, expect } from "@playwright/test";
import { loginAsMember } from "../helpers/auth";
import {
  mockFormTemplates,
  mockDeclarations,
} from "../helpers/mock-data";

test.describe("Nouvelle déclaration", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMember(page);

    // Mock API calls
    await page.route("**/form-templates", (route) =>
      route.fulfill({ json: mockFormTemplates })
    );
    await page.route("**/declarations", (route) => {
      if (route.request().method() === "POST") {
        const body = route.request().postDataJSON();
        return route.fulfill({
          json: { ...body, id: "decl-new" },
        });
      }
      return route.fulfill({ json: mockDeclarations });
    });

    await page.goto("/");
  });

  test("le bouton Déclarer ouvre le FormSelectionDialog", async ({ page }) => {
    await page.getByRole("button", { name: "Déclarer" }).click();
    await expect(
      page.getByRole("heading", { name: "Nouvelle déclaration" })
    ).toBeVisible();
    await expect(
      page.getByText("Que souhaitez vous déclarer ?")
    ).toBeVisible();
  });

  test("le dialogue liste les formulaires disponibles avec codes et descriptions", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Déclarer" }).click();

    // Should show form codes from mock data
    await expect(page.getByText("E2-1234_01")).toBeVisible();
    await expect(page.getByText("E1-5678_02")).toBeVisible();

    // Should show form descriptions
    await expect(
      page.getByText("Déclaration permettant de signaler une fuite")
    ).toBeVisible();
    await expect(
      page.getByText("Signalement d'un incident de sécurité")
    ).toBeVisible();
  });

  test("le bouton Ajouter est désactivé tant qu'aucun formulaire n'est sélectionné", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Déclarer" }).click();

    const ajouterButton = page.getByRole("button", { name: "Ajouter" });
    await expect(ajouterButton).toBeDisabled();
  });

  test("sélectionner un formulaire active le bouton Ajouter", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Déclarer" }).click();

    // Click on a form card using the description text (unique per form)
    await page
      .getByText("Déclaration permettant de signaler une fuite")
      .click();

    const ajouterButton = page.getByRole("button", { name: "Ajouter" });
    await expect(ajouterButton).toBeEnabled();
  });

  test("le bouton Annuler ferme le dialogue", async ({ page }) => {
    await page.getByRole("button", { name: "Déclarer" }).click();
    await expect(
      page.getByRole("heading", { name: "Nouvelle déclaration" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Annuler" }).click();
    await expect(
      page.getByText("Que souhaitez vous déclarer ?")
    ).not.toBeVisible();
  });

  test("Ajouter un formulaire ouvre le panneau de déclaration", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Déclarer" }).click();

    // Select a form
    await page
      .getByText("Déclaration permettant de signaler une fuite")
      .click();

    // Click Ajouter
    await page.getByRole("button", { name: "Ajouter" }).click();

    // The declaration panel should open with form fields
    await expect(page.getByText("Localisation")).toBeVisible();
  });

  test("le panneau de déclaration a les boutons Annuler et Soumettre", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Déclarer" }).click();

    await page
      .getByText("Déclaration permettant de signaler une fuite")
      .click();

    await page.getByRole("button", { name: "Ajouter" }).click();

    // Should see action buttons
    await expect(
      page.getByRole("button", { name: "Annuler" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Soumettre" })
    ).toBeVisible();
  });
});
