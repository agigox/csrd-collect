import { Card } from "@/lib/components/ui/card";
import { Separator } from "@/lib/components/ui/separator";

interface FormCardProps {
  code: string;
  title: string;
  description: string;
}

export const FormCard = ({ code, title, description }: FormCardProps) => {
  return (
    <Card className="flex-row items-center gap-0 py-0 px-3 h-[60px] border-0 shadow-sm rounded">
      <div className="flex-1 py-2">
        <p className="text-sm text-muted-foreground">{code}</p>
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
      </div>
      <Separator orientation="vertical" className="h-8 mx-3" />
      <div className="flex-1 py-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
    </Card>
  );
};
