# Journal des modifications

## [1.0.0](../../compare/v0.1.0...v1.0.0) (2026-02-23)

### Fonctionnalités

- **auth:** ajout du flux d'authentification avec connexion, inscription et onboarding par rôle ([7a833ac](../../commit/7a833ac))
- **déclarations:** amélioration de la gestion des déclarations avec nouveaux champs et composants UI ([6cb6518](../../commit/6cb6518))
- **déclarations:** interdiction de créer une déclaration sur un formulaire non publié ([049fe89](../../commit/049fe89))
- **form-card:** refonte du composant FormCard et mise à jour de FormsList pour utiliser la prop status ([c0f4e29](../../commit/c0f4e29))
- **form-builder:** ajout d'identifiants hiérarchiques de champs et refonte de la modale de sélection de formulaire ([d1f8252](../../commit/d1f8252))
- **embranchement:** implémentation de la fonctionnalité de détachement des champs d'embranchement avec dialogue de confirmation ([33af48e](../../commit/33af48e))
- **api:** ajout des appels API de sauvegarde et suppression pour les modèles de formulaire ([184fe3e](../../commit/184fe3e))
- **api:** première intégration avec l'API backend réelle ([df70d38](../../commit/df70d38))

### Corrections de bugs

- **déclarations:** amélioration de la mise en page de DeclarationCard et des props de Chip ([06ed47a](../../commit/06ed47a))
- **embranchement:** amélioration du parcours des ancêtres pour l'ouverture des champs descendants ([c11db02](../../commit/c11db02))
- **field-config:** correction du design des nombres dans la carte de configuration de champ ([39456c5](../../commit/39456c5))
- **embranchement:** mise à jour du label de tag d'embranchement ([c7bfbdb](../../commit/c7bfbdb))
- **date:** adaptation du style du champ date au design system RTE ([ff40ab3](../../commit/ff40ab3))
- mise à jour du numéro de version à 1.0.0 dans package.json ([e1f48ae](../../commit/e1f48ae))

### Refactorisation

- **architecture:** réorganisation du projet en architecture basée sur les features et correction des bugs d'embranchement imbriqué ([6934506](../../commit/6934506))
- **modale:** utilisation de Modal de `@rte-ds/react` à la place du composant dialog custom ([7ea3b2f](../../commit/7ea3b2f))
- **label-field:** suppression du wrapper carte sur le LabelField en mode click-to-edit ([b4cd554](../../commit/b4cd554))
- **types:** déplacement des définitions de types dans de nouveaux fichiers constants et types ([6ff0557](../../commit/6ff0557))
- **icônes:** suppression de l'icône lib inutilisée ([798cafe](../../commit/798cafe))
- **modèles:** optimisation des modèles de données et adaptation du schéma au backend ([94f5de6](../../commit/94f5de6), [a2dd271](../../commit/a2dd271))
- **routage:** amélioration de la structure du routage ([f6c8d45](../../commit/f6c8d45))
- **i18n:** renommage des variables françaises en anglais ([049fe89](../../commit/049fe89))

### Documentation

- ajout de la spec pour la refonte du design de FormCard ([e36efd6](../../commit/e36efd6))
- ajout du guide projet CLAUDE.md ([1599975](../../commit/1599975))

### Maintenance

- suppression des fichiers suivis désormais couverts par .gitignore ([8b2eb70](../../commit/8b2eb70))
- suppression de `.playwright-mcp/` du suivi git ([76264ea](../../commit/76264ea))
- suppression de `playwright.config.ts` du suivi git ([79a4f70](../../commit/79a4f70))
- correction d'une faute de frappe dans .gitignore pour le répertoire Visual Studio Code ([5e035e2](../../commit/5e035e2))
- correction du chemin playwright.config.ts dans .gitignore ([717b9c0](../../commit/717b9c0))
- mise à jour des patterns .gitignore ([5b314e4](../../commit/5b314e4), [8f3326a](../../commit/8f3326a))

CSRD-Collect : v0.1.0 → v1.0.0

1. Authentification & Rôles

- Flux complet : connexion, inscription, onboarding
- Distinction des rôles Membre / Admin avec navigation par route

2. Gestion des formulaires (Admin)

- Refonte du composant FormCard avec affichage du statut (brouillon/publié)
- Sauvegarde et suppression des modèles de formulaire via l'API
- Identifiants hiérarchiques des champs + nouvelle modale de sélection

3. Embranchement conditionnel

- Fonctionnalité de détachement des champs avec dialogue de confirmation
- Correction du parcours des ancêtres pour les champs imbriqués
- Mise à jour du label de tag d'embranchement

4. Déclarations (Membre)

- Nouveaux champs et composants UI pour la gestion des déclarations
- Impossibilité de créer une déclaration sur un formulaire non publié
- Amélioration de la mise en page des cartes de déclaration

5. Intégration API backend

- Première connexion avec l'API réelle (migration en cours depuis json-server)
- Endpoints migrés : form-templates (CRUD + publish), declarations (CRUD)

6. Architecture & Qualité

- Réorganisation complète en architecture basée sur les features
- Migration vers les composants @rte-ds/react (Modal)
- Standardisation du code : variables en anglais, types dans des fichiers dédiés
