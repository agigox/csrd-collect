import type { ReactNode } from "react";
import type { FieldConfig } from "@/models/FieldTypes";
import { Card, Icon } from "@rte-ds/react";
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
  fieldIdentifier?: string;
  depth?: number;
  onDetach?: () => void;
  insertBefore?: ReactNode;
  insertAfter?: ReactNode;
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
  fieldIdentifier,
  depth = 0,
  onDetach,
  insertBefore,
  insertAfter,
}: SortableFieldCardProps) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={fieldConfig}
      className="flex flex-col gap-4"
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
        marginLeft: isChildField && !isOpen ? `${depth * 8}px` : undefined,
        marginRight: isChildField && !isOpen ? `${depth * 8}px` : undefined,
      }}
    >
      {insertBefore}
      <div className="flex flex-col gap-1.5">
      {(fieldConfig.isDuplicate ||
        (isOpen &&
          isChildField &&
          branchingColor &&
          branchingNumber !== undefined)) && (
        <div className="flex items-center gap-2">
          {isOpen &&
            isChildField &&
            branchingColor &&
            branchingNumber !== undefined && (
              <BranchingTag
                branchingColor={branchingColor}
                branchingNumber={branchingNumber}
              />
            )}
          {fieldConfig.isDuplicate && (
            <div className="flex items-center gap-1 px-2 h-5 rounded-lg text-xs text-black w-fit bg-[#F5DE93]">
              <Icon name="copy" size={14} color="black" />
              <span>Dupliqué</span>
            </div>
          )}
        </div>
      )}
      <Card
        className="py-4 px-4"
        cardType="default"
        style={{
          borderLeft:
            isOpen && isChildField
              ? "4px solid rgba(57, 126, 190, 0.6)"
              : isOpen
                ? "4px solid var(--background-brand-default)"
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
          isChildField={isChildField}
          branchingColor={branchingColor}
          branchingNumber={branchingNumber}
          fieldIdentifier={fieldIdentifier}
          onDetach={onDetach}
        />
      </Card>
      </div>
      {insertAfter}
    </Reorder.Item>
  );
};
