import type { FieldConfig } from "@/models/FieldTypes";
import { Card } from "@rte-ds/react";
import { FieldConfigurator } from ".";
import { Reorder, useDragControls } from "motion/react";
import { BranchingTag } from "./common/BranchingTag";

// Sortable Field Card component
interface SortableFieldCardProps {
  fieldConfig: FieldConfig;
  index: number;
  totalFields: number;
  isOpen: boolean;
  onOpen: () => void;
  onUpdate: (config: FieldConfig) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  schema?: FieldConfig[];
  onBranchingCleanup?: () => void;
  isChildField?: boolean;
  branchingColor?: string;
  branchingNumber?: number;
}

export const SortableFieldCard = ({
  fieldConfig,
  index,
  totalFields,
  isOpen,
  onOpen,
  onUpdate,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  schema,
  onBranchingCleanup,
  isChildField = false,
  branchingColor,
  branchingNumber,
}: SortableFieldCardProps) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={fieldConfig}
      dragListener={false}
      dragControls={isChildField ? undefined : dragControls}
      layout
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 30,
      }}
      whileDrag={
        isChildField
          ? undefined
          : {
              scale: 1.02,
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
              zIndex: 1000,
            }
      }
      style={{
        position: "relative",
        marginLeft: isChildField ? "24px" : undefined,
      }}
    >
      {isChildField && branchingColor && branchingNumber !== undefined && (
        <BranchingTag
          branchingColor={branchingColor}
          branchingNumber={branchingNumber}
        />
      )}
      <Card
        className="py-4 px-4"
        cardType="default"
        style={{
          borderTop: isOpen
            ? "4px solid var(--background-brand-default)"
            : undefined,
          borderLeft: isChildField && branchingColor
            ? `3px solid ${branchingColor}`
            : undefined,
          backgroundColor: "white",
        }}
        size="full"
      >
        <FieldConfigurator
          config={fieldConfig}
          onChange={onUpdate}
          onRemove={onRemove}
          onDuplicate={onDuplicate}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          canMoveUp={index > 0}
          canMoveDown={index < totalFields - 1}
          isOpen={isOpen}
          onOpen={onOpen}
          dragControls={isChildField ? undefined : dragControls}
          schema={schema}
          onBranchingCleanup={onBranchingCleanup}
        />
      </Card>
    </Reorder.Item>
  );
};
