"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Chip } from "@rte-ds/react";
import { statusConfig, getFormStatus } from "./statusConfig";
import type { FormTemplate } from "@/models/FormTemplate";
import { FormDetailTabs } from "@/features/form-detail/FormDetailTabs";
import { SidePanel } from "@/components/common";

interface FormDetailPanelProps {
  form: FormTemplate | null;
  open: boolean;
  onClose: () => void;
  onPublish: (formId: string) => Promise<void>;
  onUnpublish: (formId: string) => Promise<void>;
}

export const FormDetailPanel = ({
  form,
  open,
  onClose,
  onPublish,
  onUnpublish,
}: FormDetailPanelProps) => {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);

  if (!form) return null;

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

  const handleUnpublish = async () => {
    if (publishing) return;
    setPublishing(true);
    try {
      await onUnpublish(form.id);
    } finally {
      setPublishing(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin?id=${form.id}`);
  };

  return (
    <SidePanel open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex flex-col gap-1 px-6 -mt-2">
        {/* Status chip */}
        <div className="flex items-center">
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
            {status === "published" && (
              <Button
                label={publishing ? "..." : "Dépublier"}
                variant="primary"
                size="m"
                disabled={publishing}
                onClick={handleUnpublish}
              />
            )}
          </div>
        </div>
      </div>

      {/* Scrollable body - tabs */}
      <div className="flex-1 overflow-y-auto px-6">
        <FormDetailTabs form={form} />
      </div>
    </SidePanel>
  );
};
