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
```

## Exigences obligatoires

- Utiliser pnpm comme gestionnaire de paquets
- Utiliser le routage par système de fichiers (Next.js App Router)
- Tout le contenu UI doit être en français
- Stocker le code applicatif dans le dossier `src/`
- Garder `src/app/` uniquement pour le routage (layouts, pages)
- Les assets statiques vont dans `public/`
- Mettre les icones svg dans `src/lib/Icons.tsx`

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

### Composants UI (shadcn/ui)

Utiliser les composants shadcn/ui et les adapter si nécessaire :

- `Card` - cartes et conteneurs
- `Avatar` - avatars utilisateur
- `Tabs` - onglets et filtres
- `Button` - boutons d'action
- `Separator` - séparateurs visuels
- `Badge` - tags et badges
- `Dialog` - modales

Installation : `pnpm dlx shadcn@latest add <composant>`

## Acteurs

L'application a deux types d'utilisateurs :

### Membre d'équipe (interface `/`)

- Appartient à une équipe (Direction, Centre, GMR, Équipe)
- Fait des déclarations via les formulaires créés par l'admin
- Accède à la liste de ses déclarations
- Sidebar affiche ses informations d'équipe

### Administrateur (interface `/admin`)

- Gère les formulaires de déclaration
- Administre les équipes
- Configure les paramètres déclaratifs
- Sidebar affiche son nom (pas d'infos d'équipe)

## Routes

```
/                    → Interface membre (déclarations)
/admin               → Dashboard admin (formulaires)
/admin/formulaires   → Gestion des formulaires (futur)
/admin/equipes       → Administration d'équipe (futur)
```

## Architecture

### Structure des dossiers

- `src/app/` - Next.js App Router (routage uniquement)
- `src/app/admin/` - Pages de l'interface admin
- `src/components/` - Composants UI réutilisables
- `src/components/admin/` - Composants spécifiques admin
- `src/context/` - Contextes React (Sidebar, User, Declarations)
- `src/lib/` - Composants utilitaires et code partagé

### Alias de chemins

- `@/components/*` → `src/components/*`
- `@/context/*` → `src/context/*`
- `@/lib/*` → `src/lib/*`

### Styles

Tailwind CSS 4 avec variables de thème personnalisées dans `src/app/globals.css` via le bloc `@theme`. Espaces de noms de couleurs :

- `sidebar-*` - Couleurs de la sidebar (bg, text, muted, border, hover)
- `primary-*` - Couleurs d'action principale
- `content-*` - Couleurs de la zone de contenu principale

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
