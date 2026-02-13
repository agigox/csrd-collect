# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comportement de Claude

**Toujours utiliser Context7 MCP** pour accéder à la documentation des bibliothèques, générer du code, ou obtenir des étapes de configuration/setup, sans attendre qu'on le demande explicitement. Cela garantit d'utiliser la documentation la plus récente et les meilleures pratiques actuelles.

**Démarrage du serveur de développement** : Quand il est demandé de lancer le serveur dev, toujours :

1. Démarrer d'abord le serveur API mock : `npx json-server db.json --port 4000`
2. Ensuite démarrer le serveur Next.js : `pnpm run dev`
3. Ouvrir l'application dans un navigateur contrôlé (Playwright/Chrome DevTools)

## Vue d'ensemble du projet

CSRD-COLLECT est une application Next.js 16.1.0 en français pour la collecte de données CSRD. Utilise React 19.2.3, Tailwind CSS 4 et TypeScript.

## Commandes

```bash
pnpm run dev      # Démarrer le serveur dev sur http://localhost:3000 (Turbopack)
pnpm run build    # Build de production
pnpm run start    # Démarrer le serveur de production
pnpm run lint     # Exécuter ESLint
pnpm test:e2e     # Exécuter les tests E2E Playwright
```

### Tests E2E spécifiques

```bash
pnpm test:e2e --project=chromium                          # Chromium uniquement
pnpm test:e2e e2e-tests/admin/branching.spec.ts          # Test spécifique
pnpm test:e2e --project=chromium e2e-tests/admin/        # Tests admin uniquement
```

### API Mock (développement)

```bash
npx json-server db.json --port 4000   # Lancer le serveur API mock
```

Le fichier `db.json` à la racine alimente les endpoints :

- `GET /category-codes` — Codes catégorie pour les formulaires
- `GET /form-templates` — Modèles de formulaires
- `GET /declarations` — Déclarations existantes
- `GET /options` — Sources de données pour les champs select

## Exigences obligatoires

- Utiliser pnpm comme gestionnaire de paquets
- Utiliser le routage par système de fichiers (Next.js App Router)
- Tout le contenu UI doit être en français
- Stocker le code applicatif dans le dossier `src/`
- Garder `src/app/` uniquement pour le routage (layouts, pages)
- Les assets statiques vont dans `public/`

## Conventions de code

### Nommage

- **Variables et fonctions** : anglais (camelCase)
- **Types et interfaces** : anglais (PascalCase)
- **Contenu UI** : français (textes affichés à l'utilisateur)

```typescript
// Exemple
const formList = [...];           // Variable en anglais
const isCollapsed = true;         // Variable en anglais
const handleSubmit = () => {};    // Fonction en anglais

interface FormCardProps {         // Interface en anglais
  title: string;                  // Contenu : "Fuite d'huile"
  description: string;            // Contenu : "Déclaration permettant..."
}

<Button>Ajouter un formulaire</Button>  // UI en français
```

### Composants UI (@rte-ds/core & @rte-ds/react)

Avant de développer un composant vérifie s'il existe dans design system rte: @rte-ds/react

**Important** : Le développeur est également le mainteneur de `@rte-ds/react` et `@rte-ds/core`. Le code source est disponible localement à `/Users/aminetabou/Work/design-system-rte`.

**Protocole de modification du design system** :
1. Tu peux librement lire le code source du design system pour comprendre les composants et tokens
2. Si tu identifies un besoin de modification (bug fix, amélioration, nouveau composant), tu dois :
   - Indiquer clairement le(s) fichier(s) que tu souhaites modifier
   - Expliquer la raison et l'impact de la modification
   - Attendre l'approbation explicite avant d'effectuer la modification
3. Ne jamais modifier le design system sans approbation préalable

## Acteurs

L'application a deux types d'utilisateurs :

### Membre d'équipe (interface `/`)

- Appartient à une équipe (Direction, Centre, GMR, Équipe)
- Fait des déclarations via les formulaires créés par l'admin
- Accède à la liste de ses déclarations de son équipe
- Pas d'infos d'équipe si l'utilisateur n'a pas encore choisi son équipe
- Sidebar affiche ses informations d'équipe

### Administrateur (interface `/admin`)

- Gère les formulaires de déclaration
- Administre les équipes
- Configure les paramètres déclaratifs
- Sidebar affiche son nom (pas d'infos d'équipe)

## Routes

```
/                              → Interface membre (déclarations)
/admin                         → Dashboard admin (formulaires)
/admin/parametrage-declaratif  → Éditeur de formulaire
/admin/gestion-donnees         → Gestion des données (en développement)
/admin/parametres              → Paramètres (en développement)
```

## Architecture

### Structure des dossiers

- `src/app/` - Next.js App Router (routage uniquement)
  - `src/app/admin/` - Pages de l'interface admin
- `src/components/` - **Composants UI réutilisables uniquement**
  - `src/components/auth/` - UI d'authentification (LoginModal, AuthGuard)
  - `src/components/common/` - Composants partagés (EmptyState, etc.)
  - `src/components/AppSideNav.tsx` - Navigation principale
  - `src/components/Providers.tsx` - React providers
- `src/features/` - **Modules métier (fonctionnalités principales)**
  - `src/features/field-configurator/` - Configuration des champs (admin)
  - `src/features/form-builder/` - Construction et rendu de formulaires
  - `src/features/preview/` - Prévisualisation des champs
  - `src/features/form-editor/` - Éditeur de formulaire complet (parametrage-declaratif)
  - `src/features/forms-management/` - Gestion de la liste des formulaires (admin)
  - `src/features/declarations/` - Gestion des déclarations (utilisateur)
- `src/lib/` - **Utilitaires et code partagé uniquement**
  - `src/lib/ui/` - Composants UI de base (dialog, button, popover)
  - `src/lib/utils/` - Fonctions utilitaires (branching, registry, etc.)
  - `src/lib/hooks/` - Custom React hooks
- `src/stores/` - State management (Zustand)
- `src/models/` - Types et interfaces métier (FieldTypes, FormTemplate, Declaration)
- `src/styles/` - Styles globaux

### Alias de chemins

- `@/components/*` → `src/components/*`
- `@/features/*` → `src/features/*`
- `@/lib/*` → `src/lib/*`
- `@/models/*` → `src/models/*`
- `@/stores/*` → `src/stores/*`
- `@/styles/*` → `src/styles/*`

### Patterns de composants

- Les composants client utilisent la directive `"use client"` pour l'interactivité
- Le layout racine est un composant serveur
- La sidebar supporte collapse/expand avec transitions fluides

### State management (Zustand)

- `formEditorStore.ts` — État de l'éditeur de formulaire (schema, formName, formDescription, showPreview)
- `formsStore.ts` — Liste des formulaires + multi-active field groups (`activeFieldNames`, `primaryActiveFieldName`)
- `declarationsStore.ts` — Liste des déclarations
- `categoryCodesStore.ts` — Codes catégorie
- `authStore.ts` — Authentification membre (persisted avec clé `csrd_auth`)

### Pattern de distinction des rôles

Pour distinguer admin et membre :

1. Le rôle est déterminé par la route : `pathname.startsWith("/admin")` dans `AppSideNav`
2. Les composants utilisent `useAuthStore()` (Zustand) pour l'authentification membre
3. La sidebar affiche dynamiquement différents menus selon `isAdmin`

## Système de champs dynamiques

### Architecture (3 couches)

```
src/features/preview/              → Rendu des champs (côté utilisateur)
├── DynamicField.tsx               → Résolveur dynamique via registry
├── text/index.tsx
├── number/index.tsx
├── select/index.tsx
├── radio/index.tsx
├── checkbox/index.tsx
├── switch/index.tsx
├── date/index.tsx
└── import/index.tsx

src/features/field-configurator/  → Configuration des champs (côté admin)
├── index.tsx                      → FieldConfigurator principal
├── SortableFieldCard.tsx          → Carte drag-and-drop
├── common/                        → Composants partagés (LabelField, DescriptionField, Footer, DefaultValueSelector, BranchingSelect, BranchingTag)
├── text/index.tsx
├── number/index.tsx
├── select/index.tsx
├── radio/index.tsx
├── checkbox/index.tsx
├── switch/index.tsx
├── date/index.tsx
└── import/index.tsx

src/features/form-builder/         → Construction et rendu de formulaires
├── FormBuilder.tsx                → Builder drag-and-drop avec ajout/suppression/duplication
└── DynamicForm.tsx                → Rendu d'un formulaire complet depuis un schema

src/lib/utils/                     → Utilitaires partagés
├── registry.ts                    → Enregistrement des types de champs
└── branching.ts                   → Utilitaires pour embranchement conditionnel

src/models/FieldTypes.ts           → Tous les types/interfaces (FieldConfig, FieldType, etc.)
```

### Modules features complets

En plus du système de champs dynamiques, l'application inclut des features complètes :

```
src/features/form-editor/          → Éditeur de formulaire (parametrage-declaratif)
├── index.tsx                      → Page principale éditeur
├── FormHeader.tsx                 → Édition du titre/métadonnées
├── FormMetadata.tsx               → Gestion métadonnées (catégorie, description)
├── SchemaBuilder.tsx              → Zone de construction du schema (utilise FormBuilder)
└── FormPreview.tsx                → Prévisualisation temps réel (utilise DynamicForm)

src/features/forms-management/     → Gestion liste formulaires admin
├── FormsManagementPage.tsx        → Page liste des formulaires
├── FormsList.tsx                  → Liste avec filtres et recherche
└── FormCard.tsx                   → Carte individuelle de formulaire

src/features/declarations/         → Gestion déclarations utilisateur
├── Declarations.tsx               → Page principale déclarations
├── Dashboard.tsx                  → Dashboard utilisateur
├── DeclarationCard.tsx            → Carte de déclaration
├── FormSelectionDialog.tsx        → Dialog sélection de formulaire
├── ModificationHistory.tsx        → Historique des modifications
├── addDeclaration/                → Création de déclaration
└── declarationsList/              → Liste avec filtres
    ├── Header.tsx
    ├── Filters.tsx
    └── List.tsx
```

### Types de champs disponibles (8)

| Type       | Label FR          | Icône            | Config spécifique                               |
| ---------- | ----------------- | ---------------- | ----------------------------------------------- |
| `text`     | Champ libre       | `chat`           | —                                               |
| `number`   | Nombre            | `chat`           | `unit`                                          |
| `select`   | Liste déroulante  | `list-alt`       | `options`, `selectionMode`, `dataType/Source`   |
| `radio`    | Choix unique      | `check-circle`   | `options`, `defaultIndex`, `branchingEnabled`   |
| `checkbox` | Choix multiple    | `checkbox`       | `options`, `defaultIndices`, `branchingEnabled` |
| `switch`   | Switch            | `switch`         | —                                               |
| `date`     | Date              | `calendar-month` | `includeTime`, `defaultDateValue`               |
| `import`   | Import de fichier | `upload`         | `acceptedFormats`, `maxFileSize`                |

### Embranchement conditionnel (radio/checkbox)

Les champs radio et checkbox supportent des sous-champs conditionnels :

- **Config parent** : `branchingEnabled`, `branching: Record<optionValue, fieldId[]>`, `branchingColors`
- **Config enfant** : `parentFieldId`, `parentOptionValue`, `branchingColor`
- **Utilitaires** (`src/lib/utils/branching.ts`) :
  - `getAllDescendantIds(parentId, schema)` — Récupère tous les descendants (avec guard contre cycles)
  - `isChildFieldVisible(field, values, schema)` — Détermine la visibilité côté rendu
  - `regroupChildrenAfterReorder(schema)` — Regroupe les enfants après drag-and-drop
  - `createDefaultFieldConfig(type, generateName)` — Crée un champ par défaut

### Utilisation

```typescript
import DynamicForm from "@/lib/form-creation/DynamicForm";
import type { FieldConfig } from "@/models/FieldTypes";

const schema: FieldConfig[] = [
  { id: "1", name: "titre", type: "text", label: "Titre", required: true },
  { id: "2", name: "annee", type: "number", label: "Année" },
  { id: "3", name: "categorie", type: "select", label: "Catégorie", options: [...], selectionMode: "single" }
];

<DynamicForm schema={schema} values={values} onChange={setValues} errors={errors} />
```

### Ajouter un nouveau type de champ

1. **Ajouter le type** dans `src/models/FieldTypes.ts` :
   - Ajouter à `FieldType`
   - Créer l'interface `MyFieldConfig extends BaseFieldConfig`
   - Ajouter à l'union `FieldConfig`

2. **Créer le rendu** : `src/lib/preview/<type>/index.tsx`

   ```typescript
   "use client";
   import type { FieldProps, FieldRegistration } from "@/models/FieldTypes";

   const MyField = ({ config, value, onChange, error }: FieldProps) => {
     // Implémentation du rendu
   };

   export const fieldRegistration: FieldRegistration = {
     type: "<type>",
     component: MyField,
     defaultConfig: {},
   };

   export default MyField;
   ```

3. **Enregistrer dans le registry** (`src/lib/utils/registry.ts`) :

   ```typescript
   import { fieldRegistration as myField } from "../preview/<type>";
   registerField(myField);
   ```

4. **Créer le configurateur** : `src/lib/field-configurator/<type>/index.tsx`

5. **Mettre à jour le FormBuilder** (`src/lib/form-creation/FormBuilder.tsx`) :
   - Ajouter le cas dans `createDefaultFieldConfig` (ou utiliser l'utilitaire de `branching.ts`)

Le champ devient automatiquement disponible dans le FormBuilder et le DynamicForm.

## Tests E2E (Playwright)

### Structure

```
e2e-tests/
├── helpers/
│   ├── mock-data.ts          # Données mockées partagées (formulaires, déclarations)
│   └── auth.ts               # Helpers pour contourner/configurer l'authentification
├── member/
│   ├── login.spec.ts          # Flow de connexion membre
│   ├── declarations.spec.ts   # Page des déclarations
│   └── new-declaration.spec.ts # Création d'une nouvelle déclaration
└── admin/
    ├── navigation.spec.ts     # Sidebar et navigation admin
    ├── forms-list.spec.ts     # Liste et filtrage des formulaires
    ├── form-editor.spec.ts    # Éditeur de formulaire
    └── branching.spec.ts      # Embranchement conditionnel (9 tests)
```

### Stratégie de mocking API

Les tests utilisent `page.route()` de Playwright pour intercepter les appels API vers `http://localhost:4000` :

- `GET /form-templates` → formulaires mockés
- `GET /declarations` → déclarations mockées
- `GET /category-codes` → codes catégorie mockés
- `POST /form-templates` → retourne le formulaire créé
- `PATCH /form-templates/:id` → retourne le formulaire mis à jour
- `DELETE /form-templates/:id` → retourne succès

### Helpers

- `loginAsMember(page, teamInfo?)` — Injecte l'état auth dans localStorage pour contourner le modal de connexion
- `clearAuth(page)` — Efface l'état auth pour que le modal de connexion apparaisse

### Exécution

```bash
pnpm test:e2e                     # Tous les tests, tous les navigateurs
pnpm test:e2e --project=chromium  # Chromium uniquement
pnpm test:e2e e2e-tests/member/   # Tests membre uniquement
pnpm test:e2e e2e-tests/admin/    # Tests admin uniquement
```

### Configuration

- `playwright.config.ts` — baseURL: `http://localhost:3000`, webServer lance `pnpm run dev`
- Navigateurs : Chromium, Firefox, Webkit
- Traces activées en premier retry
- Chromium utilise `slowMo: 1500` pour la stabilité
