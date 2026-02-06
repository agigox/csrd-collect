"use client";

import { useRef } from "react";
import { Label } from "@/lib/ui/label";
import { Button } from "@/lib/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import Icon from "@/lib/Icons";
import type {
  FieldProps,
  FieldRegistration,
  ImportFieldConfig,
} from "@/models/FieldTypes";
import { IconButton } from "@rte-ds/react";

interface FileValue {
  name: string;
  size: number;
  type: string;
}

const ImportField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<ImportFieldConfig>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileValue = value as FileValue | undefined;

  const acceptedFormats = config.acceptedFormats?.length
    ? config.acceptedFormats.join(",")
    : undefined;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (config.maxFileSize && file.size > config.maxFileSize * 1024 * 1024) {
        return;
      }
      onChange({
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  const handleRemoveFile = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const labelContent = (
    <Label htmlFor={config.name}>
      {config.label}
      {config.required && <span className="text-red-500 ml-1">*</span>}
    </Label>
  );

  return (
    <div className="flex flex-col gap-2">
      {config.description ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="w-fit cursor-help">{labelContent}</span>
          </TooltipTrigger>
          <TooltipContent>{config.description}</TooltipContent>
        </Tooltip>
      ) : (
        labelContent
      )}

      <input
        ref={fileInputRef}
        id={config.name}
        name={config.name}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileSelect}
        className="hidden"
        aria-invalid={!!error}
      />

      {fileValue ? (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
          <Icon name="file" size={20} className="text-gray-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileValue.name}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(fileValue.size)}
            </p>
          </div>

          {!readOnly && (
            <IconButton
              appearance="outlined"
              aria-label="icon button aria label"
              name="delete"
              onClick={handleRemoveFile}
              size="m"
              variant="danger"
            />
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => !readOnly && fileInputRef.current?.click()}
          disabled={readOnly}
          className={`w-full h-20 border-dashed ${error ? "border-red-500" : ""}`}
        >
          <div className="flex flex-col items-center gap-1">
            <Icon name="upload" size={24} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {readOnly ? "Aucun fichier importé" : "Cliquez pour importer un fichier"}
            </span>
            {!readOnly && config.maxFileSize && (
              <span className="text-xs text-gray-400">
                Max: {config.maxFileSize} Mo
              </span>
            )}
          </div>
        </Button>
      )}

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "import",
  component: ImportField,
  defaultConfig: {},
};

export default ImportField;
