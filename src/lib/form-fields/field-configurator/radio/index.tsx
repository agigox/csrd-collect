"use client";

import { useState } from "react";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import Icon from "@/lib/Icons";
import type { RadioFieldConfig, SelectOption } from "../../types";
import type { SpecificConfiguratorProps } from "../types";

export const RadioConfigurator = ({
  config,
  onChange,
}: SpecificConfiguratorProps<RadioFieldConfig>) => {
  const [showDefaultSelector, setShowDefaultSelector] = useState(
    config.defaultIndex !== undefined
  );

  const handleOptionChange = (
    index: number,
    field: keyof SelectOption,
    value: string
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

    // If removing the default option, clear the default
    let newDefaultIndex = config.defaultIndex;
    if (config.defaultIndex !== undefined) {
      if (config.defaultIndex === index) {
        newDefaultIndex = undefined;
      } else if (config.defaultIndex > index) {
        newDefaultIndex = config.defaultIndex - 1;
      }
    }

    newOptions.splice(index, 1);
    onChange({ ...config, options: newOptions, defaultIndex: newDefaultIndex });
  };

  const handleToggleDefaultSelector = () => {
    if (showDefaultSelector) {
      setShowDefaultSelector(false);
      onChange({ ...config, defaultIndex: undefined });
    } else {
      setShowDefaultSelector(true);
    }
  };

  const handleSetDefaultIndex = (index: number) => {
    onChange({ ...config, defaultIndex: index });
  };

  const options = config.options ?? [];

  return (
    <div className="flex flex-col gap-3">
      {options.map((option, index) => {
        const isLast = index === options.length - 1;
        const isDefault = showDefaultSelector && config.defaultIndex === index;
        return (
          <div key={index} className="flex flex-col gap-1">
            <Label>Choix {index + 1}</Label>
            <div className="flex gap-2 items-center">
              {/* Radio button - cliquable si mode sélection défaut actif */}
              <button
                type="button"
                onClick={() => showDefaultSelector && handleSetDefaultIndex(index)}
                disabled={!showDefaultSelector}
                className={`flex items-center justify-center size-5 border-2 bg-white rounded-full transition-colors ${
                  isDefault
                    ? "border-[#2964a0]"
                    : showDefaultSelector
                    ? "border-gray-300 hover:border-[#2964a0] cursor-pointer"
                    : "border-gray-300 cursor-default"
                }`}
                title={showDefaultSelector ? "Définir comme valeur par défaut" : undefined}
              >
                {isDefault && (
                  <span className="size-[10px] rounded-full bg-[#2964a0]" />
                )}
              </button>
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

      {/* Checkbox pour activer la sélection d'une valeur par défaut */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleDefaultSelector}
            className={`flex items-center justify-center size-5 border-2 bg-white transition-colors rounded ${
              showDefaultSelector
                ? "border-[#2964a0]"
                : "border-gray-300 hover:border-[#2964a0]"
            }`}
          >
            {showDefaultSelector && (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path
                  d="M1 5L4 8L11 1"
                  stroke="#2964a0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <Label
            className="text-sm cursor-pointer text-[#2964a0]"
            onClick={handleToggleDefaultSelector}
          >
            Définir une valeur par défaut
          </Label>
        </div>

        {/* Message d'aide quand le mode sélection est actif */}
        {showDefaultSelector && (
          <p className="text-xs text-gray-500 ml-8">
            Cliquez sur un bouton radio ci-dessus pour définir la valeur par défaut
          </p>
        )}
      </div>
    </div>
  );
};

export default RadioConfigurator;
