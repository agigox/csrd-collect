# Spec for Embranchement Conditionnel

branch: claude/feature/embranchement-conditionnel

## Summary

Ajouter une fonctionnalité d'**embranchement conditionnel** aux champs **radio** (choix unique) et **checkbox** (choix multiple). Lorsqu'un administrateur active l'embranchement sur un de ces champs, chaque option du champ affiche un sélecteur **multi-select** (utilisant `@rte-ds/react` Select en mode multiple) permettant de lier **plusieurs sous-champs conditionnels** à une même option. Ces sous-champs n'apparaissent dans le formulaire (preview et côté membre) que lorsque l'option correspondante est sélectionnée.

## Functional Requirements

### 1. Bouton Embranchement dans le Footer

- Le bouton embranchement (icône `branch`, actuellement marqué `{/* TODO Embranchement button */}` dans `Footer.tsx`) doit devenir fonctionnel **uniquement pour les champs radio et checkbox**.
- Pour tous les autres types de champs (text, number, select, switch, date, import), le bouton embranchement doit être **supprimé** du footer.
- Le Footer doit recevoir une nouvelle prop (ex: `onBranching` ou `showBranchingButton`) pour contrôler l'affichage et le comportement du bouton.
- Au clic sur le bouton embranchement, un état `branchingEnabled` bascule (toggle) pour le champ courant. (choix libre de stocker dans le store ou en local sur la config du champ)
- L'embranchement imbriqué est supporté : un sous-champ de type radio/checkbox peut lui-même avoir des embranchements.

### 2. Interface d'embranchement dans le configurateur (admin)

- Lorsque l'embranchement est activé pour un champ radio ou checkbox :
  - À côté de chaque option (Choix 1, Choix 2, etc.), un **sélecteur déroulant multi-select** (composant Select de `@rte-ds/react` en mode `multiple`) apparaît avec le label "Embranchement".
  - Ce sélecteur propose la liste de tous les types de champs disponibles dans le système (text, number, select, radio, checkbox, switch, date, import) **plus une option "Aucun"** (qui vide la sélection).
  - Choisir "Aucun" signifie qu'aucun sous-champ n'est lié à cette option (efface toute sélection).
  - Choisir un ou plusieurs types de champs crée autant de sous-champs conditionnels liés à cette option.

- Lorsque l'embranchement est désactivé (re-clic sur le bouton) :
  - Les sélecteurs d'embranchement disparaissent.
  - Les sous-champs conditionnels associés sont supprimés.

### 3. Sous-champs conditionnels dans le FormBuilder (admin)

- Lorsque des types de champs sont choisis dans le sélecteur d'embranchement d'une option :
  - Un nouveau champ pour chaque type sélectionné est **inséré juste en dessous** du champ parent (radio/checkbox) dans le schema.
  - La carte parente et **toutes ses cartes enfants** (sous-champs) doivent être **ouvertes** (actives) simultanément dans le FormBuilder.
  - Lorsqu'on **ferme la carte parente**, toutes les cartes enfants doivent être **fermées** automatiquement.
  - Les sous-champs sont visuellement liés au champ parent via un **tag coloré** au-dessus de leur titre (voir Figma design).

- Si l'utilisateur désélectionne un type dans le multi-select, le sous-champ correspondant est supprimé du schema.
- Si l'utilisateur sélectionne "Aucun", tous les sous-champs de cette option sont supprimés.
- Il est possible de lier un champ existant du schema OU de créer un nouveau sous-champ.

### 4. Modèle de données

- Les configs `RadioFieldConfig` et `CheckboxFieldConfig` dans `FieldTypes.ts` doivent être étendues avec :
  - `branchingEnabled?: boolean` — Indique si l'embranchement est activé.
  - `branching?: Record<string, string[]>` — Mapping `optionValue → fieldIds[]` des sous-champs conditionnels associés. La clé est la `value` de l'option, la valeur est un **tableau d'`id`** des champs enfants dans le schema.

- Les sous-champs conditionnels dans le schema principal (`FieldConfig[]`) doivent avoir des propriétés supplémentaires :
  - `parentFieldId?: string` — L'id du champ parent auquel ce sous-champ est rattaché.
  - `parentOptionValue?: string` — La valeur de l'option qui déclenche l'affichage de ce sous-champ.

- `BaseFieldConfig` dans `FieldTypes.ts` doit être étendue avec ces deux propriétés optionnelles.

### 5. Rendu conditionnel dans le DynamicForm (preview / côté membre)

- Dans `DynamicForm.tsx`, lors du rendu du schema :
  - Les champs ayant un `parentFieldId` et un `parentOptionValue` ne sont affichés que si la valeur courante du champ parent correspond à `parentOptionValue`.
  - Pour un champ radio parent : les sous-champs apparaissent si la valeur sélectionnée == `parentOptionValue`.
  - Pour un champ checkbox parent : les sous-champs apparaissent si `parentOptionValue` est inclus dans le tableau de valeurs sélectionnées.
  - Plusieurs sous-champs peuvent apparaître simultanément pour une même option (car multi-select).
  - L'apparition/disparition doit être animée (cohérent avec les animations existantes via motion/react).

### 6. Comportement du sélecteur d'embranchement (multi-select)

- Le sélecteur utilise le composant Select de `@rte-ds/react` en mode `multiple` (selectionMode).
- La liste des types dans le sélecteur doit correspondre aux types disponibles : Champ libre, Nombre, Liste déroulante, Choix unique, Choix multiple, Switch, Date, Import de fichier.
- Une option "Aucun" est disponible et efface toutes les sélections quand choisie.
- Le sélecteur utilise les labels français définis dans `typeLabels`.
- Chaque type peut être sélectionné **plusieurs fois** (ex: 2 champs "text" sur la même option) — chaque sélection crée un champ distinct.

### 7. Indication visuelle des sous-champs

- Une couleur aléatoire (valeur hexa) est attribuée par option parent ayant un embranchement.
- La bordure du sélecteur d'embranchement prend cette couleur lorsqu'un type est sélectionné (ref: `.claude/tasks/embranchement/embranchement-selected.png` — bordure cyan/turquoise).
- Au niveau de la carte du sous-champ enfant, un **tag coloré** (même couleur aléatoire que la bordure du sélecteur parent) avec l'icône branch et un numéro est affiché au-dessus du titre de la carte (ref: `.claude/tasks/embranchement/enbranchement-tag.png`).

## Figma Design Reference

- Fichier avant embranchement : `.claude/tasks/embranchement/avant.png`
- Fichier après embranchement : `.claude/tasks/embranchement/apres.png`
- Sélecteur avec bordure colorée : `.claude/tasks/embranchement/embranchement-selected.png`
- Tag sur carte enfant : `.claude/tasks/embranchement/enbranchement-tag.png`
- Key visual constraints :
  - Le sélecteur d'embranchement apparaît à droite de chaque TextInput d'option, entre le TextInput et le bouton d'action (add/close).
  - Le label "Embranchement" est affiché au-dessus du sélecteur, aligné avec le label "Choix N" du TextInput.
  - Le sélecteur affiche "Aucun" par défaut.
  - La largeur du TextInput d'option est réduite pour laisser la place au sélecteur.
  - Bordure du sélecteur colorée (couleur aléatoire hexa) quand un embranchement est défini.
  - Tag coloré (icône branch + numéro) au-dessus du titre de la carte enfant.

## Possible Edge Cases

- **Suppression d'une option parent** : Si une option qui a des embranchements est supprimée, tous les sous-champs conditionnels associés doivent aussi être supprimés du schema.
- **Duplication d'un champ parent** : Si un champ radio/checkbox avec des embranchements est dupliqué, les sous-champs conditionnels doivent aussi être dupliqués avec de nouveaux IDs.
- **Changement de type du champ parent** : Si l'admin change un champ radio en text (via le sélecteur de type dans LabelField), tous les embranchements et sous-champs conditionnels doivent être supprimés.
- **Déplacement (move up/down)** : Un champ parent avec ses sous-champs doit se déplacer comme un bloc (le parent et ses enfants restent ensemble).
- **Drag & drop (reorder)** : Les sous-champs conditionnels doivent suivre leur parent lors du réordonnancement.
- **Embranchement imbriqué** : Supporté — un sous-champ de type radio/checkbox peut lui-même avoir des embranchements.
- **Valeur par défaut et embranchement** : Si un champ radio a une valeur par défaut et un embranchement sur cette option, les sous-champs conditionnels doivent être visibles par défaut dans la preview.
- **Multiples sous-champs par option** : Plusieurs sous-champs du même type ou de types différents peuvent être liés à une même option.

## Acceptance Criteria

- [x] Le bouton embranchement n'apparaît que dans le footer des champs radio et checkbox (et de leurs sous-champs radio/checkbox pour l'imbrication).
- [x] Au clic sur le bouton embranchement, des sélecteurs multi-select "Embranchement" apparaissent à côté de chaque option.
- [x] Le sélecteur multi-select propose "Aucun" + tous les types de champs disponibles.
- [ ] Sélectionner un ou plusieurs types crée autant de sous-champs conditionnels dans le schema, visibles en dessous du parent dans le FormBuilder.
- [ ] La carte parente et toutes ses cartes enfants sont ouvertes (actives) simultanément dans le FormBuilder.
- [ ] Fermer la carte parente ferme automatiquement toutes ses cartes enfants.
- [ ] Désélectionner un type supprime le sous-champ conditionnel correspondant du schema.
- [ ] Choisir "Aucun" supprime tous les sous-champs conditionnels de cette option.
- [ ] Dans la preview (DynamicForm), les sous-champs conditionnels apparaissent/disparaissent selon l'option sélectionnée.
- [ ] Supprimer une option qui a des embranchements supprime aussi les sous-champs associés.
- [ ] Dupliquer un champ parent duplique aussi ses sous-champs conditionnels.
- [ ] Changer le type d'un champ parent supprime tous ses embranchements.
- [ ] L'embranchement imbriqué fonctionne (un sous-champ radio/checkbox peut avoir ses propres embranchements).
- [ ] Le design respecte les maquettes Figma (sélecteur à droite, bordure colorée, tag sur carte enfant).
- [ ] Il est possible de lier un champ existant du schema ou de créer un nouveau sous-champ.

## Open Questions

- Faut-il supporter l'embranchement imbriqué ?
  - Oui, supporté dans cette version.
- Faut-il permettre de lier un champ existant du schema plutôt que de toujours créer un nouveau sous-champ ?
  - Oui, il faut pouvoir lier un champ existant ou créer un nouveau.
- Faut-il une indication visuelle particulière dans le FormBuilder pour distinguer les sous-champs conditionnels des champs normaux ?
  - Oui : couleur aléatoire hexa pour la bordure du sélecteur et un tag coloré (icône branch + numéro) au-dessus du titre de la carte enfant.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Activer/désactiver l'embranchement sur un champ radio affiche/masque les sélecteurs.
- Sélectionner plusieurs types dans le sélecteur multi-select d'embranchement ajoute autant de sous-champs au schema.
- Désélectionner un type supprime le sous-champ correspondant du schema.
- Choisir "Aucun" supprime tous les sous-champs de cette option.
- Dans le DynamicForm, sélectionner une option radio affiche tous les sous-champs conditionnels correspondants.
- Supprimer une option avec embranchements nettoie les sous-champs du schema.
- Le bouton embranchement est absent pour les champs text, number, select, switch, date, import.
- L'embranchement imbriqué fonctionne correctement.
