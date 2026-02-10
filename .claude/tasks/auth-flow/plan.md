# Prompt Claude Code — Flux Authentification & Onboarding CSRD-COLLECT

## Contexte

Il faut intégrer un flux d'authentification complet (inscription, connexion, onboarding équipe) avec **deux rôles utilisateur** : **Member** et **Admin**. Les maquettes de référence sont fournies via Figma (liens ci-dessous) et dans le dossier `e2e-tests/screenshots/`. Tu dois implémenter les **composants + tests e2e avec Playwright** pour couvrir l'intégralité de ce workflow.

**Stack du projet :**

- **Next.js** / React / Tailwind CSS / TypeScript
- **Design system** : `@rte-ds/react` — utilise les composants `TextInput`, `Button`, `Select`, etc. de cette lib pour tous les formulaires
- **State management auth** : utilise le store `useAuth` (à créer ou compléter) pour les données partagées d'authentification (user, role, status, teamInfo, isAuthenticated…)
- **BDD simulée** : `json-server` avec fichier `db.json` à la racine du projet
- **Tests e2e** : Playwright (TypeScript)
- **Figma** : utilise le plugin `figma-desktop` MCP server pour récupérer les designs

**Utilise le skill `frontend-design` pour tous les composants UI.**

---

## Rôles utilisateur

| Rôle | Description | Onboarding équipe | Approbation requise |
|------|-------------|-------------------|---------------------|
| **Member** | Utilisateur terrain (déclarations) | ✅ Oui — modal équipe à la 1ère connexion | Non |
| **Admin** | Administrateur de l'app | ❌ Non — accès direct après approbation | ✅ Oui — approuvé par Super Admin |
| **Super Admin** | Pas de rôle dans l'app pour l'instant | — | Gestion manuelle en BDD (`db.json`) |

### Mécanisme d'approbation Admin

- À l'inscription, un Admin a `status: 'pending'` dans `db.json`.
- Un Super Admin change manuellement ce statut à `'approved'` directement dans `db.json` (pas d'interface Super Admin pour l'instant).
- Tant que `status !== 'approved'`, l'Admin voit un **modal bloquant "En attente d'approbation"** et ne peut pas accéder à l'interface.
- Une fois `status === 'approved'`, l'Admin accède directement à `/admin` (liste des formulaires) **sans modal équipe**.

### Flux après connexion

```
Member  → Connexion → 1ère fois ?    → Modal onboarding équipe → /declarations
                    → Déjà rempli ?  → /declarations (infos équipe en sidebar)

Admin   → Connexion → status='pending'   → Modal "En attente d'approbation" (bloquant)
                    → status='approved'  → /admin (PAS de modal, PAS d'infos équipe)
```

---

## Architecture des écrans

Layout d'authentification en **deux colonnes** :

- **Colonne gauche (fond bleu foncé `#1a2332`)** : slider/carousel avec illustrations, titre, sous-titre, indicateurs de pagination (dots + lignes). Logo "NA CSRD collecte" en haut à gauche.
  - Images du carousel : `./slider-1.jpg`, `./slider-2.jpg`, `./slider-3.jpg`
- **Colonne droite (fond blanc)** : formulaire d'authentification (change selon l'étape).

---

## Flux 1 — Inscription (Registration)

### Étape 1 : Formulaire d'inscription initial

**Design Figma** : `@https://www.figma.com/design/22XagL30mehDXPnRkwEtO8/Mocks?node-id=322-42849&m=dev`

**Titre** : "Bienvenue sur le collecteur"
**Sous-titre** : "S'inscrire"

**Champs du formulaire (utilise `TextInput` de `@rte-ds/react`)** :

| Champ | Type | Obligatoire | Validation |
|-------|------|------------|------------|
| Nom | `TextInput` | Non (optionnel) | — |
| Prénom | `TextInput` | Non (optionnel) | — |
| Email ou NNI | `TextInput` | **Oui** | NNI = alphanumérique, exactement 5 caractères majuscules (ex: `AB123`, `X9Y8Z`). Sinon, email valide. |
| Rôle | Radio group ou `Select` | **Oui** (défaut: Member) | Choix entre "Member" et "Admin". ⚠️ Ce champ **n'existe pas dans les maquettes Figma**, il faut l'ajouter au formulaire. |

**Comportement du bouton "Poursuivre" (utilise `Button` de `@rte-ds/react`)** :

- **Disabled** tant que "Email ou NNI" est vide ou invalide.
- **Actif (bleu)** dès qu'un NNI valide ou email valide est saisi.
- Nom, Prénom et Rôle n'impactent **pas** l'état du bouton.

**Lien en bas** : "Vous avez déjà un compte ? Se connecter" → redirige vers la page de connexion.

**Tests Playwright à écrire :**

```
- Le bouton "Poursuivre" est disabled au chargement initial
- Le bouton reste disabled si seuls Nom et/ou Prénom sont remplis (sans NNI/email)
- Le bouton reste disabled avec un NNI invalide ("AB1" → court, "ab123" → minuscules, "ABCDEF" → long, "AB 12" → espace)
- Le bouton devient enabled avec un NNI valide ("AB123")
- Le bouton devient enabled avec un email valide ("test@example.com")
- Le bouton redevient disabled si on vide le champ NNI/email
- Le sélecteur de rôle est présent avec "Member" sélectionné par défaut
- L'utilisateur peut basculer entre "Member" et "Admin"
- Le choix du rôle n'impacte pas l'état du bouton
- Le lien "Se connecter" redirige vers la page de connexion
- Le slider/carousel est visible avec les indicateurs de pagination
```

---

### Étape 2 : Création du mot de passe

**Designs Figma** :
- Faible : `@https://www.figma.com/design/22XagL30mehDXPnRkwEtO8/Mocks?node-id=322-42900&m=dev`
- Moyen : `@https://www.figma.com/design/22XagL30mehDXPnRkwEtO8/Mocks?node-id=322-42950&m=dev`
- Fort : `@https://www.figma.com/design/22XagL30mehDXPnRkwEtO8/Mocks?node-id=322-43000&m=dev`

**Titre** : "Bienvenue sur le collecteur"
**Sous-titre** : "Création du mot de passe"

**Champs (utilise `TextInput` de `@rte-ds/react` — la lib fournit déjà la possibilité d'insérer une icône à droite pour le toggle visibilité)** :

| Champ | Type | Description |
|-------|------|-------------|
| Mot de passe | `TextInput` type password + icône toggle 👁 | Champ principal |
| Vérification mot de passe | `TextInput` type password + icône toggle 👁 | Confirmation |

**Indicateur de force (barre segmentée en 3 parties)** :

| Niveau | Couleur | Label | Segments | Message |
|--------|---------|-------|----------|---------|
| Faible | Rouge `#E53E3E` | "Faible" | 1/3 | "Ce mot de passe est trop facile à deviner." |
| Moyen | Orange `#DD6B20` | "Moyen" | 2/3 | "Vous pouvez augmenter la sécurité de ce mot de passe avec **plus de 12 caractères**." |
| Fort | Vert `#38A169` | "Fort" | 3/3 | "Ce mot de passe est excellent ! Vous pouvez continuer." |

**Critères du mot de passe (checklist avec indicateurs ✅/❌)** :

```
- 8 caractères minimum
- 1 lettre majuscule
- 1 lettre minuscule
- 1 caractère spécial (#&%*#...)
- 1 chiffre
```

**Comportement du bouton "S'inscrire"** :

- **Disabled** tant que le mot de passe est "Faible".
- **Actif** quand le mot de passe est au moins "Moyen" (tous critères de base validés).
- La vérification doit correspondre au mot de passe.

**Mention légale** : "En cliquant sur le bouton s'inscrire vous acceptez les conditions générales d'utilisations."
**Lien en bas** : "Vous avez déjà un compte ? Se connecter"

**Tests Playwright à écrire :**

```
- Le bouton "S'inscrire" est disabled au chargement
- Mot de passe faible ("abc12") :
  - Barre 1/3 rouge, label "Faible" rouge
  - Message "Ce mot de passe est trop facile à deviner."
  - Critères ❌ non validés, ✅ validés (minuscule, chiffre)
  - Bouton reste disabled
- Mot de passe moyen ("Abcdef1#") :
  - Barre 2/3 orange, label "Moyen" orange
  - Message suggère plus de 12 caractères
  - Tous critères ✅
  - Bouton enabled
- Mot de passe fort ("Abcdef1#ghijk") :
  - Barre 3/3 verte, label "Fort" vert
  - Message de confirmation
  - Bouton enabled
- Toggle visibilité fonctionne (password ↔ text)
- Vérification doit matcher le mot de passe
- Lien "Se connecter" fonctionnel
```

---

## Flux 2 — Connexion (Login)

**Design Figma** : `@https://www.figma.com/design/22XagL30mehDXPnRkwEtO8/Mocks?node-id=322-42799&m=dev`

**Titre** : "Bienvenue sur le collecteur"
**Sous-texte** : "Pour accéder au collecteur, veuillez vous identifier ou vous inscrire."
**Sous-titre formulaire** : "Se connecter"

**Champs** :

| Champ | Composant | Obligatoire |
|-------|-----------|------------|
| Email ou NNI | `TextInput` de `@rte-ds/react` | Oui |
| Mot de passe | `TextInput` type password + toggle 👁 | Oui |

**Comportement du bouton "Se connecter"** :

- **Disabled** tant que les deux champs ne sont pas remplis.
- **Actif** uniquement quand Email/NNI **ET** Mot de passe sont remplis.

**Liens** :
- "Mot de passe oublié" → page de récupération
- "Vous n'avez pas de compte ? S'inscrire" → page d'inscription

**Tests Playwright à écrire :**

```
- Bouton "Se connecter" disabled au chargement
- Bouton disabled si seul Email/NNI rempli
- Bouton disabled si seul mot de passe rempli
- Bouton enabled quand les deux champs remplis
- Bouton redevient disabled si on vide un champ
- Toggle visibilité fonctionne
- Lien "Mot de passe oublié" présent et cliquable
- Lien "S'inscrire" redirige vers inscription
- Navigation bidirectionnelle "Se connecter" ↔ "S'inscrire"
```

---

## Flux 3 — Première connexion Member : Modal Onboarding Équipe

> **Ce flux s'applique uniquement aux `Member`.** Les Admins ne voient **jamais** ce modal.

**Composant existant** : `src/components/auth/LoginModal.tsx` — à adapter/compléter.

### Écran avec modal (ref: `Ecran-accueil-sans-validation.jpg`)

Après première connexion d'un Member, la page "Déclarations" s'affiche avec un **modal bloquant** par-dessus.

**Modal** :
- **Titre** : "Bienvenue sur CSRD collecte"
- **Message** : "Avant de commencer, veuillez renseigner votre équipe d'appartenance."
- **Bouton fermer (X)** en haut à droite

**Champs du modal (utilise `Select` de `@rte-ds/react` avec bouton clear ⊗)** :

| Champ | Type |
|-------|------|
| Direction | `Select` dropdown avec clear |
| Centre maintenance | `Select` dropdown avec clear |
| GMR | `Select` dropdown avec clear |
| Equipe | `Select` dropdown avec clear |

**Comportement** :
- Le modal apparaît **à chaque connexion** tant que les infos d'équipe ne sont pas validées.
- Le bouton **"Valider"** enregistre les choix dans `useAuth` store et via l'API (json-server).
- Fermer le modal (X) sans valider → il réapparaîtra à la prochaine connexion.

### Écran après validation (ref: `Ecran-accueil-validation.jpg`)

Après validation, la page s'affiche sans modal. La **sidebar gauche** affiche :

```
Direction : Maintenance
Centre :    Aura
GMR :       lorem
Equipe :    Emasi
```

**Tests Playwright à écrire :**

```
- [Member] Après 1ère connexion, le modal s'affiche automatiquement
- [Member] Le modal contient les 4 dropdowns (Direction, Centre maintenance, GMR, Equipe)
- [Member] Le bouton "Valider" est présent
- [Member] Remplir les 4 dropdowns et cliquer "Valider" ferme le modal
- [Member] Après validation, la sidebar affiche les infos d'équipe sélectionnées
- [Member] Après validation, la page Déclarations est accessible
- [Member] Fermer le modal (X) sans valider → il réapparaît à la prochaine connexion
- [Member] Se reconnecter après validation → le modal ne réapparaît plus
- [Member] Les boutons clear (⊗) des dropdowns fonctionnent
- [Admin] Après connexion (status='approved'), le modal d'équipe ne s'affiche PAS
- [Admin] La sidebar n'affiche PAS de bloc infos d'équipe
```

---

## Flux 4 — Connexion Admin : Approbation par Super Admin

> **Ce flux s'applique uniquement aux `Admin`.** Pas de maquette Figma → crée le design toi-même (modal bloquant, style cohérent avec le reste de l'app).

### Modèle de données (`db.json`)

```json
{
  "users": [
    {
      "id": "1",
      "email": "admin@csrd.fr",
      "nni": "XY789",
      "nom": "Menard",
      "prenom": "Jérôme",
      "role": "admin",
      "status": "pending",
      "password": "hashed..."
    }
  ]
}
```

```typescript
// Type dans le projet
type UserStatus = 'pending' | 'approved';

interface User {
  id: string;
  email?: string;
  nni?: string;
  nom?: string;
  prenom?: string;
  role: 'member' | 'admin';
  status: UserStatus; // pertinent uniquement pour les admins
}
```

### Cas 1 : Admin non approuvé (`status = 'pending'`)

Après connexion, un **modal bloquant** s'affiche (même pattern que le modal équipe pour les Members, à créer).

**Contenu du modal** :
- **Titre** : "En attente d'approbation par un Super administrateur"
- **Message** : "Votre compte administrateur est en cours de validation. Un super administrateur doit approuver votre accès. Vous serez notifié par email une fois votre compte activé."
- **Overlay** : bloque l'accès à la sidebar et la page principale.
- **Bouton** : "Se déconnecter" → retour à la page de connexion.

### Cas 2 : Admin approuvé (`status = 'approved'`)

Accès direct à `/admin` (liste des formulaires) :
- Pas de modal d'onboarding équipe
- Pas d'infos d'équipe dans la sidebar

### Simulation de l'approbation (tests)

- **En test Playwright** : intercepter les appels API via `page.route()` pour mocker `status: 'approved'` ou `status: 'pending'`.
- **En BDD** : modifier directement `db.json`.

```typescript
// Helper Playwright pour mocker le statut admin
async function mockAdminStatus(page: Page, status: 'pending' | 'approved') {
  await page.route('**/users/*', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json.status = status;
    json.role = 'admin';
    await route.fulfill({ json });
  });
}
```

**Tests Playwright à écrire :**

```
- [Admin pending] Après connexion, le modal "En attente d'approbation" s'affiche
- [Admin pending] Le message d'attente est visible
- [Admin pending] La page /admin n'est PAS accessible (overlay bloquant)
- [Admin pending] La sidebar / navigation est masquée par l'overlay
- [Admin pending] Le bouton "Se déconnecter" ramène à la page de connexion
- [Admin pending] Rafraîchir la page maintient le modal d'attente
- [Admin pending] Accès direct à /admin → redirigé / modal toujours visible
- [Admin approved] Après connexion, accès direct à /admin
- [Admin approved] Le modal d'onboarding équipe ne s'affiche PAS
- [Admin approved] La sidebar n'affiche PAS les infos d'équipe
- [Admin approved] La sidebar affiche le nom de l'utilisateur
- [Admin approved] La page /admin (formulaires) est pleinement fonctionnelle
- [Transition] Admin 'pending' → 'approved' (via mock) → accès après reconnexion
```

---

## Flux Complets — Scénarios E2E Principaux

### Scénario A — Parcours complet Member

```
1.  Arriver sur la page d'inscription
2.  Vérifier le slider/carousel visible avec illustrations
3.  Rôle "Member" sélectionné par défaut
4.  Saisir NNI valide ("AB123") → bouton "Poursuivre" s'active
5.  Cliquer "Poursuivre" → écran création mot de passe
6.  Saisir mot de passe faible → barre rouge + critères ❌ + bouton disabled
7.  Saisir mot de passe moyen → barre orange + critères ✅ + bouton enabled
8.  Saisir mot de passe fort → barre verte + message confirmation
9.  Saisir vérification identique
10. Cliquer "S'inscrire" → inscription réussie
11. Naviguer vers "Se connecter"
12. Saisir NNI + mot de passe → bouton s'active
13. Cliquer "Se connecter" → page d'accueil
14. Modal onboarding équipe s'affiche (car Member)
15. Remplir les 4 dropdowns
16. Cliquer "Valider" → modal se ferme
17. Sidebar affiche les infos d'équipe
18. Page "Déclarations" visible
19. Se déconnecter → se reconnecter → modal ne réapparaît plus
```

### Scénario B — Parcours complet Admin (pending → approved)

```
1.  Arriver sur la page d'inscription
2.  Sélectionner rôle "Admin"
3.  Saisir NNI valide ("XY789") → bouton "Poursuivre" s'active
4.  Cliquer "Poursuivre" → créer mot de passe fort
5.  Cliquer "S'inscrire" → inscription réussie (status='pending' dans db.json)
6.  Naviguer vers "Se connecter"
7.  Saisir identifiants → se connecter
8.  Modal "En attente d'approbation" s'affiche (PAS le modal équipe)
9.  /admin bloqué par l'overlay
10. Se déconnecter
11. [Simulation] Passer status à 'approved' (modifier db.json ou mock API)
12. Se reconnecter
13. Accès direct à /admin (PAS de modal onboarding)
14. Sidebar sans infos d'équipe
15. Page "Formulaires" pleinement fonctionnelle
```

### Scénario C — Flux croisés (rôles)

```
1. Member se connecte → voit le modal équipe
2. Admin (approved) se connecte → PAS de modal
3. Admin (pending) se connecte → modal d'attente
4. Routes protégées selon rôle et statut
```

---

## Store `useAuth`

Le store doit centraliser les données d'authentification. Structure suggérée :

```typescript
// src/store/useAuth.ts (ou src/hooks/useAuth.ts selon la convention du projet)
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: { nniOrEmail: string; password: string }) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateTeamInfo: (teamInfo: TeamInfo) => Promise<void>;

  // Computed / Helpers
  isAdmin: boolean;
  isMember: boolean;
  isPendingApproval: boolean;       // role='admin' && status='pending'
  needsTeamOnboarding: boolean;     // role='member' && teamInfo=null
}

interface TeamInfo {
  direction: string;
  centre: string;
  gmr: string;
  equipe: string;
}

interface RegisterData {
  nom?: string;
  prenom?: string;
  nniOrEmail: string;
  password: string;
  role: 'member' | 'admin';
}
```

---

## API json-server (`db.json`)

Structure du fichier `db.json` à la racine :

```json
{
  "users": [
    {
      "id": "1",
      "nni": "AB123",
      "email": "member@csrd-collecte.fr",
      "nom": "Neuville",
      "prenom": "Julien",
      "role": "member",
      "password": "Abcdef1#ghijk!",
      "teamInfo": null
    },
    {
      "id": "2",
      "nni": "XY789",
      "email": "admin-pending@csrd-collecte.fr",
      "nom": "Menard",
      "prenom": "Jérôme",
      "role": "admin",
      "status": "pending",
      "password": "Admin1#secure!"
    },
    {
      "id": "3",
      "nni": "ZW456",
      "email": "admin-approved@csrd-collecte.fr",
      "nom": "Dupont",
      "prenom": "Marie",
      "role": "admin",
      "status": "approved",
      "password": "Admin1#secure!"
    }
  ],
  "teams": {
    "directions": ["Maintenance", "Exploitation", "Ingénierie"],
    "centres": ["Aura", "Nord", "Sud-Est"],
    "gmrs": ["lorem", "ipsum", "dolor"],
    "equipes": ["Emasi", "Alpha", "Bravo"]
  }
}
```

**Endpoints json-server attendus** :
- `GET /users?nni=AB123` — recherche par NNI
- `GET /users?email=...` — recherche par email
- `POST /users` — inscription
- `PATCH /users/:id` — mise à jour (teamInfo, status)
- `GET /teams` — listes pour les dropdowns

---

## Route protection (middleware Next.js)

```typescript
// middleware.ts ou dans un guard/layout
// Logique de protection des routes :
// 1. Non authentifié → /login
// 2. role='admin' && status='pending' → modal bloquant "En attente d'approbation"
// 3. role='admin' && status='approved' → /admin (pas de modal équipe)
// 4. role='member' && teamInfo=null → modal onboarding équipe
// 5. role='member' && teamInfo rempli → /declarations (accès normal)
```

---

## Structure de fichiers attendue

Adapte cette structure à celle **déjà existante** dans le dossier `e2e-tests/` du projet :

```
e2e-tests/
├── fixtures/
│   └── db.json                          # Données seed pour json-server (users, teams)
├── screenshots/                         # Maquettes de référence
│   ├── Connexion.jpg
│   ├── Connexion-1.jpg
│   ├── Connexion-2.jpg
│   ├── Connexion-3.jpg
│   ├── Connexion-4.jpg
│   ├── Ecran-accueil-sans-validation.jpg
│   └── Ecran-accueil-validation.jpg
├── specs/
│   ├── registration-step1.spec.ts       # Inscription étape 1 (NNI/Email + rôle)
│   ├── registration-step2.spec.ts       # Création mot de passe
│   ├── login.spec.ts                    # Connexion (commun Member/Admin)
│   ├── onboarding-team.spec.ts          # Modal onboarding équipe (Member)
│   ├── admin-approval.spec.ts           # Flux approbation Admin (pending/approved)
│   ├── full-member-flow.spec.ts         # Parcours complet Member
│   └── full-admin-flow.spec.ts          # Parcours complet Admin
├── helpers/
│   ├── auth.helpers.ts                  # Helpers : login, register, mockAdminStatus
│   ├── db.helpers.ts                    # Helpers : reset db.json, seed data, patchUser
│   └── selectors.ts                     # Sélecteurs data-testid centralisés
└── playwright.config.ts                 # (si pas déjà dans la racine)
```

---

## Données de test (dans `e2e-tests/fixtures/db.json`)

```json
{
  "users": [
    {
      "id": "seed-member",
      "nni": "AB123",
      "email": "member@csrd-collecte.fr",
      "nom": "Neuville",
      "prenom": "Julien",
      "role": "member",
      "password": "Abcdef1#ghijk!",
      "teamInfo": null
    },
    {
      "id": "seed-admin-pending",
      "nni": "XY789",
      "email": "admin-pending@csrd-collecte.fr",
      "nom": "Menard",
      "prenom": "Jérôme",
      "role": "admin",
      "status": "pending",
      "password": "Admin1#secure!"
    },
    {
      "id": "seed-admin-approved",
      "nni": "ZW456",
      "email": "admin-approved@csrd-collecte.fr",
      "nom": "Dupont",
      "prenom": "Marie",
      "role": "admin",
      "status": "approved",
      "password": "Admin1#secure!"
    }
  ],
  "teams": {
    "directions": ["Maintenance", "Exploitation", "Ingénierie"],
    "centres": ["Aura", "Nord", "Sud-Est"],
    "gmrs": ["lorem", "ipsum", "dolor"],
    "equipes": ["Emasi", "Alpha", "Bravo"]
  }
}
```

**Constantes de validation pour les tests :**

```typescript
// e2e-tests/helpers/test-data.ts
export const TEST_DATA = {
  validNNI: 'AB123',
  invalidNNIs: ['ab123', 'AB1', 'ABCDEF', 'AB 12', '12345'],
  validEmail: 'test@csrd-collecte.fr',
  invalidEmails: ['test', 'test@', '@test.com'],
  weakPassword: 'abc12',
  mediumPassword: 'Abcdef1#',
  strongPassword: 'Abcdef1#ghijk!',
  teamInfo: {
    direction: 'Maintenance',
    centre: 'Aura',
    gmr: 'lorem',
    equipe: 'Emasi',
  },
} as const;
```

---

## Consignes techniques

- **Playwright** avec TypeScript pour tous les tests e2e.
- Composants `@rte-ds/react` (`TextInput`, `Button`, `Select`…) pour tous les formulaires.
- `useAuth` store pour les données d'authentification partagées.
- **`data-testid`** sur tous les composants (voir liste ci-dessous). Si les composants n'en ont pas, les ajouter.
- **Intercepter les appels API** avec `page.route()` de Playwright pour les mocks.
- **Assertions d'accessibilité** de base (rôles ARIA, labels).
- Chaque fichier de test **indépendant** (exécutable seul).
- Les tests du parcours complet peuvent dépendre d'un état séquentiel.
- Avant chaque test, **reset `db.json`** vers les données seed pour garantir l'isolation.

### Helpers Playwright

```typescript
// e2e-tests/helpers/auth.helpers.ts
import { Page } from '@playwright/test';

export async function registerUser(page: Page, data: {
  nniOrEmail: string;
  password: string;
  role?: 'member' | 'admin';
  nom?: string;
  prenom?: string;
}) {
  await page.goto('/register');
  if (data.nom) await page.getByTestId('input-nom').fill(data.nom);
  if (data.prenom) await page.getByTestId('input-prenom').fill(data.prenom);
  await page.getByTestId('input-nni-email').fill(data.nniOrEmail);
  if (data.role === 'admin') await page.getByTestId('role-admin').click();
  await page.getByTestId('btn-poursuivre').click();
  await page.getByTestId('input-password').fill(data.password);
  await page.getByTestId('input-password-confirm').fill(data.password);
  await page.getByTestId('btn-sinscrire').click();
}

export async function loginUser(page: Page, nniOrEmail: string, password: string) {
  await page.goto('/login');
  await page.getByTestId('input-nni-email').fill(nniOrEmail);
  await page.getByTestId('input-password').fill(password);
  await page.getByTestId('btn-se-connecter').click();
}

export async function mockAdminStatus(page: Page, status: 'pending' | 'approved') {
  await page.route('**/users/*', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json.status = status;
    json.role = 'admin';
    await route.fulfill({ json });
  });
}

export async function fillTeamModal(page: Page, teamInfo: {
  direction: string; centre: string; gmr: string; equipe: string;
}) {
  await page.getByTestId('select-direction').selectOption(teamInfo.direction);
  await page.getByTestId('select-centre').selectOption(teamInfo.centre);
  await page.getByTestId('select-gmr').selectOption(teamInfo.gmr);
  await page.getByTestId('select-equipe').selectOption(teamInfo.equipe);
  await page.getByTestId('btn-valider').click();
}
```

```typescript
// e2e-tests/helpers/db.helpers.ts
import fs from 'fs';
import path from 'path';

const SEED_PATH = path.resolve(__dirname, '../fixtures/db.json');
const DB_PATH = path.resolve(__dirname, '../../db.json');

export function resetDatabase() {
  const seed = fs.readFileSync(SEED_PATH, 'utf-8');
  fs.writeFileSync(DB_PATH, seed);
}

export function patchUser(userId: string, patch: Record<string, unknown>) {
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  const user = db.users.find((u: any) => u.id === userId);
  if (user) Object.assign(user, patch);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
```

---

## `data-testid` à ajouter aux composants

```
// --- Layout & Slider ---
data-testid="auth-slider"                    // Slider/carousel gauche
data-testid="slider-indicator"               // Dots du slider

// --- Inscription Étape 1 ---
data-testid="input-nom"                      // Champ Nom
data-testid="input-prenom"                   // Champ Prénom
data-testid="input-nni-email"                // Champ Email ou NNI
data-testid="role-selector"                  // Conteneur sélecteur de rôle
data-testid="role-member"                    // Option rôle Member
data-testid="role-admin"                     // Option rôle Admin
data-testid="btn-poursuivre"                 // Bouton Poursuivre

// --- Inscription Étape 2 (Mot de passe) ---
data-testid="input-password"                 // Champ Mot de passe
data-testid="input-password-confirm"         // Champ Vérification
data-testid="toggle-password-visibility"     // Toggle visibilité
data-testid="password-strength-bar"          // Barre de force
data-testid="password-strength-label"        // Label (Faible/Moyen/Fort)
data-testid="password-strength-message"      // Message
data-testid="password-criteria-list"         // Liste des critères
data-testid="password-criteria-length"       // Critère 8 caractères
data-testid="password-criteria-uppercase"    // Critère majuscule
data-testid="password-criteria-lowercase"    // Critère minuscule
data-testid="password-criteria-special"      // Critère caractère spécial
data-testid="password-criteria-digit"        // Critère chiffre
data-testid="btn-sinscrire"                  // Bouton S'inscrire

// --- Connexion ---
data-testid="btn-se-connecter"               // Bouton Se connecter
data-testid="link-se-connecter"              // Lien "Se connecter"
data-testid="link-sinscrire"                 // Lien "S'inscrire"
data-testid="link-mot-de-passe-oublie"       // Lien "Mot de passe oublié"

// --- Modal Onboarding Équipe (Member) ---
data-testid="modal-onboarding"               // Modal équipe
data-testid="modal-close-btn"                // Bouton fermer (X)
data-testid="select-direction"               // Dropdown Direction
data-testid="select-centre"                  // Dropdown Centre maintenance
data-testid="select-gmr"                     // Dropdown GMR
data-testid="select-equipe"                  // Dropdown Equipe
data-testid="btn-valider"                    // Bouton Valider

// --- Sidebar ---
data-testid="sidebar-team-info"              // Bloc infos équipe (Member)
data-testid="sidebar-direction"              // Valeur Direction
data-testid="sidebar-centre"                 // Valeur Centre
data-testid="sidebar-gmr"                    // Valeur GMR
data-testid="sidebar-equipe"                 // Valeur Equipe
data-testid="sidebar-user-name"              // Nom utilisateur
data-testid="sidebar-role-badge"             // Badge "Admin"

// --- Modal Attente Approbation Admin ---
data-testid="modal-approval-pending"         // Modal d'attente
data-testid="approval-pending-title"         // Titre
data-testid="approval-pending-message"       // Message
data-testid="btn-deconnecter"                // Bouton "Se déconnecter"
```