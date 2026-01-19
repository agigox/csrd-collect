# TASKS.md

Liste des fonctionnalités à implémenter pour CSRD-COLLECT.

---

## 1. Configuration Liste Déroulante (Select)

**Chemin** : `src/lib/form-fields/field-configurator/select/`

### 1.1 Supprimer l'import CSV

- [ ] Supprimer la fonctionnalité d'import d'options via fichier CSV
- [ ] Supprimer tout le code et références associés

### 1.2 Ajouter mode de sélection

- [ ] Ajouter deux boutons radio : "Choix unique" et "Choix multiple"
- [ ] Si "Choix unique" : comportement select actuel
- [ ] Si "Choix multiple" : afficher une checkbox à côté de chaque option
- [ ] Mettre à jour le bloc Prévisualisation selon le mode sélectionné

### 1.3 Restructurer les sources de données

Modifier la structure dans `db.json` :

```json
{
  "options": {
    "addresses": {
      "label": "Adresses",
      "data": [
        {
          "label": "Rues",
          "items": [
            { "value": "street1", "label": "Street 1" },
            { "value": "street2", "label": "Street 2" }
          ]
        },
        {
          "label": "Codes postaux",
          "items": [
            { "value": "code1", "label": "78210" },
            { "value": "code2", "label": "78211" }
          ]
        }
      ]
    },
    "users": {
      "label": "Utilisateurs",
      "data": [
        {
          "label": "Ids",
          "items": [
            { "value": "id1", "label": "ID 1" },
            { "value": "id2", "label": "ID 2" }
          ]
        },
        {
          "label": "Noms",
          "items": [
            { "value": "nom1", "label": "Nom 1" },
            { "value": "nom2", "label": "Nom 2" }
          ]
        }
      ]
    }
  }
}
```

**Comportement attendu** :

- [ ] Premier select "Type de données" : affiche "Adresses" ou "Utilisateurs"
- [ ] Deuxième select "Source de données" : remplacer le champ texte "Lien API" par un select
  - Si "Adresses" → affiche "Rues" et "Codes postaux"
  - Si "Utilisateurs" → affiche "Ids" et "Noms"
- [ ] Prévisualisation : affiche les items correspondants
- [ ] Créer un fichier `docs/DATA_SOURCES.md` pour documenter cette fonctionnalité

### 1.4 Simplifier l'affichage des options chargées

- [ ] Ne pas afficher les options dans le bloc ConfiguratorField (droite) quand chargées depuis une source
- [ ] Les options sont déjà visibles dans le modal Prévisualisation
- [ ] Checkbox "Définir une valeur par défaut" : au clic, remplacer par un select permettant de choisir parmi les options chargées

---

## 2. Fusionner Nombre et Quantité avec unité

**Chemins** :

- `src/lib/form-fields/field-configurator/number/`
- `src/lib/form-fields/field-configurator/unit/`

- [ ] Fusionner les champs "Nombre" et "Quantité avec unité" en un seul champ "Nombre"
- [ ] Ajouter une option "Sans unité" dans le sélecteur d'unité
- [ ] Si "Sans unité" sélectionné → champ de type number simple
- [ ] Supprimer le dossier `unit/` après migration

---

## 3. Header du FieldConfigurator

**Chemin** : `src/lib/form-fields/field-configurator/common/Header.tsx`

### 3.1 Réorganisation des champs (drag & drop)

- [ ] Ajouter icône flèche vers le haut
- [ ] Ajouter icône flèche vers le bas
- [ ] Ajouter icône drag & drop (maintenir clic pour déplacer)
- [ ] Ces icônes ne sont visibles qu'au hover sur le Header
- [ ] Synchroniser l'ordre avec le bloc Prévisualisation

### 3.2 Confirmation de suppression

- [ ] Afficher un modal de confirmation avant suppression d'un champ

### 3.3 Indication de duplication

- [ ] Lors d'un clic sur "Dupliquer", afficher un tag à côté du titre (ex: "Champ libre (copie)")
- [ ] Le tag disparaît dès que l'utilisateur modifie le champ dupliqué

---

## 4. Supprimer le bloc Statistiques

**Composant** : `StatCard`

- [ ] Supprimer le composant StatCard
- [ ] Supprimer l'affichage dans l'onglet droite de `http://localhost:3000/`
- [ ] Vider les données associées dans le store

---

## 5. Bug fix : Valeur par défaut du champ Date

- [ ] Corriger le bug : après avoir choisi "Date du jour" puis "Aucune", la prévisualisation affiche toujours la date du jour
- [ ] "Aucune" doit réellement vider la prévisualisation

---

## 6. Tooltip pour la description des champs

- [ ] Afficher la description configurée en tooltip au hover sur le champ
- [ ] Appliquer dans le modal Prévisualisation
- [ ] Appliquer lors de la création d'une déclaration depuis un formulaire
- [ ] Utiliser le composant Tooltip du design system

---

## 7. Liste des déclarations (membre)

**Route** : `http://localhost:3000/`

- [ ] Centrer la liste des déclarations avec `max-width: 602px`
- [ ] Modal "Nouvelle déclaration" : supprimer l'overlay
- [ ] Permettre de naviguer entre les déclarations sans fermer le modal

---

## 8. Paramétrage déclaratif (admin)

**Route** : `http://localhost:3000/admin/parametrage-declaratif`

- [ ] Centrer le bloc "Nouveau formulaire" avec `max-width: 602px`
- [ ] À l'ouverture du modal "Prévisualisation" : déplacer "Nouveau formulaire" à gauche
- [ ] Les deux éléments doivent être visibles simultanément

---

## 9. Champ Import de fichier

**Chemin** : `src/lib/form-fields/field-configurator/import/`

- [ ] Continuer le développement du champ permettant d'importer un fichier quelconque
- [ ] Implémenter la configuration (types de fichiers acceptés, taille max, etc.)
- [ ] Implémenter la prévisualisation

---

## Notes

- Utiliser Context7 pour la gestion d'état si nécessaire
- Toute l'UI doit rester en français
- Tester chaque fonctionnalité dans le bloc Prévisualisation
- Proposer une meilleure structure de données si pertinent
