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
  formId: string;
  date: string;
  author: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "modified";
  formValues?: Record<string, unknown>;
  history?: ModificationEntry[];
  isNew?: boolean;
}
