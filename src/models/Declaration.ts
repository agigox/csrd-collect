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

import type { FormTemplate } from "./FormTemplate";

export interface Declaration {
  id: string;
  formTemplateId: string;
  formTemplate?: FormTemplate;
  reference: string;
  location: string;
  authorId: string;
  authorName: string;
  teamId: string;
  status: "draft" | "pending" | "validated";
  completionStatus?: "incomplet" | "complet";
  formData: Record<string, unknown>;
  submittedBy: string;
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
