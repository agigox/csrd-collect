"use client";

import { useState } from "react";
import { Button, Chip, Modal, RadioButtonGroup } from "@rte-ds/react";
import { SidePanel } from "@/components/common";
import { DynamicForm } from "@/features/form-builder/DynamicForm";
import Icon from "@/lib/Icons";
import ModificationHistory from "./ModificationHistory";
import type { FormTemplate } from "@/models/FormTemplate";
import type { Declaration } from "@/models/Declaration";

interface DeclarationDetailPanelProps {
  open: boolean;
  onClose: () => void;
  selectedForm: FormTemplate | null;
  declaration: Declaration | null;
  formValues: Record<string, unknown>;
  formErrors: Record<string, string>;
  onFormValuesChange: (values: Record<string, unknown>) => void;
  isFormValid: boolean;
  onSubmit: () => void;
  onPublish?: () => void;
  showHistory: boolean;
  onToggleHistory: (show: boolean) => void;
  completionStatus: "incomplet" | "complet";
  onCompletionStatusChange: (status: "incomplet" | "complet") => void;
}

export const DeclarationDetailPanel = ({
  open,
  onClose,
  selectedForm,
  declaration,
  formValues,
  formErrors,
  onFormValuesChange,
  onSubmit,
  onPublish,
  showHistory,
  onToggleHistory,
  completionStatus,
  onCompletionStatusChange,
}: DeclarationDetailPanelProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const isNew = declaration?.isNew ?? false;
  const canPublish = !isNew && declaration?.status === "draft" && onPublish;

  if (!declaration && !selectedForm) return null;
  return (
    <SidePanel open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex flex-col gap-1 px-6 -mt-2">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex flex-col">
            <h2
              className="text-xl font-bold truncate"
              style={{ fontFamily: "Nunito, sans-serif", fontSize: "20px" }}
            >
              {selectedForm?.name || ""}
            </h2>
            <span className="text-sm text-muted-foreground">
              ID {(selectedForm?.id || "").split("-")[0].toUpperCase()}
            </span>
          </div>
          {completionStatus !== "complet" && (
            <Chip
              id="completion-status-chip"
              label="Incomplet"
              size="s"
              clickable={false}
              style={{ backgroundColor: "#f5de93", color: "#201f1f" }}
              icon="incomplete"
            />
          )}
          {declaration &&
            !showHistory &&
            declaration.history &&
            declaration.history.length > 0 && (
              <Icon
                name="listAlt"
                size={24}
                className="cursor-pointer hover:opacity-70"
                onClick={() => onToggleHistory(true)}
              />
            )}
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      {/* Body */}
      {(selectedForm || declaration) && (
        <div className="flex flex-1 min-h-0">
          {selectedForm && (
            <div className="flex-1 overflow-y-auto pt-4 px-6">
              <DynamicForm
                schema={selectedForm.schema.fields}
                values={formValues}
                onChange={onFormValuesChange}
                errors={formErrors}
              />

              {/* Completion status block */}
              <div className="bg-[#f5f5f5] rounded px-4 py-2 mt-4">
                <span
                  className="text-sm block mb-2"
                  style={{ color: "#3e3e3d", fontSize: "14px" }}
                >
                  Statut de la déclaration
                </span>
                <RadioButtonGroup
                  direction="horizontal"
                  groupName="completion-status"
                  items={["Incomplet", "Complet"]}
                  value={
                    completionStatus === "complet" ? "Complet" : "Incomplet"
                  }
                  onChange={(label: string) => {
                    onCompletionStatusChange(
                      label === "Complet" ? "complet" : "incomplet",
                    );
                  }}
                  showItemsLabel
                />
              </div>
            </div>
          )}
          {!selectedForm && declaration && (
            <div className="flex-1 p-4 text-center text-muted-foreground">
              <p className="mb-2 font-semibold">
                {declaration.formTemplate?.name || ""}
              </p>
              <p>{declaration.formTemplate?.description || ""}</p>
            </div>
          )}
          {declaration && showHistory && (
            <ModificationHistory
              entries={declaration.history || []}
              onClose={() => onToggleHistory(false)}
            />
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-2 px-6 pb-4 border-t pt-4">
        <Button
          label="Annuler"
          variant="secondary"
          size="m"
          onClick={onClose}
        />
        <Button
          label="Enregistrer"
          variant="primary"
          size="m"
          onClick={() => setShowConfirm(true)}
          disabled={Object.keys(formErrors).length > 0}
        />
        {canPublish && (
          <Button
            label="Publier"
            variant="primary"
            size="m"
            onClick={() => setShowPublishConfirm(true)}
          />
        )}
      </div>

      <Modal
        id="confirm-submit-declaration"
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title={isNew ? "Créer la déclaration" : "Modifier la déclaration"}
        size="s"
        primaryButton={
          <Button
            variant="primary"
            label="Confirmer"
            onClick={() => {
              setShowConfirm(false);
              onSubmit();
            }}
          />
        }
        secondaryButton={
          <Button
            variant="secondary"
            label="Annuler"
            onClick={() => setShowConfirm(false)}
          />
        }
      >
        <p>
          {isNew
            ? "Voulez-vous créer cette déclaration ?"
            : "Voulez-vous enregistrer les modifications de cette déclaration ?"}
        </p>
      </Modal>

      <Modal
        id="confirm-publish-declaration"
        isOpen={showPublishConfirm}
        onClose={() => setShowPublishConfirm(false)}
        title="Publier la déclaration"
        size="s"
        primaryButton={
          <Button
            variant="primary"
            label="Publier"
            onClick={() => {
              setShowPublishConfirm(false);
              onPublish?.();
            }}
          />
        }
        secondaryButton={
          <Button
            variant="secondary"
            label="Annuler"
            onClick={() => setShowPublishConfirm(false)}
          />
        }
      >
        <p>
          Voulez-vous publier cette déclaration ? Une fois publiée, elle passera
          en statut validé.
        </p>
      </Modal>
    </SidePanel>
  );
};
