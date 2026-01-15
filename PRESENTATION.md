# CSRD-COLLECT

## Présentation du projet

### Qu'est-ce que CSRD-COLLECT ?

Une application web de **collecte de données CSRD** (Corporate Sustainability Reporting Directive) permettant aux équipes de faire leurs déclarations environnementales via des formulaires configurables.

---

## Objectif

Centraliser et standardiser la collecte des données CSRD au sein de l'organisation, en offrant :
- Une interface simple pour les **déclarants**
- Une interface de gestion pour les **administrateurs**

---

## Deux types d'utilisateurs

### Membre d'équipe (`/`)
- Appartient à une hiérarchie : Direction → Centre → GMR → Équipe
- Consulte ses déclarations (en attente, complétées, modifiées)
- Remplit des formulaires de déclaration

### Administrateur (`/admin`)
- Crée et configure les formulaires
- Gère les paramètres déclaratifs
- Filtre par norme (E1, E2, E3, E4 - Pollution)

---

## Stack technique

| Technologie | Version |
|-------------|---------|
| Next.js | 16.1 (App Router) |
| React | 19.2 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| shadcn/ui | Dernière |

**Gestionnaire de paquets** : `pnpm`

---

## Architecture du projet

```
src/
├── app/              # Routage Next.js
│   ├── admin/        # Pages administrateur
│   └── ...           # Pages membre
├── components/       # Composants UI réutilisables
├── context/          # États globaux (User, Declarations, Forms)
└── lib/
    ├── form-fields/  # Système de champs dynamiques
    └── components/   # Composants shadcn/ui
```

---

## Système de formulaires dynamiques

L'innovation clé : des **formulaires configurables en JSON**.

### Types de champs disponibles
- `text` - Champ texte
- `number` - Valeur numérique
- `select` - Liste déroulante
- `unit` - Nombre avec unité (kg, L, m²...)
- `switch` - Switch oui/non
- `calendar` - Sélecteur de date

### Exemple de configuration
```typescript
{
  name: "quantite",
  type: "unit",
  label: "Quantité de déchets",
  unit: "kg",
  required: true
}
```

---

## Interface utilisateur

### Sidebar responsive
- Mode étendu (220px) / réduit (60px)
- Adaptation selon le rôle (admin/membre)

### Composants shadcn/ui
Card, Dialog, Tabs, Button, Badge, Select, Avatar...

### Thème personnalisé
Variables CSS pour les couleurs : `sidebar-*`, `primary-*`, `content-*`

---

## Données actuelles

- **Déclarations** : `/public/data/declarations.json`
- **Formulaires** : `/public/data/forms.json`
- **Statuts** : En attente, Complétée, Modifiée

> ⚠️ Pas encore de backend - données statiques pour le moment

---

## Commandes utiles

```bash
pnpm run dev      # Serveur de développement
pnpm run build    # Build de production
pnpm run lint     # Vérification du code
```

---

## Conventions

| Élément | Langue | Style |
|---------|--------|-------|
| Variables/fonctions | Anglais | camelCase |
| Types/interfaces | Anglais | PascalCase |
| Interface utilisateur | Français | - |

---

## Prochaines étapes

- [ ] Intégration backend (API/base de données)
- [ ] Système d'authentification
- [ ] Gestion des équipes (`/admin/equipes`)
- [ ] Export des données collectées
- [ ] Notifications et rappels

---

## Points forts du projet

1. **Modularité** - Système de champs extensible
2. **UX soignée** - Animations fluides, sidebar responsive
3. **Code structuré** - Séparation claire des responsabilités
4. **Localisation** - Entièrement en français (dates, messages d'erreur)
