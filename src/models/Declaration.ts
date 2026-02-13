export interface ModificationDetail {
  label: string;
}

export interface ModificationEntry {
  id: string;
  userName: string;
  timestamp: string;
  action: string;
  details?: ModificationDetail[];
}

export interface Declaration {
  id: string;
  formTemplateId: string;
  reference: string;
  location: string;
  authorId: string;
  authorName: string;
  teamId: string;
  description: string;
  status: "draft" | "pending" | "validated";
  /** Form data must always contain a 'name' field */
  formData: Record<string, unknown> & { name: string };
  submitedBy: string;
  reviewedBy: string;
  reviewComment: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  reviewedAt: string;
  isActive: boolean;
  history?: ModificationEntry[];
  isNew?: boolean;
}
