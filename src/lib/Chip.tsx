interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

const Chip = ({ children, className = "" }: ChipProps) => {
  return (
    <span
      className={`bg-[#e6eef8] text-[#2964a0] text-base font-semibold px-1.5 rounded tracking-tight ${className}`}
    >
      {children}
    </span>
  );
};

export default Chip;
