import type { FormTemplate } from "@/models/FormTemplate";

export type FormCardStatus = "draft" | "published" | "validated" | "deleted";

export const statusConfig: Record<
  FormCardStatus,
  { label: string; backgroundColor: string; icon?: string }
> = {
  draft: {
    label: "Essai",
    backgroundColor: "var(--decorative-jaune-ocre)",
    icon: "sticky-note",
  },
  published: {
    label: "Publié",
    backgroundColor: "var(--decorative-bleu-rte)",
    icon: "sticky-note-valide",
  },
  validated: {
    label: "Validé",
    backgroundColor: "var(--decorative-vert-digital)",
    icon: "check-circle",
  },
  deleted: {
    label: "Suppr.",
    backgroundColor: "var(--decorative-rose-digital)",
    icon: "delete",
  },
};

export function getFormStatus(form: FormTemplate): FormCardStatus {
  if (!form.isActive) return "deleted";
  if (form.isPublished) return "published";
  return "draft";
}
