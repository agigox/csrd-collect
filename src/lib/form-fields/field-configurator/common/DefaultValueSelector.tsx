"use client";

import { Checkbox, Select } from "@rte-ds/react";
import { MultiSelect } from "@/lib/ui/multi-select";
import type { SelectOption } from "../../types";

export type SelectionMode = "single" | "multiple";

interface DefaultValueSelectorProps {
  /** Mode de sélection: unique ou multiple */
  mode: SelectionMode;
  /** Options disponibles pour la sélection */
  options: SelectOption[];
  /** Indique si une valeur par défaut est définie */
  hasDefaultValue: boolean;
  /** Callback appelé lors du toggle du checkbox */
  onToggle: () => void;
  /** Valeur actuelle (string pour single, string[] pour multiple) */
  currentSingleValue?: string;
  currentMultipleValues?: string[];
  /** Callback appelé lors du changement de valeur */
  onSingleChange?: (value: string) => void;
  onMultipleChange?: (values: string[]) => void;
  /** ID unique pour les éléments */
  id: string;
  /** Désactiver le select */
  disabled?: boolean;
}

export const DefaultValueSelector = ({
  mode,
  options,
  hasDefaultValue,
  onToggle,
  currentSingleValue = "",
  currentMultipleValues = [],
  onSingleChange,
  onMultipleChange,
  id,
  disabled = false,
}: DefaultValueSelectorProps) => {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {!hasDefaultValue ? (
        <Checkbox
          id={`${id}-checkbox-default-value`}
          label="Définir une valeur par défaut"
          showLabel
          onChange={onToggle}
        />
      ) : (
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${id}-checkbox-default-value-checked`}
            label="Définir une valeur par défaut"
            showLabel={false}
            onChange={onToggle}
            checked
          />
          {mode === "single" ? (
            <Select
              value={currentSingleValue}
              id={`${id}-select-default-value`}
              label="Valeur par défaut"
              showLabel={false}
              onChange={onSingleChange ?? (() => {})}
              options={options}
              disabled={disabled}
              showResetButton={true}
              width={260}
            />
          ) : (
            <MultiSelect
              options={options}
              value={currentMultipleValues}
              onChange={onMultipleChange ?? (() => {})}
              placeholder="Sélectionner des valeurs par défaut..."
              className="flex-1"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DefaultValueSelector;
