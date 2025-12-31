interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  className = "",
  orientation = "horizontal",
}: DividerProps) {
  const baseClasses =
    orientation === "horizontal" ? "w-full h-px" : "h-full w-px";

  return (
    <div
      className={`${baseClasses} ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
}
