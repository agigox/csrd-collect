"use client";

import { Button } from "@/lib/components/ui/button";
import Icon from "@/lib/Icons";
import { getAllFieldTypes } from "./registry";
import { FieldConfigurator } from "./FieldConfigurator";
import type { FieldConfig, FieldType } from "./types";

interface FormBuilderProps {
  schema: FieldConfig[];
  onChange: (schema: FieldConfig[]) => void;
}

const fieldTypeLabels: Record<FieldType, string> = {
  text: "Texte",
  number: "Nombre",
  select: "Sélection",
};

export const FormBuilder = ({ schema, onChange }: FormBuilderProps) => {
  const fieldTypes = getAllFieldTypes();

  const generateFieldName = (type: FieldType) => {
    const existingNames = schema.map((f) => f.name);
    let counter = 1;
    let name = `${type}_${counter}`;
    while (existingNames.includes(name)) {
      counter++;
      name = `${type}_${counter}`;
    }
    return name;
  };

  const handleAddField = (type: FieldType) => {
    const fieldName = generateFieldName(type);
    let newField: FieldConfig;

    if (type === "select") {
      newField = {
        name: fieldName,
        type: "select",
        label: "Nouveau champ",
        placeholder: "Sélectionner...",
        options: [{ value: "option1", label: "Option 1" }],
      };
    } else if (type === "number") {
      newField = {
        name: fieldName,
        type: "number",
        label: "Nouveau champ",
      };
    } else {
      newField = {
        name: fieldName,
        type: "text",
        label: "Nouveau champ",
        placeholder: "",
      };
    }

    onChange([...schema, newField]);
  };

  const handleUpdateField = (index: number, config: FieldConfig) => {
    const newSchema = [...schema];
    newSchema[index] = config;
    onChange(newSchema);
  };

  const handleRemoveField = (index: number) => {
    onChange(schema.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-content-muted mr-2 self-center">
          Ajouter un champ :
        </span>
        {fieldTypes.map((type) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => handleAddField(type)}
          >
            <Icon name="plus" />
            {fieldTypeLabels[type] ?? type}
          </Button>
        ))}
      </div>

      {schema.length === 0 ? (
        <div className="text-center py-8 text-content-muted border border-dashed border-border-default rounded-lg">
          Aucun champ. Utilisez les boutons ci-dessus pour ajouter des champs.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {schema.map((fieldConfig, index) => (
            <FieldConfigurator
              key={`${fieldConfig.name}-${index}`}
              config={fieldConfig}
              onChange={(config) => handleUpdateField(index, config)}
              onRemove={() => handleRemoveField(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
