## Plan: Playwright E2E Tests for CSRD-Collect

### Context

The CSRD-Collect app has Playwright installed but only contains a
placeholder example test. We need comprehensive E2E tests covering both
the member and admin interfaces. The app fetches data from
http://localhost:4000 (backend API), so tests will mock API responses to
run independently.

### Approach

1.  Update playwright.config.ts
    - Uncomment baseURL: 'http://localhost:3000'
    - Uncomment webServer block (change npm to pnpm)
    - Browser support (only chromium)

2.  Create test files in e2e-tests/
    - e2e-tests/member/login.spec.ts - Authentication flow
      - Login modal appears on member route (/)
      - Shows title "Bienvenue sur le collecteur"
      - Direction and Centre selects are required (button disabled until filled)
      - Selecting Direction + Centre enables "Valider" button
      - After login, declarations page is visible
      - Auth persists in localStorage

    - e2e-tests/member/declarations.spec.ts - Declarations page
      - Page shows "Déclarations" heading
      - Displays declaration cards grouped by date
      - Cards show date, author chip, title, description
      - "Déclarer" button opens form selection dialog
      - Filter toggle shows/hides filter panel
      - Filter panel has "Type de déclaration" and "Utilisateurs" sections

    - e2e-tests/member/new-declaration.spec.ts - New declaration flow
      - "Déclarer" button → FormSelectionDialog opens
      - Dialog shows "Nouvelle déclaration" title
      - Lists available forms with code, title, description
      - Selecting a form enables "Ajouter" button
      - "Ajouter" opens declaration form panel (right side)
      - Declaration panel shows form fields
      - "Annuler" closes the panel
      - "Soumettre" submits and closes
    - e2e-tests/admin/navigation.spec.ts - Admin sidebar & navigation
      - Admin page loads without auth (no login modal)
      - Sidebar shows "Administration" title
      - Admin menu items: "Administration d'équipe", "Paramètrage déclaratif",
        "Gestion des données"
      - Clicking menu items navigates to correct routes
      - Page title: "Administration des formulaires de déclaration"

e2e-tests/admin/forms-list.spec.ts - Admin forms management

- Shows list of form cards
- SegmentedControl for category filtering ("Tous", "E1-2", etc.)
- Filtering changes displayed forms
- Clicking a form card navigates to /admin/parametrage-declaratif

e2e-tests/admin/form-editor.spec.ts - Form editor

- Back button navigates to admin dashboard
- Form title input is editable
- Category dropdown and description textarea
- "Ajouter un champ" button for adding fields
- Preview toggle shows/hides preview panel
- Save and delete buttons

3.  API Mocking Strategy

Use Playwright's page.route() to intercept API calls to
http://localhost:4000:

- GET /form-templates → return mock form templates
- GET /declarations → return mock declarations
- POST /form-templates → return created form
- PATCH /form-templates/:id → return updated form
- DELETE /form-templates/:id → return success

4.  Test Helpers

Create e2e-tests/helpers/ with:

- mock-data.ts - Shared mock data (forms, declarations)
- auth.ts - Helper to bypass login by setting localStorage

5.  Add test script to package.json

Add "test:e2e": "playwright test" script.

Files to modify

- playwright.config.ts - Enable baseURL and webServer
- package.json - Add test script

Files to create

- e2e-tests/helpers/mock-data.ts
- e2e-tests/helpers/auth.ts
- e2e-tests/member/login.spec.ts
- e2e-tests/member/declarations.spec.ts
- e2e-tests/member/new-declaration.spec.ts
- e2e-tests/admin/navigation.spec.ts
- e2e-tests/admin/forms-list.spec.ts
- e2e-tests/admin/form-editor.spec.ts

File to delete

- e2e-tests/example.spec.ts (placeholder)

Verification

1.  Run pnpm run dev to start the dev server
2.  Run pnpm test:e2e to execute all tests
3.  Check HTML report for results
