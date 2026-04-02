"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Chip,
  Divider,
  Select,
  Switch,
  Textarea,
  Toast,
} from "@rte-ds/react";
import type { FormTemplate } from "@/models/FormTemplate";
import { useCategoryCodesStore } from "@/stores/categoryCodesStore";
import { saveFormTemplate } from "@/api/forms";
import { statusConfig, getFormStatus } from "@/features/forms/statusConfig";

interface ParametresTabProps {
  form: FormTemplate;
}

const EDITABLE_BY_OPTIONS = [
  { value: "author", label: "Auteur" },
  { value: "team", label: "Équipe" },
  { value: "gmr", label: "GMR" },
  { value: "mc", label: "Centre de maintenance" },
  { value: "direction", label: "Direction" },
  { value: "all", label: "Tous" },
];

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

function MetadataRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center py-1">
        <div className="text-muted-foreground w-71">{label}</div>
        <div>{children ?? <span className="font-medium">{value}</span>}</div>
      </div>
      <Divider appearance="default" orientation="horizontal" />
    </div>
  );
}

export function ParametresTab({ form }: ParametresTabProps) {
  const { categoryCodes, fetchCategoryCodes } = useCategoryCodesStore();

  const [editedDescription, setEditedDescription] = useState(
    form.description ?? "",
  );
  const [editedCategoryCode, setEditedCategoryCode] = useState(
    form.categoryCode,
  );
  const [editedVisibilityLevel, setEditedVisibilityLevel] = useState(
    form.visibilityLevel || "team",
  );
  const [editedIsActive, setEditedIsActive] = useState(form.isActive);
  const [saving, setSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Re-sync local state when the selected form changes
  useEffect(() => {
    setEditedDescription(form.description ?? "");
    setEditedCategoryCode(form.categoryCode);
    setEditedVisibilityLevel(form.visibilityLevel || "team");
    setEditedIsActive(form.isActive);
  }, [
    form.id,
    form.description,
    form.categoryCode,
    form.visibilityLevel,
    form.isActive,
  ]);

  // Load category codes on mount
  useEffect(() => {
    fetchCategoryCodes();
  }, [fetchCategoryCodes]);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await saveFormTemplate({
        ...form,
        description: editedDescription || null,
        categoryCode: editedCategoryCode,
        visibilityLevel:
          editedVisibilityLevel || form.visibilityLevel || "team",
        isActive: editedIsActive,
      });
      setShowSaveToast(true);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde des paramètres:", err);
    } finally {
      setSaving(false);
    }
  }, [
    form,
    editedDescription,
    editedCategoryCode,
    editedVisibilityLevel,
    editedIsActive,
    saving,
  ]);

  const status = getFormStatus(form);
  const chipConfig = statusConfig[status];

  const selectOptions = categoryCodes.map((cc) => ({
    value: cc.value,
    label: cc.label,
  }));

  return (
    <div className="flex flex-col gap-5">
      {/* Suspend switch */}
      <div className="flex items-center gap-3 bg-[#f5f5f5] rounded p-2 px-4">
        <Switch
          id="suspend-switch"
          checked={!editedIsActive}
          onChange={() => setEditedIsActive(!editedIsActive)}
        />
        <span className="text-[16px] font-medium">
          Suspendre la déclaration
        </span>
      </div>

      {/* Modifiable par select */}
      <div className="flex flex-col gap-1" style={{ maxWidth: 280 }}>
        <Select
          id="editable-by-select"
          label="Modifiable par"
          options={EDITABLE_BY_OPTIONS}
          value={editedVisibilityLevel}
          onChange={setEditedVisibilityLevel}
          onClear={() => setEditedVisibilityLevel("")}
          width="100%"
        />
      </div>

      {/* Norme select */}
      <div className="flex flex-col gap-1" style={{ maxWidth: 280 }}>
        <Select
          id="norme-select"
          label="Norme"
          options={selectOptions}
          value={editedCategoryCode}
          onChange={setEditedCategoryCode}
          width="100%"
        />
      </div>

      {/* Description textarea */}
      <Textarea
        label="Description"
        labelId="parametres-description-label"
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        style={{ minHeight: 100 }}
      />

      {/* Metadata table */}
      <div className="flex flex-col gap-2 text-sm">
        <MetadataRow label="Code" value={form.code} />
        <MetadataRow label="Version" value={`V${form.version}`} />
        <MetadataRow label="Visibilité">
          <Chip
            id={`param-status-${form.id}`}
            label={chipConfig.label}
            clickable={false}
            size="s"
            style={{
              background: chipConfig.backgroundColor,
              color: "var(--content-primary)",
            }}
            icon={chipConfig.icon}
          />
        </MetadataRow>
        <MetadataRow
          label="Date de publication"
          value={formatDate(form.publishedAt)}
        />
        <MetadataRow label="Créé le" value={formatDate(form.createdAt)} />
        <MetadataRow
          label="Dernière modification"
          value={formatDate(form.updatedAt)}
        />
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="m"
          label={saving ? "..." : "Enregistrer"}
          disabled={saving}
          onClick={handleSave}
        />
      </div>

      <Toast
        message="Modifications enregistrées avec succès"
        type="success"
        isOpen={showSaveToast}
        onClose={() => setShowSaveToast(false)}
        closable
        autoDismiss
        duration="medium"
        placement="bottom-right"
      />
    </div>
  );
}
