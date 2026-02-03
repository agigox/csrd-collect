import type { FieldConfig } from "./types";
import { Card } from "@rte-ds/react";
import { FieldConfigurator } from "./field-configurator";
import { Reorder, useDragControls } from "motion/react";

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
}: SortableFieldCardProps) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={fieldConfig}
      dragListener={false}
      dragControls={dragControls}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 30,
      }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
      }}
      style={{
        position: "relative",
      }}
    >
      <Card
        className="py-4 px-4"
        cardType="outlined"
        style={{
          borderTop: isOpen ? "4px solid #1465FC" : undefined,
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
          dragControls={dragControls}
        />
      </Card>
    </Reorder.Item>
  );
};
