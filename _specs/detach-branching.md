# Spec for Detach Branching

branch: claude/feature/detach-branching

## Summary

Ajouter une fonctionnalité de **détachement** aux champs liés par embranchement conditionnel. Le bouton "Detach" (icône `detach`, actuellement marqué `{/* TODO: Detach button */}` dans `Footer.tsx`) permet de rompre le lien parent-enfant d'un champ dans l'arborescence d'embranchement. Deux cas de figure :

1. **Détacher un enfant (ou descendant)** : Le champ enfant est sorti de son parent et devient un champ racine indépendant. Il conserve sa configuration mais perd ses propriétés de rattachement (`parentFieldId`, `parentOptionValue`, `branchingColor`). Il est repositionné juste après le bloc parent+enfants dans le schema.

2. **Détacher un parent** : Le champ parent est détaché de ses enfants. Il devient un champ indépendant sans embranchement (comme un nouveau champ inséré). Ses propriétés d'embranchement sont supprimées (`branchingEnabled`, `branching`, `branchingColors`). Les enfants directs deviennent eux-mêmes des champs racines indépendants (ou sont supprimés - voir Open Questions).

## Functional Requirements

### 1. Visibilite du bouton Detach dans le Footer

- Le bouton Detach n'apparait **que** pour les champs qui remplissent l'une de ces conditions :
  - **Champ parent avec embranchement actif ET au moins un enfant** : Le champ est de type radio/checkbox, a `branchingEnabled: true`, et possede au moins un sous-champ conditionnel dans le schema (un champ avec `parentFieldId` pointant vers lui).
  - **Champ descendant** : Le champ possede un `parentFieldId` (c'est un enfant direct ou un descendant a n'importe quel niveau de profondeur).
- Pour tous les autres champs (racines sans embranchement, champs avec `branchingEnabled` mais sans enfants), le bouton Detach ne doit **pas** apparaitre.
- Le bouton utilise l'icone `detach` et le label d'accessibilite "Detachement".

### 2. Detacher un champ enfant (ou descendant)

Lorsque l'utilisateur clique sur "Detach" sur un champ qui a un `parentFieldId` :

- Le champ est transforme en champ racine :
  - `parentFieldId` est supprime.
  - `parentOptionValue` est supprime.
  - `branchingColor` est supprime.
- Le champ est repositionne dans le schema juste apres le dernier descendant de son ancien parent (en fin de bloc parent).
- La reference au champ est supprimee du `branching` du parent (le `fieldId` est retire du tableau `branching[optionValue]`).
- Si apres retrait, le tableau `branching[optionValue]` est vide, la cle est supprimee de `branching`.
- Si apres retrait, l'objet `branching` est entierement vide, `branchingEnabled` est mis a `false` et `branching`, `branchingColors` sont supprimes du parent.
- Si le champ detache avait lui-meme des enfants (embranchement imbrique), ses enfants **restent attaches a lui** et se deplacent avec lui (et donc panse a mettre a jour `depth`). Le sous-arbre entier est detache comme un bloc.
- La carte de ce champ enfant est ouvert et la carte du champs parent est fermée

### 3. Detacher un champ parent

Lorsque l'utilisateur clique sur "Detach" sur un champ parent (radio/checkbox avec `branchingEnabled` et au moins un enfant) :

- Le champ parent perd toutes ses proprietes d'embranchement :
  - `branchingEnabled` est supprime (ou mis a `false`).
  - `branching` est supprime.
  - `branchingColors` est supprime.
- Tous les enfants directs (champs avec `parentFieldId` pointant vers ce parent) deviennent des champs racines independants :
  - `parentFieldId` est supprime.
  - `parentOptionValue` est supprime.
  - `branchingColor` est supprime.
- Les enfants qui avaient eux-memes des embranchements imbriques conservent leur propre arborescence (les petits-enfants restent lies a leur parent direct devenu racine).
- L'ordre dans le schema est preserve : les anciens enfants restent positionnes apres l'ancien parent dans le meme ordre qu'avant.
- La carte de ce champ parent détachée est ouverte et la carte des champs enfant fermée avec mise à jour de `depth`
- Dans tous les cas il faut aussi penser à mettre à jour `fieldIdentifier`

### 4. Dialogue de confirmation

- Le detachement doit etre precede d'un dialogue de confirmation, similaire au dialogue de suppression existant :
  - Titre : "Detacher ce champ ?" pour un enfant, "Detacher ce champ de ses enfants ?" pour un parent.
  - Description adaptee au contexte :
    - Pour un enfant : "Ce champ deviendra independant et ne sera plus conditionne par [nom du parent]."
    - Pour un parent : "Ce champ sera detache de ses [N] sous-champs. Les sous-champs deviendront independants."
  - Boutons : "Annuler" et "Confirmer".

### 5. Integration avec le FormBuilder

- Apres un detachement, le schema est mis a jour et le FormBuilder re-rend la liste des champs.
- Les cartes des champs detaches doivent refleter immediatement leur nouvel etat (disparition du tag de couleur pour les anciens enfants, disparition du sélecteur d'embranchement pour l'ancien parent).
- Le systeme multi-active field groups (`activeFieldNames`, `primaryActiveFieldName`) dans le store doit etre mis a jour : les champs detaches ne sont plus groupes avec leur ancien parent.

### 6. Impact sur la preview (DynamicForm)

- Apres detachement d'un enfant, le champ detache apparait toujours dans le formulaire mais **de maniere inconditionnelle** (il n'est plus masque/affiche selon la selection du parent).
- Apres detachement d'un parent, tous les anciens enfants apparaissent de maniere inconditionnelle.

## Possible Edge Cases

- **Detacher le dernier enfant d'une option** : Si c'est le seul sous-champ lie a cette option, la cle correspondante dans `branching` est supprimee. Si c'etait le dernier embranchement global, `branchingEnabled` passe a `false`.
- **Detacher un enfant avec embranchement imbrique** : Le sous-arbre entier se deplace avec l'enfant detache. Les petits-enfants conservent leur lien avec leur parent direct.
- **Detacher un parent dont les enfants ont des embranchements** : Chaque enfant direct devient racine mais conserve ses propres sous-enfants.
- **Detachement et undo** : Pas de mecanisme d'undo prevu dans cette version. Le dialogue de confirmation est le garde-fou.
- **Detachement et sauvegarde** : Le detachement modifie le schema en memoire. La sauvegarde suit le flux normal (via le store formEditor).
- **Detachement pendant la preview** : Le detachement ne se fait que cote admin (FormBuilder), pas dans la preview.
- **Profondeur de detachement** : Un grand-enfant detache remonte au niveau racine directement, pas au niveau de son grand-parent.

## Acceptance Criteria

- [ ] Le bouton Detach apparait uniquement pour les champs parents avec `branchingEnabled` et au moins un enfant, et pour tous les descendants.
- [ ] Le bouton Detach n'apparait pas pour les champs racines sans embranchement ni pour les champs avec `branchingEnabled` sans enfants.
- [ ] Detacher un enfant le transforme en champ racine (suppression de `parentFieldId`, `parentOptionValue`, `branchingColor`).
- [ ] Detacher un enfant met a jour le `branching` du parent (retrait de l'ID, nettoyage des cles vides).
- [ ] Detacher un enfant avec sous-arbre imbrique deplace le bloc entier (enfant + ses descendants).
- [ ] Detacher un parent supprime ses proprietes d'embranchement et transforme ses enfants directs en racines.
- [ ] Les petits-enfants restent lies a leur parent direct apres detachement du grand-parent.
- [ ] Un dialogue de confirmation apparait avant chaque detachement.
- [ ] Le FormBuilder re-rend correctement apres detachement (tags de couleur, selecteurs d'embranchement).
- [ ] La preview affiche les champs detaches de maniere inconditionnelle.
- [ ] L'ordre du schema est preserve apres detachement.

## Open Questions

- Faut-il permettre un undo/redo du detachement ?
  - Non prevu dans cette version, le dialogue de confirmation suffit.
- Lors du detachement d'un parent, les enfants deviennent-ils tous des racines independantes ou faut-il proposer de les supprimer ?
  - Les enfants deviennent des racines independantes (pas de suppression).
- Le bouton Detach doit-il avoir un tooltip explicatif ?
  - Oui, un tooltip "Detacher ce champ" serait utile pour la decouverte de la fonctionnalite.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Le bouton Detach apparait pour un champ enfant (champ avec `parentFieldId`).
- Le bouton Detach apparait pour un champ parent avec `branchingEnabled` et au moins un enfant.
- Le bouton Detach n'apparait pas pour un champ racine sans embranchement.
- Le bouton Detach n'apparait pas pour un champ avec `branchingEnabled` mais sans enfants.
- Detacher un enfant supprime `parentFieldId`, `parentOptionValue`, `branchingColor`.
- Detacher un enfant met a jour le mapping `branching` du parent.
- Detacher le dernier enfant desactive `branchingEnabled` du parent.
- Detacher un parent transforme tous ses enfants directs en racines.
- Detacher un enfant avec embranchement imbrique conserve ses propres enfants.
- Le dialogue de confirmation s'affiche avant le detachement.
