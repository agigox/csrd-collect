"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Chip, IconButton } from "@rte-ds/react";
import { statusConfig, getFormStatus } from "./statusConfig";
import type { FormTemplate } from "@/models/FormTemplate";
import { FormDetailTabs } from "@/features/form-detail/FormDetailTabs";

interface FormDetailPanelProps {
  form: FormTemplate | null;
  open: boolean;
  onClose: () => void;
  onPublish: (formId: string) => Promise<void>;
}

export const FormDetailPanel = ({
  form,
  open,
  onClose,
  onPublish,
}: FormDetailPanelProps) => {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);

  if (!form || !open) return null;

  const status = getFormStatus(form);
  const chipConfig = statusConfig[status];

  const handlePublish = async () => {
    if (publishing) return;
    setPublishing(true);
    try {
      await onPublish(form.id);
    } finally {
      setPublishing(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/${form.id}`);
  };

  return (
    <div
      className="flex flex-col h-screen w-full sticky top-0 border-l bg-background pl-4 gap-4"
      style={{
        boxShadow: "0 2px 4px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-1 px-6 pt-4">
        {/* Status chip + close button */}
        <div className="flex items-center justify-between">
          <Chip
            id={`panel-status-${form.id}`}
            label={chipConfig.label}
            clickable={false}
            size="s"
            style={{
              background: chipConfig.backgroundColor,
              color: "var(--content-primary)",
            }}
            icon={chipConfig.icon}
          />
          <IconButton
            appearance="outlined"
            aria-label="close"
            name="close"
            onClick={onClose}
            size="m"
            variant="neutral"
            iconColor="var(--content-tertiary)"
          />
        </div>

        {/* Sub-label */}
        <p className="text-sm text-muted-foreground">
          D&eacute;claration - {form.id}
        </p>

        {/* Title + action buttons */}
        <div className="flex items-center justify-between gap-4">
          <h2
            className="text-xl font-bold truncate flex-1"
            style={{ fontFamily: "Nunito, sans-serif", fontSize: "20px" }}
          >
            {form.name}
          </h2>
          <div className="flex gap-2 shrink-0">
            <Button
              label="&Eacute;diter"
              variant="secondary"
              size="m"
              onClick={handleEdit}
            />
            {status === "draft" && (
              <Button
                label={publishing ? "..." : "Publier"}
                variant="primary"
                size="m"
                disabled={publishing}
                onClick={handlePublish}
              />
            )}
          </div>
        </div>
      </div>

      {/* Scrollable body - tabs */}
      <div className="flex-1 overflow-y-auto px-6">
        <FormDetailTabs form={form} />
      </div>
    </div>
  );
};
