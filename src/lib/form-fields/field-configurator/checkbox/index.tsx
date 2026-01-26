"use client";

import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { MultiSelect } from "@/lib/ui/multi-select";
import Icon from "@/lib/Icons";
import type { CheckboxFieldConfig, SelectOption } from "../../types";
import type { SpecificConfiguratorProps } from "../types";
import { LabelField } from "../common/LabelField";

export const CheckboxConfigurator = ({
  config,
  onChange,
}: SpecificConfiguratorProps<CheckboxFieldConfig>) => {
  const handleOptionChange = (
    index: number,
    field: keyof SelectOption,
    value: string,
  ) => {
    const newOptions = [...(config.options ?? [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange({ ...config, options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...(config.options ?? [])];
    const newIndex = newOptions.length + 1;
    newOptions.push({
      value: `option_${newIndex}`,
      label: `Choix ${newIndex}`,
    });
    onChange({ ...config, options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...(config.options ?? [])];
    if (newOptions.length <= 1) return; // Keep at least one option

    // If removing a default option, update defaultIndices
    const currentDefaults = config.defaultIndices ?? [];
    const newDefaults = currentDefaults
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));

    newOptions.splice(index, 1);
    onChange({ ...config, options: newOptions, defaultIndices: newDefaults });
  };

  const options = config.options ?? [];
  const hasDefaultValue = config.defaultIndices !== undefined;

  // Gérer le toggle du checkbox "Définir une valeur par défaut"
  const handleToggleDefaultValue = () => {
    if (hasDefaultValue) {
      onChange({ ...config, defaultIndices: undefined });
    } else {
      onChange({ ...config, defaultIndices: [] });
    }
  };

  // Gérer le changement de valeurs par défaut (multiple)
  const handleDefaultMultipleChange = (values: string[]) => {
    const indices = values
      .map((v) => options.findIndex((o) => o.value === v))
      .filter((i) => i >= 0);
    onChange({ ...config, defaultIndices: indices });
  };

  // Obtenir les valeurs actuelles pour le multi-select
  const currentDefaultMultipleValues = (config.defaultIndices ?? [])
    .filter((i) => options[i])
    .map((i) => options[i].value);

  return (
    <div className="flex flex-col gap-3">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        isDuplicate={config.isDuplicate}
      />
      {options.map((option, index) => {
        const isLast = index === options.length - 1;
        return (
          <div key={index} className="flex flex-col gap-1">
            <Label>Choix {index + 1}</Label>
            <div className="flex gap-2 items-center">
              <span className="flex items-center justify-center size-5 border-2 bg-white rounded border-gray-300" />
              <Input
                value={option.label}
                onChange={(e) =>
                  handleOptionChange(index, "label", e.target.value)
                }
                className="flex-1 h-8 text-sm"
              />
              {isLast ? (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center justify-center size-8 bg-[#2964a0] hover:bg-[#234f7a] text-white rounded transition-colors"
                  title="Ajouter une option"
                >
                  <Icon name="plus" size={16} color="white" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="flex items-center justify-center size-8 text-gray-500 hover:text-red-500 transition-colors"
                  title="Supprimer cette option"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Définir une valeur par défaut */}
      {options.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {!hasDefaultValue ? (
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                role="checkbox"
                aria-checked={false}
                onClick={handleToggleDefaultValue}
                className="flex items-center justify-center size-4 rounded border-2 border-[#737272] bg-white hover:border-[#225082] transition-colors"
              />
              <span className="text-sm">Définir des valeurs par défaut</span>
            </label>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="checkbox"
                aria-checked={true}
                onClick={handleToggleDefaultValue}
                className="flex items-center justify-center size-4 rounded border-2 border-[#2964a0] bg-[#2964a0] transition-colors shrink-0"
              >
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <MultiSelect
                options={options}
                value={currentDefaultMultipleValues}
                onChange={handleDefaultMultipleChange}
                placeholder="Sélectionner des valeurs par défaut..."
                className="flex-1"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckboxConfigurator;
