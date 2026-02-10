"use client";

import { Checkbox, Select } from "@rte-ds/react";
import type { SelectOption } from "@/models/FieldTypes";

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
            <Select
              id={`${id}-select-default-value-multiple`}
              label="Valeurs par défaut"
              showLabel={false}
              multiple={true}
              multipleValue={currentMultipleValues}
              onMultipleChange={onMultipleChange ?? (() => {})}
              options={options}
              disabled={disabled}
              showResetButton={true}
              width={260}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DefaultValueSelector;
