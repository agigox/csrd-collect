# Exploration : Interface Admin vs Membre

## Contexte

L'application CSRD-COLLECT a deux types d'utilisateurs :
1. **Membre d'équipe** : fait des déclarations via les formulaires
2. **Administrateur** : crée et gère les formulaires de déclaration

## Design Figma Admin

### Sidebar Admin
- Avatar + nom utilisateur : "Julien Neuville" (pas d'infos d'équipe)
- Menu de navigation :
  - Administration d'équipe
  - Paramètrage déclaratif
  - Gestion des données
- Footer : Paramètres, Réduire le menu

### Page principale Admin
- Titre : "Administration des formulaires de déclaration"
- Bouton : "Ajouter un formulaire"
- Filtres par catégorie : Tous, E1-Pollution, E2-Pollution, E3-Pollution, E4-Pollution
- Liste des formulaires avec :
  - Code (ex: E2-4_vol_01)
  - Nom (ex: Fuite d'huile (SF6))
  - Description

## Interface Membre Actuelle

### Sidebar Membre
- Logo + version
- UserInfo avec : Direction, Centre, GMR, Équipe
- Bouton "Déclarer"
- Menu : Déclarations, Paramètrage déclaratif
- Footer : Paramètres, Réduire le menu

### Page principale Membre
- Titre : "Déclarations"
- Boutons : recherche, filtrer, Déclarer
- Liste des déclarations avec date, nom, lieu, responsable
- Dashboard latéral : à faire, effectuées, modifiées

## Structure Codebase Actuelle

```
src/
├── app/
│   ├── layout.tsx      # Layout racine
│   └── page.tsx        # Page membre actuelle
├── components/
│   ├── sidebar/
│   │   ├── index.tsx      # Sidebar principale
│   │   ├── Header.tsx     # Logo + version
│   │   ├── UserInfo.tsx   # Infos équipe (membre only)
│   │   ├── Navigation.tsx # Menu navigation
│   │   └── NavItem.tsx    # Item de navigation
│   └── declarations/      # Composants déclarations
├── context/
│   ├── SidebarContext.tsx
│   └── DeclarationsContext.tsx
└── lib/                   # Utilitaires et UI
```

## Décision Architecture

**Approche choisie : Routes séparées**
- `/` : Interface membre (actuelle)
- `/admin` : Interface administrateur (nouvelle)

Cette approche permet :
- Séparation claire des responsabilités
- Composants partagés entre les deux interfaces
- Future intégration auth simplifiée
- Développement parallèle possible
