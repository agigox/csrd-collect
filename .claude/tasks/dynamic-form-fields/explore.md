# Exploration: Dynamic Form Fields

## Structure actuelle

```
src/
├── components/           # Composants applicatifs
├── lib/
│   └── components/
│       └── ui/          # Composants Shadcn (Button, Card, Dialog...)
└── context/             # Contextes React
```

## Patterns identifiés

### Composants UI (Shadcn)
- Location: `src/lib/components/ui/`
- Pattern: Composants headless avec Tailwind + Radix UI
- Utilisation de `cn()` pour combiner les classes
- Variants avec CVA (class-variance-authority)

### Composants applicatifs
- Location: `src/components/`
- Pattern: `"use client"` + logique métier + styling Tailwind

### Conventions
- Path aliases: `@/lib/*`, `@/components/*`, `@/context/*`
- Nommage: PascalCase pour composants, camelCase pour utilitaires
- Props: Suffix "Props" pour interfaces

## État des formulaires
- **Aucun input/form complet n'existe actuellement**
- Button existe dans shadcn
- Dialog existe pour les modales
- Manque: Input, Select, Textarea, Checkbox, etc.

## Dépendances clés
- Radix UI pour primitives
- CVA pour variants
- clsx + tailwind-merge via `cn()`
