"use client";

interface ErrorCardProps {
  message: string;
  className?: string;
}

export const ErrorState = ({ message, className }: ErrorCardProps) => {
  return (
    <div
      className={`mx-auto w-full p-3 rounded-lg bg-[#FEF2F2] border border-[#F14662] text-[#F14662] text-sm ${className ?? ""}`}
    >
      {message}
    </div>
  );
};
