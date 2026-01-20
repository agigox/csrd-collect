"use client";

import { useState } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import Icon from "@/lib/Icons";
import { typeLabels } from "../types";
import type { FieldType } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/lib/ui/dialog";
import { Button } from "@/lib/ui/button";

interface HeaderProps {
  type: FieldType;
  onDuplicate: () => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isDuplicate?: boolean;
  dragHandleAttributes?: DraggableAttributes;
  dragHandleListeners?: SyntheticListenerMap;
}

export const Header = ({
  type,
  onDuplicate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  isDuplicate = false,
  dragHandleAttributes,
  dragHandleListeners,
}: HeaderProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleConfirmDelete = () => {
    onRemove();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        className="flex justify-between items-center h-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-base">
            {typeLabels[type]}
            {isDuplicate && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                (copie)
              </span>
            )}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          {dragHandleAttributes && dragHandleListeners && (
            <button
              type="button"
              className={`p-1 rounded transition-colors cursor-grab active:cursor-grabbing hover:bg-gray-100 text-gray-400 hover:text-gray-600 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              title="Glisser pour réorganiser"
              {...dragHandleAttributes}
              {...dragHandleListeners}
            >
              <Icon name="gripVertical" size={16} />
            </button>
          )}
          {isHovered && onMoveUp && onMoveDown && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className={`p-1 rounded transition-colors ${
                  canMoveUp
                    ? "hover:bg-gray-100 text-gray-600"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                title="Déplacer vers le haut"
              >
                <Icon name="chevronUp" size={16} />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className={`p-1 rounded transition-colors ${
                  canMoveDown
                    ? "hover:bg-gray-100 text-gray-600"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                title="Déplacer vers le bas"
              >
                <Icon name="chevronDown" size={16} />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={onDuplicate}
            className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
            title="Dupliquer ce champ"
          >
            <Icon
              name="duplicate"
              height={20}
              width={17}
              color="var(--primary)"
            />
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
            title="Supprimer ce champ"
          >
            <Icon name="trash" color="#ED1C1C" />
          </button>
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

export default Header;
