"use client";

import { AnimatePresence, motion } from "motion/react";
import type {
  FieldConfig,
  FieldType,
  FieldConfiguratorProps,
  RadioFieldConfig,
  CheckboxFieldConfig,
} from "@/models/FieldTypes";
import { getField } from "../utils/registry";

import { DescriptionField } from "./common/DescriptionField";
import { Footer } from "./common/Footer";
import { LabelField } from "./common/LabelField";

import { TextConfigurator } from "./text";
import { NumberConfigurator } from "./number";
import { SelectConfigurator } from "./select";
import { RadioConfigurator } from "./radio";
import { CheckboxConfigurator } from "./checkbox";
import { SwitchConfigurator } from "./switch";
import { DateConfigurator } from "./date";
import { ImportConfigurator } from "./import";

export const FieldConfigurator = ({
  config,
  onChange,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  isOpen = true,
  onOpen,
  dragControls,
  schema,
  onBranchingCleanup,
}: FieldConfiguratorProps) => {
  // Remove isDuplicate flag when user modifies any field
  const handleChange = (newConfig: FieldConfig) => {
    if (newConfig.isDuplicate) {
      const { ...configWithoutDuplicate } = newConfig;
      onChange(configWithoutDuplicate as FieldConfig);
    } else {
      onChange(newConfig);
    }
  };

  const handleFieldTypeChange = (newType: FieldType) => {
    if (newType === config.type) return;

    // If changing away from a branching type, clean up children
    const hadBranching =
      (config.type === "radio" || config.type === "checkbox") &&
      (config as RadioFieldConfig | CheckboxFieldConfig).branchingEnabled;
    if (hadBranching && onBranchingCleanup) {
      onBranchingCleanup();
    }

    const registration = getField(newType);
    const base = {
      id: config.id,
      name: config.name,
      label: config.label,
      required: config.required,
      description: config.description,
      parentFieldId: config.parentFieldId,
      parentOptionValue: config.parentOptionValue,
      branchingColor: config.branchingColor,
      ...registration?.defaultConfig,
    };

    const defaultOptions = [
      { value: "option_1", label: "Choix 1" },
      { value: "option_2", label: "Choix 2" },
      { value: "option_3", label: "Choix 3" },
    ];

    const typeDefaults: Record<string, Partial<FieldConfig>> = {
      select: { options: [], selectionMode: "single" },
      radio: { options: defaultOptions },
      checkbox: { options: defaultOptions },
      date: { includeTime: false, defaultDateValue: "none" },
    };

    const newConfig = {
      ...base,
      type: newType,
      ...(typeDefaults[newType] ?? {}),
    } as FieldConfig;
    onChange(newConfig);
  };

  const supportsBranching = config.type === "radio" || config.type === "checkbox";

  const branchingEnabled = supportsBranching
    ? (config as RadioFieldConfig | CheckboxFieldConfig).branchingEnabled ?? false
    : false;

  const handleToggleBranching = () => {
    if (!supportsBranching) return;
    const current = config as RadioFieldConfig | CheckboxFieldConfig;
    const newEnabled = !current.branchingEnabled;
    if (!newEnabled && onBranchingCleanup) {
      onBranchingCleanup();
    }
    handleChange({
      ...config,
      branchingEnabled: newEnabled,
      ...(!newEnabled ? { branching: undefined, branchingColors: undefined } : {}),
    } as FieldConfig);
  };

  const renderSpecificConfigurator = () => {
    const typeChangeProps = { onFieldTypeChange: handleFieldTypeChange };
    switch (config.type) {
      case "text":
        return (
          <TextConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "number":
        return (
          <NumberConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "select":
        return (
          <SelectConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "radio":
        return (
          <RadioConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
            schema={schema}
          />
        );
      case "checkbox":
        return (
          <CheckboxConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
            schema={schema}
          />
        );
      case "switch":
        return (
          <SwitchConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "date":
        return (
          <DateConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "import":
        return (
          <ImportConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!isOpen ? (
        <motion.div
          key="collapsed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-full"
        >
          <LabelField
            value={config.label}
            onChange={() => {}}
            isDuplicate={config.isDuplicate}
            fieldType={config.type}
            collapsedActions={{
              onMoveUp,
              onMoveDown,
              onDuplicate,
              canMoveUp,
              canMoveDown,
            }}
            onOpen={onOpen}
          />
        </motion.div>
      ) : (
        <motion.div
          key="expanded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex w-full flex-col gap-4"
        >
          {renderSpecificConfigurator()}

          <DescriptionField
            value={config.description ?? ""}
            onChange={(description) => handleChange({ ...config, description })}
          />

          <Footer
            required={config.required ?? false}
            onRequiredChange={(required) =>
              handleChange({ ...config, required })
            }
            onDuplicate={onDuplicate}
            onRemove={onRemove}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            dragControls={dragControls}
            showBranchingButton={supportsBranching}
            onBranching={handleToggleBranching}
            branchingEnabled={branchingEnabled}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FieldConfigurator;
