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
- `src/stores/` - redux stores
- `src/lib/` - Composants utilitaires et code partagé

### Alias de chemins

- `@/components/*` → `src/components/*`
- `@/context/*` → `src/context/*`
- `@/lib/*` → `src/lib/*`

### Patterns de composants

- Les composants client utilisent la directive `"use client"` pour l'interactivité
- Le layout racine est un composant serveur
- La sidebar supporte collapse/expand avec transitions fluides
- La sidebar accepte un `variant` pour différencier admin/membre

### Pattern de distinction des rôles

Pour distinguer admin et membre sans authentification :

1. Le `UserContext` détermine le rôle selon la route courante
2. Les composants utilisent `useUser()` pour adapter leur affichage
3. La sidebar et la navigation sont configurables via props `variant`

````

### Utilisation

```typescript
import { DynamicForm, FieldConfig } from "@/lib/form-fields";

const schema: FieldConfig[] = [
  { name: "titre", type: "text", label: "Titre", required: true },
  { name: "annee", type: "number", label: "Année" },
  { name: "categorie", type: "select", label: "Catégorie", options: [...] }
];

<DynamicForm schema={schema} values={values} onChange={setValues} errors={errors} />
````

### Ajouter un nouveau type de champ

1. **Créer le dossier** : `src/lib/form-fields/<type>/`

2. **Créer le composant** dans `index.tsx` :

   ```typescript
   "use client";
   import { Label } from "@/lib/components/ui/label";
   import type { FieldProps, FieldRegistration } from "../types";

   const MyField = ({ config, value, onChange, error }: FieldProps) => {
     // Implémentation du champ
   };

   export const fieldRegistration: FieldRegistration = {
     type: "<type>",
     component: MyField,
     defaultConfig: {},
   };

   export default MyField;
   ```

3. **Enregistrer dans le registry** (`registry.ts`) :

   ```typescript
   import { fieldRegistration as myField } from "./<type>";
   registerField(myField);
   ```

4. **Ajouter le type** dans `types.ts` :
   - Ajouter à `FieldType`
   - Créer l'interface `MyFieldConfig` si besoin

Le champ devient automatiquement disponible pour `DynamicForm`.

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
- Navigateurs : Chromium, Firefox, WebKit
- Traces activées en premier retry
