import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { FieldConfig, FieldType } from "../types";

export interface FieldConfiguratorProps {
  config: FieldConfig;
  onChange: (config: FieldConfig) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isOpen?: boolean;
  onOpen?: () => void;
  dragHandleAttributes?: DraggableAttributes;
  dragHandleListeners?: SyntheticListenerMap;
}

export interface SpecificConfiguratorProps<
  T extends FieldConfig = FieldConfig,
> {
  config: T;
  onChange: (config: T) => void;
  onFieldTypeChange?: (type: FieldType) => void;
}

export const typeLabels: Record<string, string> = {
  text: "Champ libre",
  number: "Nombre",
  select: "Liste déroulante",
  radio: "Choix unique",
  checkbox: "Choix multiple",
  unit: "Nombre", // Deprecated: redirige vers Nombre
  switch: "Switch",
  date: "Date",
  import: "Import de fichier",
};

export const typeIcons: Record<string, string> = {
  text: "chat",
  number: "chat",
  select: "list-alt",
  radio: "check-circle",
  checkbox: "checkbox",
  switch: "share",
  date: "calendar-today",
  import: "upload",
};
