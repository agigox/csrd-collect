import { test, expect } from "@playwright/test";
import { loginAsMember } from "../helpers/auth";
import {
  mockFormTemplates,
  mockDeclarations,
} from "../helpers/mock-data";

test.describe("Recherche et filtres des déclarations", () => {
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

  test.describe("Fonctionnalité de recherche", () => {
    test("le bouton recherche ouvre la barre de recherche", async ({ page }) => {
      // Search bar should not be visible initially
      await expect(
        page.getByRole("textbox", { name: "Rechercher par nom..." })
      ).not.toBeVisible();

      // Click search button
      await page.getByRole("button", { name: "Rechercher" }).click();

      // Search bar should now be visible
      await expect(
        page.getByRole("textbox", { name: "Rechercher par nom..." })
      ).toBeVisible();
    });

    test("la recherche filtre les déclarations par nom (exact)", async ({ page }) => {
      // Open search
      await page.getByRole("button", { name: "Rechercher" }).click();

      // Type exact name
      await page.getByRole("textbox", { name: "Rechercher par nom..." }).fill("Incident de sécurité");

      // Should show only the matching declaration
      await expect(page.getByText("Incident de sécurité")).toBeVisible();
      await expect(page.getByText("Marie Martin")).toBeVisible();

      // Should not show other declarations
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).not.toBeVisible();
      await expect(page.getByText("Jean Dupont")).not.toBeVisible();
    });

    test("la recherche filtre les déclarations par nom (partiel)", async ({ page }) => {
      // Open search
      await page.getByRole("button", { name: "Rechercher" }).click();

      // Type partial name
      await page.getByRole("textbox", { name: "Rechercher par nom..." }).fill("Fuite");

      // Should show all declarations with "Fuite" in the name
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).toBeVisible();
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible();

      // Should not show declarations without "Fuite"
      await expect(page.getByText("Incident de sécurité")).not.toBeVisible();
      await expect(page.getByText("Contrôle qualité - Janvier 2025")).not.toBeVisible();
    });

    test("la recherche est insensible à la casse", async ({ page }) => {
      // Open search
      await page.getByRole("button", { name: "Rechercher" }).click();

      // Type lowercase
      await page.getByRole("textbox", { name: "Rechercher par nom..." }).fill("fuite");

      // Should still show declarations with "Fuite"
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).toBeVisible();
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible();
    });

    test("la recherche sans résultat affiche un message d'état vide", async ({ page }) => {
      // Open search
      await page.getByRole("button", { name: "Rechercher" }).click();

      // Type a search query that won't match
      await page.getByRole("textbox", { name: "Rechercher par nom..." }).fill("XYZ12345");

      // Should show empty state with search query
      await expect(
        page.getByText('Aucune déclaration trouvée pour "XYZ12345"')
      ).toBeVisible();

      // Should not show any declarations
      await expect(page.getByText("Jean Dupont")).not.toBeVisible();
      await expect(page.getByText("Marie Martin")).not.toBeVisible();
    });

    test("le bouton fermer réinitialise la recherche", async ({ page }) => {
      // Open search
      await page.getByRole("button", { name: "Rechercher" }).click();

      // Type search query
      await page.getByRole("textbox", { name: "Rechercher par nom..." }).fill("Fuite");

      // Only Fuite declarations visible
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).toBeVisible();
      await expect(page.getByText("Incident de sécurité")).not.toBeVisible();

      // Close search
      await page.getByRole("button", { name: "Fermer la recherche" }).click();

      // All declarations should be visible again
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).toBeVisible();
      await expect(page.getByText("Incident de sécurité")).toBeVisible();
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible();
      await expect(page.getByText("Contrôle qualité - Janvier 2025")).toBeVisible();

      // Search bar should be hidden
      await expect(
        page.getByRole("textbox", { name: "Rechercher par nom..." })
      ).not.toBeVisible();
    });

    test("le bouton clear efface la recherche", async ({ page }) => {
      // Open search
      await page.getByRole("button", { name: "Rechercher" }).click();

      // Type search query
      const searchBox = page.getByRole("textbox", { name: "Rechercher par nom..." });
      await searchBox.fill("Fuite");

      // Click clear button (the reset icon inside searchbar)
      await page.getByRole("button", { name: "clear" }).click();

      // Search box should be empty
      await expect(searchBox).toHaveValue("");

      // All declarations should be visible
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).toBeVisible();
      await expect(page.getByText("Incident de sécurité")).toBeVisible();
    });
  });

  test.describe("Fonctionnalité de filtres", () => {
    test("le bouton filtre ouvre le panneau de filtres", async ({ page }) => {
      // Filter panel should not be visible initially
      await expect(page.getByRole("heading", { name: "Filtres" })).not.toBeVisible();

      // Click filter button
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Filter panel should now be visible with correct labels
      await expect(page.getByRole("heading", { name: "Filtres" })).toBeVisible();
      await expect(page.getByText("Statut").first()).toBeVisible();
      await expect(page.getByText("Auteur").first()).toBeVisible();
      await expect(page.getByText("Équipe").first()).toBeVisible();
    });

    test("le filtre par statut affiche les options correctes", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Click on status filter dropdown
      await page.locator('div').filter({ hasText: /^Tous les statuts$/ }).first().click();

      // Should show status options
      await expect(page.getByRole("button", { name: "Brouillon" })).toBeVisible();
      await expect(page.getByRole("button", { name: "En attente" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Validé" })).toBeVisible();
    });

    test("le filtre par statut filtre correctement (simple)", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Open status dropdown
      await page.locator('div').filter({ hasText: /^Tous les statuts$/ }).first().click();

      // Select "Brouillon" (draft)
      await page.getByRole("button", { name: "Brouillon" }).click();

      // Should show only draft declarations
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible();
      await expect(page.getByText("Contrôle qualité - Janvier 2025")).toBeVisible();
      await expect(page.getByText("Pierre Bernard")).toBeVisible();

      // Should not show validated or pending declarations
      await expect(page.getByText("Incident de sécurité")).not.toBeVisible();
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).not.toBeVisible();
    });

    test("le filtre par statut supporte la sélection multiple", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Open status dropdown
      await page.locator('div').filter({ hasText: /^Tous les statuts$/ }).first().click();

      // Select both "Brouillon" and "En attente" while dropdown is open
      await page.getByRole("button", { name: "Brouillon" }).click();
      await page.getByRole("button", { name: "En attente" }).click();

      // Click outside to close dropdown
      await page.getByRole("heading", { name: "Filtres" }).click();

      // Wait for filters to apply
      await page.waitForTimeout(500);

      // Should show both draft and pending declarations
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible(); // draft
      await expect(page.getByText("Contrôle qualité - Janvier 2025")).toBeVisible(); // draft
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).toBeVisible(); // pending

      // Should not show validated declarations
      await expect(page.getByText("Incident de sécurité")).not.toBeVisible();
    });

    test("le filtre par auteur affiche les options dynamiques", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Click on author filter dropdown
      await page.locator('div').filter({ hasText: /^Tous les auteurs$/ }).first().click();

      // Should show author options extracted from data
      await expect(page.getByRole("button", { name: "Jean Dupont" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Marie Martin" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Pierre Bernard" })).toBeVisible();
    });

    test("le filtre par auteur filtre correctement", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Open author dropdown
      await page.locator('div').filter({ hasText: /^Tous les auteurs$/ }).first().click();

      // Select "Marie Martin"
      await page.getByRole("button", { name: "Marie Martin" }).click();

      // Should show only Marie Martin's declaration
      await expect(page.getByText("Incident de sécurité")).toBeVisible();

      // Should not show other authors' declaration names
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).not.toBeVisible();
      await expect(page.getByText("Contrôle qualité - Janvier 2025")).not.toBeVisible();
    });

    test("le filtre par équipe affiche les options dynamiques", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Click on team filter dropdown
      await page.locator('div').filter({ hasText: /^Toutes les équipes$/ }).first().click();

      // Should show team options extracted from data (formatted as "Équipe X")
      await expect(page.getByRole("button", { name: "Équipe TEAM-01" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Équipe TEAM-02" })).toBeVisible();
    });

    test("le filtre par équipe filtre correctement", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Open team dropdown
      await page.locator('div').filter({ hasText: /^Toutes les équipes$/ }).first().click();

      // Select "Équipe TEAM-01"
      await page.getByRole("button", { name: "Équipe TEAM-01" }).click();

      // Should show only TEAM-01 declarations
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).toBeVisible();
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible();
      await expect(page.getByText("Contrôle qualité - Janvier 2025")).toBeVisible();

      // Should not show TEAM-02 declarations
      await expect(page.getByText("Incident de sécurité")).not.toBeVisible();
    });

    test("plusieurs filtres fonctionnent ensemble (logique AND)", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Select status: Brouillon
      await page.locator('div').filter({ hasText: /^Tous les statuts$/ }).first().click();
      await page.getByRole("button", { name: "Brouillon" }).click();
      await page.getByRole("heading", { name: "Filtres" }).click(); // Close dropdown

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // Select team: TEAM-01
      await page.locator('div').filter({ hasText: /^Toutes les équipes$/ }).first().click();
      await page.getByRole("button", { name: "Équipe TEAM-01" }).click();
      await page.getByRole("heading", { name: "Filtres" }).click(); // Close dropdown

      // Wait for both filters to apply
      await page.waitForTimeout(500);

      // Should show only draft declarations from TEAM-01
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible(); // draft + TEAM-01
      await expect(page.getByText("Contrôle qualité - Janvier 2025")).toBeVisible(); // draft + TEAM-01

      // Should not show pending from TEAM-01
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).not.toBeVisible(); // pending

      // Should not show validated from TEAM-02
      await expect(page.getByText("Incident de sécurité")).not.toBeVisible(); // validated + TEAM-02
    });

    test("les filtres sans résultat affichent un message d'état vide", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Select author: Marie Martin
      await page.locator('div').filter({ hasText: /^Tous les auteurs$/ }).first().click();
      await page.getByRole("button", { name: "Marie Martin" }).click();

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // Select status: Brouillon (Marie Martin has no draft declarations)
      await page.locator('div').filter({ hasText: /^Tous les statuts$/ }).first().click();
      await page.getByRole("button", { name: "Brouillon" }).click();

      // Should show empty state
      await expect(
        page.getByText("Aucune déclaration ne correspond aux filtres sélectionnés")
      ).toBeVisible();

      // Should not show any author names in the declaration list
      await expect(page.getByText("Pierre Bernard")).not.toBeVisible();
    });

    test("les chips de filtre peuvent être supprimés individuellement", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Select status: Brouillon
      await page.locator('div').filter({ hasText: /^Tous les statuts$/ }).first().click();
      await page.getByRole("button", { name: "Brouillon" }).click();

      // Verify only drafts are shown
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible();
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).not.toBeVisible();

      // Remove the chip
      await page.getByRole("button", { name: "Supprimer Brouillon" }).click();

      // All declarations should be visible again
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible();
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).toBeVisible();
      await expect(page.getByText("Incident de sécurité")).toBeVisible();
    });

    test("le bouton effacer supprime tous les filtres d'une catégorie", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Select multiple status values
      await page.locator('div').filter({ hasText: /^Tous les statuts$/ }).first().click();
      await page.getByRole("button", { name: "Brouillon" }).click();
      await page.getByRole("button", { name: "En attente" }).click();
      await page.getByRole("heading", { name: "Filtres" }).click(); // Close dropdown

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // Verify filtered results
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible(); // draft
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).toBeVisible(); // pending
      await expect(page.getByText("Incident de sécurité")).not.toBeVisible(); // validated

      // Click clear button
      await page.getByRole("button", { name: "Effacer" }).first().click();

      // All declarations should be visible
      await expect(page.getByText("Incident de sécurité")).toBeVisible();
    });

    test("le bouton fermer ferme le panneau de filtres", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Filter panel should be visible
      await expect(page.getByRole("heading", { name: "Filtres" })).toBeVisible();

      // Click close button
      await page.getByRole("button", { name: "Fermer les filtres" }).click();

      // Filter panel should be hidden
      await expect(page.getByRole("heading", { name: "Filtres" })).not.toBeVisible();
      await expect(page.getByText("Statut")).not.toBeVisible();
    });
  });

  test.describe("Exclusivité mutuelle recherche/filtres", () => {
    test("ouvrir la recherche désactive et ferme les filtres", async ({ page }) => {
      // Open filters first
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();
      await expect(page.getByRole("heading", { name: "Filtres" })).toBeVisible();

      // Select a filter
      await page.locator('div').filter({ hasText: /^Tous les statuts$/ }).first().click();
      await page.getByRole("button", { name: "Brouillon" }).click();

      // Verify filter is applied
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible();
      await expect(page.getByText("Incident de sécurité")).not.toBeVisible();

      // Open search
      await page.getByRole("button", { name: "Rechercher" }).click();

      // Filter panel should be closed
      await expect(page.getByRole("heading", { name: "Filtres" })).not.toBeVisible();

      // Filters should be cleared - all declarations visible
      await expect(page.getByText("Fuite d'huile - Canalisation")).toBeVisible();
      await expect(page.getByText("Incident de sécurité")).toBeVisible();

      // Filter button should remain enabled (users can switch back to filters)
      await expect(
        page.getByRole("button", { name: "Afficher/masquer les filtres" })
      ).toBeEnabled();
    });

    test("ouvrir les filtres désactive la recherche", async ({ page }) => {
      // Open search first
      await page.getByRole("button", { name: "Rechercher" }).click();

      // Type search query
      const searchBox = page.getByRole("textbox", { name: "Rechercher par nom..." });
      await searchBox.fill("Fuite");

      // Verify search is applied
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).toBeVisible();
      await expect(page.getByText("Incident de sécurité")).not.toBeVisible();

      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Search bar should be hidden
      await expect(searchBox).not.toBeVisible();

      // Search should be cleared - all declarations visible
      await expect(page.getByText("Fuite d'huile - Transformateur T3")).toBeVisible();
      await expect(page.getByText("Incident de sécurité")).toBeVisible();
    });

    test("cliquer sur le bouton filtre ferme la recherche active", async ({ page }) => {
      // Open search first
      await page.getByRole("button", { name: "Rechercher" }).click();

      // Verify search is active
      await expect(
        page.getByRole("textbox", { name: "Rechercher par nom..." })
      ).toBeVisible();

      // Click filter button
      const filterButton = page.getByRole("button", { name: "Afficher/masquer les filtres" });
      await filterButton.click();

      // Search should be closed
      await expect(
        page.getByRole("textbox", { name: "Rechercher par nom..." })
      ).not.toBeVisible();

      // Filter panel should be open
      await expect(page.getByRole("heading", { name: "Filtres" })).toBeVisible();
    });
  });

  test.describe("Intégration", () => {
    test("le bouton Déclarer fonctionne avec la recherche ouverte", async ({ page }) => {
      // Open search
      await page.getByRole("button", { name: "Rechercher" }).click();

      // Click Déclarer button
      await page.getByRole("button", { name: "Déclarer" }).click();

      // Modal should open
      await expect(
        page.getByRole("heading", { name: "Nouvelle déclaration" })
      ).toBeVisible();
    });

    test("le bouton Déclarer fonctionne avec les filtres ouverts", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Click Déclarer button
      await page.getByRole("button", { name: "Déclarer" }).click();

      // Modal should open
      await expect(
        page.getByRole("heading", { name: "Nouvelle déclaration" })
      ).toBeVisible();
    });

    test("les déclarations sont regroupées par date après filtrage", async ({ page }) => {
      // Open filters
      await page.getByRole("button", { name: "Afficher/masquer les filtres" }).click();

      // Filter by TEAM-01
      await page.locator('div').filter({ hasText: /^Toutes les équipes$/ }).first().click();
      await page.getByRole("button", { name: "Équipe TEAM-01" }).click();

      // Should still show date separators
      // Mock data has declarations from different dates
      // Use more specific selector to avoid matching dates in cards
      await expect(page.locator('.text-sm.text-gray-500.whitespace-nowrap').filter({ hasText: '07/02/2025' }).first()).toBeVisible();
      await expect(page.locator('.text-sm.text-gray-500.whitespace-nowrap').filter({ hasText: '06/02/2025' }).first()).toBeVisible();
    });
  });
});
