"use client";

import { Checkbox, Select } from "@rte-ds/react";
import type { ImportFieldConfig } from "@/models/FieldTypes";
import type { SpecificConfiguratorProps } from "@/lib/types/field";
import { LabelField } from "../common/LabelField";

const formatOptions = [
  { value: ".docx", label: ".DOCX" },
  { value: ".xls", label: ".XLS" },
  { value: ".pdf", label: ".PDF" },
  { value: ".svg", label: ".SVG" },
  { value: ".png", label: ".PNG" },
  { value: ".jpg", label: ".JPG" },
];

const maxFileSizeOptions = [
  { value: "", label: "Aucune limite" },
  { value: "5", label: "5 Mo" },
  { value: "10", label: "10 Mo" },
  { value: "15", label: "15 Mo" },
  { value: "20", label: "20 Mo" },
];

export const ImportConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
  fieldIdentifier,
}: SpecificConfiguratorProps<ImportFieldConfig>) => {
  const currentFormats = config.acceptedFormats ?? [];

  const handleFormatToggle = (format: string) => {
    if (currentFormats.includes(format)) {
      onChange({
        ...config,
        acceptedFormats: currentFormats.filter((f) => f !== format),
      });
    } else {
      onChange({
        ...config,
        acceptedFormats: [...currentFormats, format],
      });
    }
  };

  const handleMaxFileSizeChange = (value: string) => {
    onChange({
      ...config,
      maxFileSize: value ? Number(value) : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        isDuplicate={config.isDuplicate}
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
        fieldIdentifier={fieldIdentifier}
      />

      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-[#3e3e3d]">Formats acceptés</span>
          <div className="flex flex-wrap gap-2 w-82">
            {formatOptions.map((option) => (
              <div key={option.value} className="w-26">
                <Checkbox
                  id={`format-${option.value}`}
                  label={option.label}
                  showLabel
                  checked={currentFormats.includes(option.value)}
                  onChange={() => handleFormatToggle(option.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <Select
          id="max-file-size"
          label="Poid maximal (Mo)"
          showLabel
          options={maxFileSizeOptions}
          value={config.maxFileSize?.toString() ?? ""}
          onChange={handleMaxFileSizeChange}
          width={188}
        />
      </div>
    </div>
  );
};

export default ImportConfigurator;
