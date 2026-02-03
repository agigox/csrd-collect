import { useSortable } from "@dnd-kit/sortable";
import type { FieldConfig } from "./types";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@rte-ds/react";
import { FieldConfigurator } from "./field-configurator";
// Sortable Field Card component
interface SortableFieldCardProps {
  id: string;
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
  id,
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
    borderTop: isOpen ? "4px solid #1465FC" : undefined,
    backgroundColor: "white",
  };

  return (
    <Card
      ref={setNodeRef}
      className="py-4 px-4"
      cardType="outlined"
      style={style}
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
        dragHandleAttributes={attributes}
        dragHandleListeners={listeners}
      />
    </Card>
  );
};
