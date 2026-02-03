import { ReactNode } from "react";

interface EmptyStateProps {
  text: string;
  action?: ReactNode;
}

export function EmptyState({ text, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 border border-dashed border-border-default rounded-lg px-2">
      <p className="text-content-muted text-center">{text}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
