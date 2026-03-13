"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Divider, Icon } from "@rte-ds/react";
import { fetchTeamTemplates } from "@/api/teams";
import {
  fetchFormTemplates,
  assignTemplatesToTeam,
  removeTemplateFromTeam,
} from "@/api/forms";
import { fetchCategoryCodes } from "@/api/categoryCodes";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
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
      setSearchQuery("");
      setActiveFilter("Tous");
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
      setError("Erreur lors de l'attribution des déclarations. Veuillez réessayer.");
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

  // Filter templates by search + category (memoized)
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      const matchesSearch =
        !searchQuery.trim() ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeFilter === "Tous" ||
        categoryCodes.some(
          (c) => c.label === activeFilter && c.value === t.categoryCode,
        );
      return matchesSearch && matchesCategory;
    });
  }, [allTemplates, searchQuery, activeFilter, categoryCodes]);

  // Build filter tabs: "Tous" + each category label
  const filterTabs = useMemo(
    () => ["Tous", ...categoryCodes.map((c) => c.label)],
    [categoryCodes],
  );

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
              <div className="grid items-center py-2.5" style={{ gridTemplateColumns: "200px 1fr auto" }}>
                <div className="flex flex-col gap-0.5 pr-4 border-r border-border-divider">
                  <span className="text-sm font-medium text-content-secondary">
                    {t.name}
                  </span>
                  <span className="text-xs text-content-tertiary">{t.code}</span>
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

      {/* Modal overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[1000]"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Ajout de type de déclaration"
        >
          <div className="bg-white rounded-xl w-[660px] max-h-[80vh] flex flex-col shadow-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-border-divider">
              <h2 className="text-[26px] font-normal m-0 text-content-primary">
                Ajout de type de déclaration
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-transparent border-none cursor-pointer p-1 flex text-content-secondary"
                aria-label="Fermer"
              >
                <Icon name="close" size={22} />
              </button>
            </div>

            {/* Search bar */}
            <div className="pt-5 px-7 pb-4">
              <div className="flex items-center gap-2.5 border border-border-secondary rounded-lg px-3 py-2">
                <Icon name="search" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-none outline-none text-[15px] bg-transparent"
                />
              </div>
            </div>

            {/* Category filter tabs */}
            <div className="flex items-center px-7 pb-4">
              <div className="flex items-center bg-background-brand-default rounded-[22px] p-[3px]">
                {filterTabs.map((tab) => {
                  const isActive = activeFilter === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveFilter(tab)}
                      className={`px-3.5 py-1.5 rounded-[20px] border-none text-[13px] font-medium cursor-pointer flex items-center gap-[5px] whitespace-nowrap transition-colors duration-150 ${
                        isActive
                          ? "bg-white text-content-secondary"
                          : "bg-transparent text-white"
                      }`}
                    >
                      {isActive && <Icon name="check" size={13} />}
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mx-7 mb-2 px-3 py-2 rounded-lg bg-background-danger-default/10 text-content-danger-default text-sm">
                {error}
              </div>
            )}

            {/* Template list */}
            <div className="flex-1 overflow-y-auto px-7 max-h-[50vh]">
              {filteredTemplates.length === 0 ? (
                <p className="text-sm text-content-tertiary py-5">
                  Aucun formulaire trouvé
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {filteredTemplates.map((t) => {
                    const isSelected = selectedIds.has(t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleTemplate(t.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleTemplate(t.id);
                          }
                        }}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-[22px] h-[22px] rounded flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-background-brand-default"
                              : "border-2 border-border-secondary bg-white"
                          }`}
                        >
                          {isSelected && (
                            <Icon name="check" size={14} className="text-white" />
                          )}
                        </div>

                        {/* Card */}
                        <div className="flex-1 flex items-center rounded-lg bg-white border-t border-border-divider shadow-[0_1px_4px_rgba(0,0,0,0.10)] overflow-hidden">
                          {/* Name + code */}
                          <div className="flex flex-col justify-center gap-[3px] px-4 py-3 min-w-[220px]">
                            <span className="text-base font-semibold text-content-primary">
                              {t.name}
                            </span>
                            <span className="text-xs text-content-tertiary">
                              {t.code}
                            </span>
                          </div>

                          {/* Separator */}
                          <div className="w-px self-stretch my-2 bg-border-divider" />

                          {/* Description */}
                          <div className="flex-1 flex items-center px-4 py-3">
                            <span className="text-[13px] text-content-secondary leading-[1.4]">
                              {t.description || "NA"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex justify-end px-7 py-4">
              <button
                type="button"
                onClick={handleConfirm}
                className="px-7 py-2.5 rounded-md border-none bg-background-brand-default text-white text-sm font-semibold cursor-pointer hover:bg-background-brand-hover transition-colors"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
