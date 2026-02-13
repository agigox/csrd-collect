/**
 * Shared mock data for E2E tests.
 * Mirrors the shapes returned by the backend API (http://localhost:4000).
 */

export const mockFormTemplates = [
  {
    id: "form-1",
    code: "E2-1234_01",
    name: "Fuite d'huile",
    description: "Déclaration permettant de signaler une fuite d'huile",
    categoryCode: "E2-4",
    schema: {
      fields: [
        {
          name: "localisation",
          type: "text",
          label: "Localisation",
          required: true,
        },
        {
          name: "gravite",
          type: "select",
          label: "Gravité",
          options: [
            { value: "faible", label: "Faible" },
            { value: "moyenne", label: "Moyenne" },
            { value: "elevee", label: "Élevée" },
          ],
          selectionMode: "single",
        },
      ],
    },
    version: 1,
    isPublished: true,
    publishedAt: "2025-01-15T10:00:00Z",
    parentTemplateId: null,
    isActive: true,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "form-2",
    code: "E1-5678_02",
    name: "Incident de sécurité",
    description: "Signalement d'un incident de sécurité sur site",
    categoryCode: "E1-2",
    schema: {
      fields: [
        {
          name: "description_incident",
          type: "text",
          label: "Description de l'incident",
          required: true,
        },
        {
          name: "date_incident",
          type: "date",
          label: "Date de l'incident",
          includeTime: false,
        },
      ],
    },
    version: 1,
    isPublished: true,
    publishedAt: "2025-02-01T10:00:00Z",
    parentTemplateId: null,
    isActive: true,
    createdAt: "2025-01-20T08:00:00Z",
    updatedAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "form-3",
    code: "E3-9012_03",
    name: "Contrôle qualité",
    description: "Formulaire de contrôle qualité mensuel",
    categoryCode: "E3-2",
    schema: {
      fields: [
        {
          name: "conforme",
          type: "switch",
          label: "Conforme",
        },
      ],
    },
    version: 1,
    isPublished: true,
    publishedAt: "2025-03-01T10:00:00Z",
    parentTemplateId: null,
    isActive: true,
    createdAt: "2025-02-15T08:00:00Z",
    updatedAt: "2025-03-01T10:00:00Z",
  },
];

export const mockDeclarations = [
  {
    id: "decl-1",
    formTemplateId: "form-1",
    reference: "REF-001",
    location: "Site A",
    authorId: "user-1",
    authorName: "Jean Dupont",
    teamId: "TEAM-01",
    description: "Fuite détectée au niveau du transformateur T3",
    status: "pending" as const,
    formData: {
      name: "Fuite d'huile - Transformateur T3",
      localisation: "Transformateur T3",
      gravite: "moyenne"
    },
    submitedBy: "user-1",
    reviewedBy: "",
    reviewComment: "",
    createdAt: "2025-02-07T10:30:00Z",
    updatedAt: "2025-02-07T10:30:00Z",
    submittedAt: "",
    reviewedAt: "",
    isActive: true,
    history: [
      {
        id: "h1",
        userName: "Jean Dupont",
        timestamp: "2025-02-07T10:30:00Z",
        action: "Création de la déclaration",
      },
    ],
  },
  {
    id: "decl-2",
    formTemplateId: "form-2",
    reference: "REF-002",
    location: "Site B",
    authorId: "user-2",
    authorName: "Marie Martin",
    teamId: "TEAM-02",
    description: "Incident signalé au bâtiment B",
    status: "validated" as const,
    formData: {
      name: "Incident de sécurité",
      description_incident: "Chute de matériel"
    },
    submitedBy: "user-2",
    reviewedBy: "user-admin",
    reviewComment: "Validé",
    createdAt: "2025-02-07T08:00:00Z",
    updatedAt: "2025-02-07T14:00:00Z",
    submittedAt: "2025-02-07T09:00:00Z",
    reviewedAt: "2025-02-07T14:00:00Z",
    isActive: true,
    history: [
      {
        id: "h2",
        userName: "Marie Martin",
        timestamp: "2025-02-07T08:00:00Z",
        action: "Création de la déclaration",
      },
    ],
  },
  {
    id: "decl-3",
    formTemplateId: "form-1",
    reference: "REF-003",
    location: "Site C",
    authorId: "user-3",
    authorName: "Pierre Bernard",
    teamId: "TEAM-01",
    description: "Fuite mineure sur la canalisation principale",
    status: "draft" as const,
    formData: {
      name: "Fuite d'huile - Canalisation",
      localisation: "Canalisation principale",
      gravite: "faible"
    },
    submitedBy: "",
    reviewedBy: "",
    reviewComment: "",
    createdAt: "2025-02-06T15:00:00Z",
    updatedAt: "2025-02-06T15:00:00Z",
    submittedAt: "",
    reviewedAt: "",
    isActive: true,
  },
  {
    id: "decl-4",
    formTemplateId: "form-3",
    reference: "REF-004",
    location: "Site A",
    authorId: "user-1",
    authorName: "Jean Dupont",
    teamId: "TEAM-01",
    description: "Contrôle qualité mensuel janvier",
    status: "draft" as const,
    formData: {
      name: "Contrôle qualité - Janvier 2025",
      conforme: true
    },
    submitedBy: "",
    reviewedBy: "",
    reviewComment: "",
    createdAt: "2025-02-05T09:00:00Z",
    updatedAt: "2025-02-05T09:00:00Z",
    submittedAt: "",
    reviewedAt: "",
    isActive: true,
  },
];

export const mockCategoryCodes = [
  { value: "E1-2", label: "E1-2" },
  { value: "E2-4", label: "E2-4" },
  { value: "E3-2", label: "E3-2" },
  { value: "E4-2", label: "E4-2" },
];
