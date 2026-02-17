"use client";

import { useState } from "react";
import type { DragControls } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/lib/ui/dialog";
import { Button } from "@/lib/ui/button";
import { Divider, IconButton, Switch } from "@rte-ds/react";

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
}: FooterProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
                {/* TODO: Detach button */}
                {/*<IconButton
                  appearance="outlined"
                  aria-label="Detachement"
                  name="detach"
                  onClick={onDetach}
                  size="m"
                  variant="transparent"
                />*/}
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

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer ce champ ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Cette action est irréversible. Le champ sera définitivement
            supprimé.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
