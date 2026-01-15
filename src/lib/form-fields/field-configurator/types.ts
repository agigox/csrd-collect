import type { FieldConfig } from "../types";

export interface FieldConfiguratorProps {
  config: FieldConfig;
  onChange: (config: FieldConfig) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export interface SpecificConfiguratorProps<
  T extends FieldConfig = FieldConfig
> {
  config: T;
  onChange: (config: T) => void;
}

export const typeLabels: Record<string, string> = {
  text: "Champ libre",
  number: "Nombre",
  select: "Liste déroulante",
  radio: "Choix unique",
  checkbox: "Case à cocher",
  unit: "Quantité avec unité",
  switch: "Interrupteur",
  date: "Date",
};
