# CLAUDE.md

Ce fichier guide Claude Code (claude.ai/code) pour travailler sur ce dépôt.

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
- `src/components/` - Composants UI réutilisables
- `src/components/admin/` - Composants spécifiques admin
- `src/components/user/` - Composants spécifiques utilisateur
- `src/stores/` - State management (Zustand)
- `src/models/` - Types et interfaces métier (FieldTypes, FormTemplate, Declaration)
- `src/lib/` - Composants utilitaires et code partagé

### Alias de chemins

- `@/components/*` → `src/components/*`
- `@/lib/*` → `src/lib/*`
- `@/models/*` → `src/models/*`
- `@/stores/*` → `src/stores/*`
- `@/styles/*` → `src/styles/*`

### Patterns de composants

- Les composants client utilisent la directive `"use client"` pour l'interactivité
- Le layout racine est un composant serveur
- La sidebar supporte collapse/expand avec transitions fluides
- La sidebar accepte un `variant` pour différencier admin/membre

### State management (Zustand)

- `formEditorStore.ts` — État de l'éditeur de formulaire (schema, formName, formDescription, showPreview)
- `formsStore.ts` — Liste des formulaires
- `declarationsStore.ts` — Liste des déclarations
- `categoryCodesStore.ts` — Codes catégorie
- `authStore.ts` — Authentification

### Pattern de distinction des rôles

Pour distinguer admin et membre sans authentification :

1. Le `UserContext` détermine le rôle selon la route courante
2. Les composants utilisent `useUser()` pour adapter leur affichage
3. La sidebar et la navigation sont configurables via props `variant`

## Système de champs dynamiques

### Architecture (3 couches)

```
src/lib/dynamic-field/       → Rendu des champs (côté utilisateur)
├── DynamicField.tsx          → Résolveur dynamique via registry
├── text/index.tsx
├── number/index.tsx
├── select/index.tsx
├── radio/index.tsx
├── checkbox/index.tsx
├── switch/index.tsx
├── date/index.tsx
└── import/index.tsx

src/lib/field-configurator/  → Configuration des champs (côté admin)
├── index.tsx                 → FieldConfigurator principal
├── SortableFieldCard.tsx     → Carte drag-and-drop
├── common/                   → Composants partagés (LabelField, DescriptionField, Footer, DefaultValueSelector)
├── text/index.tsx
├── number/index.tsx
├── select/index.tsx
├── radio/index.tsx
├── checkbox/index.tsx
├── switch/index.tsx
├── date/index.tsx
└── import/index.tsx

src/lib/form-creation/       → Composants de formulaire
├── FormBuilder.tsx           → Builder drag-and-drop avec ajout/suppression/duplication
└── DynamicForm.tsx           → Rendu d'un formulaire complet depuis un schema

src/lib/utils/registry.ts    → Enregistrement des types de champs
src/models/FieldTypes.ts     → Tous les types/interfaces (FieldConfig, FieldType, etc.)
```

### Types de champs disponibles (8)

| Type       | Label FR            | Icône           | Config spécifique                              |
|------------|---------------------|-----------------|------------------------------------------------|
| `text`     | Champ libre         | `chat`          | —                                              |
| `number`   | Nombre              | `chat`          | `unit`                                         |
| `select`   | Liste déroulante    | `list-alt`      | `options`, `selectionMode`, `dataType/Source`   |
| `radio`    | Choix unique        | `check-circle`  | `options`, `defaultIndex`                      |
| `checkbox` | Choix multiple      | `checkbox`      | `options`, `defaultIndices`                    |
| `switch`   | Switch              | `switch`        | —                                              |
| `date`     | Date                | `calendar-month`| `includeTime`, `defaultDateValue`              |
| `import`   | Import de fichier   | `upload`        | `acceptedFormats`, `maxFileSize`               |

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

2. **Créer le rendu** : `src/lib/dynamic-field/<type>/index.tsx`

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
   import { fieldRegistration as myField } from "../dynamic-field/<type>";
   registerField(myField);
   ```

4. **Créer le configurateur** : `src/lib/field-configurator/<type>/index.tsx`

5. **Mettre à jour le FormBuilder** (`src/lib/form-creation/FormBuilder.tsx`) :
   - Ajouter le cas dans `handleAddField` pour la config par défaut

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
    └── form-editor.spec.ts    # Éditeur de formulaire
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
- Navigateurs : Chromium
- Traces activées en premier retry
