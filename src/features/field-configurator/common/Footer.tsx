"use client";

import { useState } from "react";
import type { DragControls } from "motion/react";
import { Button, Divider, IconButton, Modal, Switch } from "@rte-ds/react";

interface FooterProps {
  required: boolean;
  onRequiredChange: (required: boolean) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  dragControls?: DragControls;
  showBranchingButton?: boolean;
  onBranching?: () => void;
  branchingEnabled?: boolean;
  requiredDisabled?: boolean;
  onDetach?: () => void;
  showDetachButton?: boolean;
  isDetachingParent?: boolean;
  detachParentLabel?: string;
  detachChildCount?: number;
}

export const Footer = ({
  required,
  onRequiredChange,
  onDuplicate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  dragControls,
  showBranchingButton = false,
  onBranching,
  branchingEnabled = false,
  requiredDisabled = false,
  onDetach,
  showDetachButton = false,
  isDetachingParent = false,
  detachParentLabel,
  detachChildCount,
}: FooterProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetachConfirm, setShowDetachConfirm] = useState(false);

  const handleConfirmDelete = () => {
    onRemove();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="flex flex-col">
        <Divider
          appearance="default"
          endPoint="square"
          orientation="horizontal"
          thickness="medium"
        />
        <div className="flex justify-between items-center h-10 pt-4">
          <Switch
            appearance="brand"
            label="Champ obligatoire"
            onChange={() => onRequiredChange(!required)}
            checked={required || requiredDisabled}
            showIcon
            showLabel
            disabled={requiredDisabled}
          />
          <div className="flex gap-1">
            {/* Drag handle */}
            {dragControls && (
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="cursor-grab active:cursor-grabbing touch-none"
              >
                <IconButton
                  appearance="outlined"
                  aria-label="Glisser pour réorganiser"
                  name="drag-indicator"
                  size="m"
                  variant="transparent"
                  disabled={!canMoveUp && !canMoveDown}
                />
              </div>
            )}

            {/* Move up/down buttons */}
            {onMoveUp && onMoveDown && (
              <IconButton
                appearance="outlined"
                aria-label="icon button aria label"
                name="arrow-up"
                onClick={onMoveUp}
                size="m"
                variant="transparent"
                disabled={!canMoveUp}
              />
            )}
            {onMoveUp && onMoveDown && (
              <IconButton
                appearance="outlined"
                aria-label="icon button aria label"
                name="arrow-down"
                onClick={onMoveDown}
                size="m"
                variant="transparent"
                disabled={!canMoveDown}
              />
            )}
          </div>
          {/* Action icons */}
          <div className="flex items-center gap-2">
            <div className="flex gap-8">
              <div className="flex gap-1">
                {showDetachButton && (
                  <IconButton
                    appearance="outlined"
                    aria-label="Détacher ce champ"
                    name="detach"
                    onClick={() => setShowDetachConfirm(true)}
                    size="m"
                    variant="transparent"
                  />
                )}
                {showBranchingButton && (
                  <IconButton
                    appearance="outlined"
                    aria-label="Embranchement conditionnel"
                    name="branch"
                    onClick={onBranching}
                    size="m"
                    variant={branchingEnabled ? "primary" : "transparent"}
                  />
                )}
                {/* Duplicate button */}

                <IconButton
                  appearance="outlined"
                  aria-label="icon button aria label"
                  name="copy"
                  onClick={onDuplicate}
                  size="m"
                  variant="transparent"
                />
              </div>

              {/* Delete button */}
              <IconButton
                appearance="outlined"
                aria-label="icon button aria label"
                name="delete"
                onClick={() => setShowDeleteConfirm(true)}
                size="m"
                iconColor="var(--background-danger-default)"
                variant="transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        id="delete-field-confirm"
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Supprimer ce champ ?"
        icon="delete"
        description="Cette action est irréversible. Le champ sera définitivement supprimé."
        size="xs"
        primaryButton={
          <Button variant="danger" label="Confirmer" onClick={handleConfirmDelete} />
        }
        secondaryButton={
          <Button variant="neutral" label="Annuler" onClick={() => setShowDeleteConfirm(false)} />
        }
      />

      <Modal
        id="detach-field-confirm"
        isOpen={showDetachConfirm}
        onClose={() => setShowDetachConfirm(false)}
        title={
          isDetachingParent
            ? "Détacher ce champ de ses enfants ?"
            : "Détacher ce champ ?"
        }
        icon="detach"
        description={
          isDetachingParent
            ? `Ce champ sera détaché de ses ${detachChildCount} sous-champ(s). Les sous-champs deviendront indépendants.`
            : `Ce champ deviendra indépendant et ne sera plus conditionné par «\u00A0${detachParentLabel}\u00A0».`
        }
        size="xs"
        primaryButton={
          <Button
            variant="primary"
            label="Confirmer"
            onClick={() => {
              onDetach?.();
              setShowDetachConfirm(false);
            }}
          />
        }
        secondaryButton={
          <Button variant="neutral" label="Annuler" onClick={() => setShowDetachConfirm(false)} />
        }
      />
    </>
  );
};

export default Footer;
