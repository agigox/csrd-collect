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
    formId: "form-1",
    date: "07/02/2025",
    author: "Jean Dupont",
    title: "Fuite d'huile",
    description: "Fuite détectée au niveau du transformateur T3",
    status: "pending" as const,
    formValues: { localisation: "Transformateur T3", gravite: "moyenne" },
    history: [
      {
        id: "h1",
        userName: "Jean Dupont",
        timestamp: "07/02/2025 10:30",
        action: "Création de la déclaration",
      },
    ],
  },
  {
    id: "decl-2",
    formId: "form-2",
    date: "07/02/2025",
    author: "Marie Martin",
    title: "Incident de sécurité",
    description: "Incident signalé au bâtiment B",
    status: "completed" as const,
    formValues: { description_incident: "Chute de matériel" },
    history: [
      {
        id: "h2",
        userName: "Marie Martin",
        timestamp: "07/02/2025 08:00",
        action: "Création de la déclaration",
      },
    ],
  },
  {
    id: "decl-3",
    formId: "form-1",
    date: "06/02/2025",
    author: "Pierre Bernard",
    title: "Fuite d'huile",
    description: "Fuite mineure sur la canalisation principale",
    status: "modified" as const,
    formValues: { localisation: "Canalisation principale", gravite: "faible" },
  },
];

export const mockCategoryCodes = [
  { value: "E1-2", label: "E1-2" },
  { value: "E2-4", label: "E2-4" },
  { value: "E3-2", label: "E3-2" },
  { value: "E4-2", label: "E4-2" },
];
