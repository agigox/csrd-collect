"use client";

import { useState, useEffect } from "react";
import type { SelectFieldConfig, SelectOption } from "@/models/FieldTypes";
import type { SpecificConfiguratorProps } from "@/lib/types/field";
import { LabelField } from "../common/LabelField";
import { DefaultValueSelector } from "../common/DefaultValueSelector";
import { SegmentedControl, Select } from "@rte-ds/react";
import { fetchOptions as fetchOptionsApi } from "@/api/options";

// Type pour la structure des options dans db.json
interface DataSourceItem {
  key: string;
  label: string;
  items: SelectOption[];
}

interface DataTypeOption {
  label: string;
  data: DataSourceItem[];
}

interface OptionsData {
  [key: string]: DataTypeOption;
}

export const SelectConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
  fieldIdentifier,
}: SpecificConfiguratorProps<SelectFieldConfig>) => {
  const [optionsData, setOptionsData] = useState<OptionsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les options depuis l'API au montage
  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchOptionsApi<OptionsData>();
        setOptionsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // Obtenir les types de données disponibles
  const dataTypeOptions = optionsData
    ? Object.entries(optionsData).map(([key, value]) => ({
        value: key,
        label: value.label,
      }))
    : [];

  // Obtenir les sources de données disponibles pour le type sélectionné
  const dataSourceOptions =
    optionsData && config.dataType && optionsData[config.dataType]
      ? optionsData[config.dataType].data.map((item) => ({
          value: item.key,
          label: item.label,
        }))
      : [];

  // Gérer le changement de type de données
  const handleDataTypeChange = (value: string) => {
    onChange({
      ...config,
      dataType: value,
      dataSource: undefined,
      options: [],
      defaultIndex: 0,
    });
  };

  // Gérer le changement de source de données
  const handleDataSourceChange = (value: string) => {
    if (optionsData && config.dataType) {
      const dataType = optionsData[config.dataType];
      const dataSource = dataType?.data.find((d) => d.key === value);
      const items = dataSource?.items ?? [];

      onChange({
        ...config,
        dataSource: value,
        options: items,
        defaultIndex: undefined,
        defaultIndices: undefined,
      });
    }
  };

  const selectionMode = config.selectionMode ?? "single";
  const options = config.options ?? [];

  // Vérifier si une valeur par défaut est définie
  const hasDefaultValue =
    selectionMode === "single"
      ? config.defaultIndex !== undefined
      : config.defaultIndices !== undefined;

  // Gérer le toggle du checkbox "Définir une valeur par défaut"
  const handleToggleDefaultValue = () => {
    if (hasDefaultValue) {
      // Désactiver la valeur par défaut
      onChange({
        ...config,
        defaultIndex: undefined,
        defaultIndices: undefined,
      });
    } else {
      // Activer avec la première option par défaut
      if (selectionMode === "single") {
        onChange({
          ...config,
          defaultIndex: options.length > 0 ? 0 : undefined,
        });
      } else {
        onChange({ ...config, defaultIndices: [] });
      }
    }
  };

  // Gérer le changement de valeur par défaut (single)
  const handleDefaultSingleChange = (value: string) => {
    const index = options.findIndex((o) => o.value === value);
    onChange({ ...config, defaultIndex: index >= 0 ? index : undefined });
  };

  // Gérer le changement de valeurs par défaut (multiple)
  const handleDefaultMultipleChange = (values: string[]) => {
    const indices = values
      .map((v) => options.findIndex((o) => o.value === v))
      .filter((i) => i >= 0);
    onChange({ ...config, defaultIndices: indices });
  };

  // Obtenir la valeur actuelle pour le select single
  const currentDefaultSingleValue =
    config.defaultIndex !== undefined && options[config.defaultIndex]
      ? options[config.defaultIndex].value
      : "";

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
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
        fieldIdentifier={fieldIdentifier}
      />

      {/* Chargement ou erreur */}
      {isLoading && (
        <div className="text-sm text-gray-500">Chargement des options...</div>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}
      {/* Mode de sélection */}
      <div className="w-64.5">
        <SegmentedControl
          onChange={(id) =>
            onChange({ ...config, selectionMode: id as "single" | "multiple" })
          }
          options={[
            { id: "single", label: "Choix unique" },
            { id: "multiple", label: "Choix multiple" },
          ]}
          selectedSegment={selectionMode}
          size="s"
        />
      </div>

      {/* Type de donnée et Source de donnée */}
      {!isLoading && !error && (
        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-1">
            <Select
              id="select1"
              label="Type de donnée"
              onChange={handleDataTypeChange}
              options={dataTypeOptions}
              showResetButton={true}
              width={188}
            />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <Select
              id="select2"
              label="Source de donnée"
              onChange={handleDataSourceChange}
              options={dataSourceOptions}
              disabled={!config.dataType}
              showResetButton={true}
              width={188}
            />
          </div>
        </div>
      )}

      {/* Définir une valeur par défaut */}
      <DefaultValueSelector
        mode={selectionMode}
        options={options}
        hasDefaultValue={hasDefaultValue}
        onToggle={handleToggleDefaultValue}
        currentSingleValue={currentDefaultSingleValue}
        currentMultipleValues={currentDefaultMultipleValues}
        onSingleChange={handleDefaultSingleChange}
        onMultipleChange={handleDefaultMultipleChange}
        id="select-config"
        disabled={!config.dataType}
      />
    </div>
  );
};

export default SelectConfigurator;
