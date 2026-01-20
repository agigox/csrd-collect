# Gestion des sources de données pour les listes déroulantes

## Vue d'ensemble

Les champs de type "Liste déroulante" (select) peuvent être alimentés par des sources de données prédéfinies dans le fichier `db.json`. Cette documentation explique comment ajouter et configurer de nouvelles sources de données.

## Structure des données

Les sources de données sont organisées de manière hiérarchique dans `db.json` sous la clé `options` :

```json
{
  "options": {
    "<type_de_donnee>": {
      "label": "Label affiché",
      "data": [
        {
          "key": "<source_de_donnee>",
          "label": "Label de la source",
          "items": [
            { "value": "valeur_unique", "label": "Texte affiché" }
          ]
        }
      ]
    }
  }
}
```

### Niveaux de la hiérarchie

1. **Type de donnée** (`dataType`) : Catégorie principale (ex: "addresses", "users", "products")
2. **Source de donnée** (`dataSource`) : Sous-catégorie contenant les options (ex: "cities", "postal_codes")
3. **Items** : Liste des options disponibles avec `value` et `label`

## Configuration dans l'interface admin

Lors de la configuration d'un champ liste déroulante :

1. Sélectionnez le **Type de donnée** dans le premier menu déroulant
2. Sélectionnez la **Source de donnée** dans le second menu déroulant
3. Les options sont automatiquement chargées et affichées

## Ajouter un nouveau type de donnée

Pour ajouter un nouveau type de donnée (ex: "vehicles"), ajoutez une nouvelle entrée dans `options` :

```json
{
  "options": {
    "vehicles": {
      "label": "Véhicules",
      "data": [
        {
          "key": "brands",
          "label": "Marques",
          "items": [
            { "value": "renault", "label": "Renault" },
            { "value": "peugeot", "label": "Peugeot" },
            { "value": "citroen", "label": "Citroën" }
          ]
        },
        {
          "key": "types",
          "label": "Types de véhicule",
          "items": [
            { "value": "car", "label": "Voiture" },
            { "value": "truck", "label": "Camion" },
            { "value": "motorcycle", "label": "Moto" }
          ]
        }
      ]
    }
  }
}
```

## Ajouter une nouvelle source à un type existant

Pour ajouter une nouvelle source de donnée à un type existant, ajoutez un nouvel objet dans le tableau `data` :

```json
{
  "options": {
    "addresses": {
      "label": "Adresses",
      "data": [
        // ... sources existantes ...
        {
          "key": "countries",
          "label": "Pays",
          "items": [
            { "value": "france", "label": "France" },
            { "value": "belgium", "label": "Belgique" },
            { "value": "switzerland", "label": "Suisse" }
          ]
        }
      ]
    }
  }
}
```

## Types existants

| Type de donnée | Clé | Sources disponibles |
|----------------|-----|---------------------|
| Adresses | `addresses` | `cities` (Villes), `postal_codes` (Codes postaux), `streets` (Rues) |
| Utilisateurs | `users` | `user_ids` (Identifiants), `user_names` (Noms), `user_emails` (Emails) |
| Produits | `products` | `product_categories` (Catégories), `product_brands` (Marques) |

## Format des items

Chaque item doit respecter le format suivant :

```typescript
interface SelectOption {
  value: string;  // Valeur unique utilisée en interne
  label: string;  // Texte affiché à l'utilisateur
}
```

### Bonnes pratiques

- Utilisez des valeurs `value` en minuscules avec underscores (snake_case)
- Les `label` peuvent contenir des caractères spéciaux et accents
- Gardez les `value` uniques au sein d'une même source

## API Endpoint

Les données sont servies par json-server à l'endpoint :

```
GET http://localhost:4000/options
```

Réponse : Objet contenant tous les types de données avec leurs sources.

## Types TypeScript

```typescript
// Interface pour un item d'option
interface SelectOption {
  value: string;
  label: string;
}

// Interface pour une source de données
interface DataSourceItem {
  key: string;
  label: string;
  items: SelectOption[];
}

// Interface pour un type de données
interface DataTypeOption {
  label: string;
  data: DataSourceItem[];
}

// Interface pour toutes les options
interface OptionsData {
  [key: string]: DataTypeOption;
}
```

## Configuration dans le formulaire

Quand un champ select est configuré avec une source de données, les propriétés suivantes sont stockées :

```typescript
interface SelectFieldConfig {
  type: "select";
  dataType?: string;    // Clé du type (ex: "addresses")
  dataSource?: string;  // Clé de la source (ex: "cities")
  options: SelectOption[];  // Options chargées
  // ... autres propriétés
}
```
