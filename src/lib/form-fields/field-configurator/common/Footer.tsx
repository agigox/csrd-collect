"use client";

import { useState } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
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
  dragHandleAttributes?: DraggableAttributes;
  dragHandleListeners?: SyntheticListenerMap;
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
  dragHandleAttributes,
  dragHandleListeners,
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
          {/* Required toggle */}
          {/*<div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={required}
              onClick={() => onRequiredChange(!required)}
              className={`relative flex items-center h-6 w-10 rounded-full px-1 transition-colors duration-200 ${
                required
                  ? "bg-[#2964a0] justify-end"
                  : "bg-[#e1e1e0] border-2 border-[#737272] justify-start"
              }`}
            >
              <span
                className={`flex items-center justify-center size-4 rounded-full transition-all duration-200 ${
                  required ? "bg-white" : "bg-white shadow-sm"
                }`}
              >
                {required && (
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="#2964a0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </button>
            <Label
              className="text-sm cursor-pointer"
              onClick={() => onRequiredChange(!required)}
            >
              Champ obligatoire
            </Label>
          </div>*/}
          <Switch
            appearance="brand"
            label="Champ obligatoire"
            onChange={() => onRequiredChange(!required)}
            showIcon
            showLabel
          />
          <div className="flex gap-1">
            {/* Drag handle */}
            {dragHandleAttributes && dragHandleListeners && (
              <div
                {...dragHandleAttributes}
                {...dragHandleListeners}
                className="cursor-grab active:cursor-grabbing"
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
              {/* Embranchement button */}
              <div className="flex gap-1">
                <IconButton
                  appearance="outlined"
                  aria-label="icon button aria label"
                  name="alt-route"
                  onClick={onMoveDown}
                  size="m"
                  variant="transparent"
                />
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
