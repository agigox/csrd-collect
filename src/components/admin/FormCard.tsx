"use client";

import { Card } from "@/lib/components/ui/card";
import { Divider } from "@/lib/Divider";

interface FormCardProps {
  code: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export const FormCard = ({ code, title, description, onClick }: FormCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="flex-row items-center gap-0 py-[14px] px-3 h-[60px] border-0 rounded bg-white shadow-[0px_0px_2px_0px_rgba(0,0,0,0.12),0px_2px_4px_0px_rgba(0,0,0,0.14)] cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-[0px_0px_4px_0px_rgba(0,0,0,0.16),0px_4px_8px_0px_rgba(0,0,0,0.18)] active:scale-[0.99] active:bg-gray-100"
    >
      <div className="flex-1 py-2">
        <p className="text-sm text-muted-foreground">{code}</p>
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
      </div>
      <Divider orientation="vertical" className="mx-4 my-4 bg-border-divider" />
      <div className="flex-1 py-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
    </Card>
  );
};
