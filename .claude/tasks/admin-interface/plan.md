# Plan d'implémentation : Interface Admin

## Vue d'ensemble

Créer une interface administrateur séparée accessible via `/admin` qui permet la gestion des formulaires de déclaration. L'interface membre existante reste sur `/`.

## Conventions de code

### Nommage
- **Variables et fonctions** : anglais (camelCase)
- **Types et interfaces** : anglais (PascalCase)
- **Contenu UI** : français (textes affichés à l'utilisateur)

Exemples :
```typescript
// Variables en anglais
const formList = [...];
const isCollapsed = true;
const handleSubmit = () => {};

// Interface en anglais
interface FormCardProps {
  title: string;      // Contenu en français : "Fuite d'huile"
  description: string; // Contenu en français : "Déclaration permettant..."
}

// UI en français
<Button>Ajouter un formulaire</Button>
```

### Composants shadcn
Utiliser les composants shadcn/ui et les adapter si nécessaire :
- `Card` - pour les cartes de formulaires
- `Avatar` - pour l'avatar utilisateur admin
- `Tabs` - pour les filtres par catégorie (Tous, E1-Pollution, etc.)
- `Button` - déjà utilisé, adapter les variants si besoin
- `Separator` - remplacer le `Divider` custom par le composant shadcn
- `Badge` - pour les tags de catégorie si besoin

## Stratégie de distinction Admin/Membre

### Pour les développeurs
- **Routes** : `/admin/*` pour admin, `/*` pour membre
- **Composants** : Sidebar configurable via props `variant="admin" | "member"`
- **Context** : `UserContext` avec le rôle utilisateur (préparation future auth)

### Structure des routes
```
/                    → Interface membre (existante)
/admin               → Dashboard admin (formulaires)
/admin/formulaires   → Gestion des formulaires (future)
/admin/equipes       → Administration d'équipe (future)
```

## Dépendances

### Composants shadcn à installer
```bash
pnpm dlx shadcn@latest add card avatar tabs separator badge
```

### Ordre d'implémentation
1. Installer les composants shadcn manquants
2. Context utilisateur (base pour tout)
3. Sidebar configurable (partagée)
4. Routes admin
5. Composants admin

## Modifications de fichiers

### Installation shadcn (COMMANDE)
```bash
pnpm dlx shadcn@latest add card avatar tabs separator badge
```
- Installer les composants nécessaires avant de commencer

### `src/context/UserContext.tsx` (NOUVEAU)
- Créer un context pour gérer le rôle utilisateur
- Interface `UserContextType` avec : `role: "admin" | "member"`, `name: string`
- Provider qui détermine le rôle selon la route (`/admin` → admin)
- Hook `useUser()` pour accéder au contexte
- Données mock pour le dev : admin = "Julien Neuville", membre = infos équipe
- Noms de variables en anglais : `userRole`, `userName`, `isAdmin`

### `src/components/Providers.tsx`
- Ajouter `UserProvider` dans la hiérarchie des providers
- Placer au-dessus de `SidebarProvider`

### `src/components/sidebar/index.tsx`
- Ajouter prop optionnelle `variant?: "admin" | "member"` (défaut: "member")
- Utiliser `useUser()` pour déterminer le variant si non fourni
- Conditionner l'affichage de `UserInfo` (membre) vs `AdminUserInfo` (admin)
- Passer le variant à `Navigation`
- Remplacer `Divider` par `Separator` de shadcn

### `src/components/sidebar/AdminUserInfo.tsx` (NOUVEAU)
- Utiliser `Avatar` de shadcn pour l'icône utilisateur
- Afficher le nom : "Julien Neuville"
- Props en anglais : `userName`, `avatarUrl`
- Pas d'infos d'équipe comme le membre

### `src/components/sidebar/Navigation.tsx`
- Ajouter prop `variant?: "admin" | "member"`
- Variables config en anglais : `adminMenuItems`, `memberMenuItems`
- Menu admin : Administration d'équipe, Paramètrage déclaratif, Gestion des données
- Menu membre : Déclarer (bouton), Déclarations, Paramètrage déclaratif
- Extraire les configs de menu dans des constantes

### `src/app/admin/layout.tsx` (NOUVEAU)
- Layout pour toutes les pages admin
- Importer et utiliser `Sidebar` avec variant="admin"
- Structure similaire au layout membre

### `src/app/admin/page.tsx` (NOUVEAU)
- Page "Administration des formulaires de déclaration"
- Utiliser `Button` shadcn pour "Ajouter un formulaire"
- Utiliser `Tabs` shadcn pour les filtres (Tous, E1-Pollution, E2-Pollution, etc.)
- Variables en anglais : `formsList`, `selectedCategory`, `handleCategoryChange`

### `src/components/admin/FormsList.tsx` (NOUVEAU)
- Composant liste des formulaires admin
- Utiliser `Tabs` pour les filtres par catégorie CSRD
- Props et state en anglais : `forms`, `activeTab`, `onTabChange`
- Mapper les formulaires vers `FormCard`

### `src/components/admin/FormCard.tsx` (NOUVEAU)
- Utiliser `Card`, `CardHeader`, `CardContent` de shadcn
- Props en anglais : `code`, `title`, `description`, `category`
- Adapter le style pour correspondre au design Figma
- Structure : code (gris/muted), titre (bold), description

### `src/lib/Divider.tsx` (SUPPRIMER ou DEPRECIER)
- Remplacer par `Separator` de shadcn dans tout le projet
- Ou garder comme alias vers Separator pour compatibilité

### `CLAUDE.md`
- Ajouter la convention : variables en anglais, UI en français
- Documenter l'utilisation de shadcn

## Composants shadcn - Adaptations

### Card (pour FormCard)
```typescript
// Adapter les styles pour correspondre au design Figma
// - Ombre légère
// - Padding horizontal 12px, vertical 7px
// - Border radius 4px
```

### Tabs (pour filtres catégories)
```typescript
// Style "pill" pour les tabs
// - Background brand sur tab active
// - Texte blanc sur active, brand sur inactive
// - Segments connectés visuellement
```

### Avatar (pour AdminUserInfo)
```typescript
// Taille 32x32 ou 40x40
// Fallback avec initiales
```

## Stratégie de test

### Tests manuels
- [ ] Accéder à `/` affiche l'interface membre
- [ ] Accéder à `/admin` affiche l'interface admin
- [ ] Sidebar membre affiche UserInfo avec infos équipe
- [ ] Sidebar admin affiche Avatar + nom utilisateur
- [ ] Navigation admin affiche les bons items de menu
- [ ] Navigation membre affiche les bons items de menu
- [ ] Collapse/expand fonctionne sur les deux interfaces
- [ ] Tabs de filtrage fonctionnent sur la page admin
- [ ] Cards de formulaires s'affichent correctement

## Considérations de déploiement

### Pas de breaking changes
- L'interface membre existante reste identique
- Nouvelles routes ajoutées sans impact sur l'existant

### Préparation future auth
- Le `UserContext` est prêt pour recevoir les infos d'un vrai système d'auth
- Les routes `/admin/*` pourront être protégées facilement
