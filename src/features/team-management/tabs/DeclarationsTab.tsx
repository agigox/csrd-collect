"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Checkbox, Divider, Icon, Modal } from "@rte-ds/react";
import { fetchTeamTemplates } from "@/api/teams";
import {
  fetchFormTemplates,
  assignTemplatesToTeam,
  removeTemplateFromTeam,
} from "@/api/forms";
import { fetchCategoryCodes } from "@/api/categoryCodes";
import { FormsListView } from "@/components/FormsListView";
import { FormCard } from "@/features/forms/FormCard";
import { getFormStatus } from "@/features/forms/statusConfig";
import type { FormTemplate } from "@/models/FormTemplate";
import type { CategoryCode } from "@/models/CategoryCode";

interface Template {
  id: string;
  name: string;
  code: string;
  description?: string;
  categoryCode?: string;
}

interface DeclarationsTabProps {
  teamId: string;
}

export function DeclarationsTab({ teamId }: DeclarationsTabProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [allTemplates, setAllTemplates] = useState<FormTemplate[]>([]);
  const [categoryCodes, setCategoryCodes] = useState<CategoryCode[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = useCallback(() => {
    setLoading(true);
    fetchTeamTemplates(teamId)
      .then(setTemplates)
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, [teamId]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleOpenModal = async () => {
    try {
      const [all, cats] = await Promise.all([
        fetchFormTemplates(),
        fetchCategoryCodes(),
      ]);
      setAllTemplates(all);
      setCategoryCodes(cats);
      setSelectedIds(new Set(templates.map((t) => t.id)));
      setError(null);
    } catch {
      setAllTemplates([]);
    }
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const templateIds = Array.from(selectedIds);
      await assignTemplatesToTeam(teamId, templateIds);
      setModalOpen(false);
      loadTemplates();
    } catch {
      setError(
        "Erreur lors de l'attribution des déclarations. Veuillez réessayer.",
      );
    }
  };

  const handleRemoveTemplate = async (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    const name = template?.name ?? "cette déclaration";
    if (!window.confirm(`Voulez-vous vraiment retirer « ${name} » ?`)) return;

    try {
      await removeTemplateFromTeam(teamId, templateId);
      loadTemplates();
    } catch (err) {
      console.error("Failed to remove template:", err);
    }
  };

  const toggleTemplate = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground py-4">Chargement...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-content-secondary">
          {templates.length} déclaration{templates.length !== 1 ? "s" : ""}
        </span>
        <Button
          icon="add-box"
          iconPosition="right"
          label="Ajouter"
          size="m"
          variant="primary"
          onClick={handleOpenModal}
        />
      </div>

      {/* Declaration list */}
      {templates.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune déclaration attribuée
        </p>
      ) : (
        <div className="flex flex-col">
          {templates.map((t, idx) => (
            <div key={t.id}>
              <div
                className="grid items-center py-2.5"
                style={{ gridTemplateColumns: "200px 1fr auto" }}
              >
                <div className="flex flex-col gap-0.5 pr-4 border-r border-border-divider">
                  <span className="text-sm font-medium text-content-secondary">
                    {t.name}
                  </span>
                  <span className="text-xs text-content-tertiary">
                    {t.code}
                  </span>
                </div>
                <div className="pl-4 pr-2">
                  <span className="text-[13px] text-content-tertiary">
                    {t.description || ""}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTemplate(t.id)}
                  className="bg-transparent border-none cursor-pointer p-1 flex items-center text-content-tertiary hover:text-content-primary"
                  title="Retirer"
                >
                  <Icon name="delete" size={16} />
                </button>
              </div>
              {idx < templates.length - 1 && (
                <Divider appearance="default" orientation="horizontal" />
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        id="ajout-type-declaration"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Ajout de type de déclaration"
        size="s"
        primaryButton={
          <Button variant="primary" label="Valider" onClick={handleConfirm} />
        }
        secondaryButton={
          <Button
            variant="neutral"
            label="Annuler"
            onClick={() => setModalOpen(false)}
          />
        }
      >
        <div className="flex flex-col gap-3 w-full" style={{ height: "475px" }}>
          {/* Error message */}
          {error && (
            <div className="px-3 py-2 rounded-lg bg-background-danger-default/10 text-content-danger-default text-sm">
              {error}
            </div>
          )}

          <FormsListView
            forms={allTemplates}
            categoryCodes={categoryCodes}
            className="flex-1 overflow-y-auto"
            renderItem={(form) => {
              const isSelected = selectedIds.has(form.id);
              const status = getFormStatus(form);
              const isDisabled = status === "deleted";
              return (
                <div
                  key={form.id}
                  onKeyDown={(e) => {
                    if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      toggleTemplate(form.id);
                    }
                  }}
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-disabled={isDisabled}
                  tabIndex={0}
                  className={`flex items-center gap-2.5 ${isDisabled ? "opacity-70" : "cursor-pointer"}`}
                >
                  {/* Stop propagation so checkbox onChange + parent onClick don't double-toggle */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id={`template-${form.id}`}
                      checked={isSelected}
                      onChange={() => toggleTemplate(form.id)}
                      label=""
                      showLabel={false}
                      disabled={isDisabled}
                    />
                  </div>
                  <div className="flex-1">
                    <FormCard
                      title={form.name}
                      status={status}
                      onClick={() => !isDisabled && toggleTemplate(form.id)}
                    />
                  </div>
                </div>
              );
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
