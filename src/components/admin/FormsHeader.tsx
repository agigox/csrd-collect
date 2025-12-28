import { Button } from "@/lib/components/ui/button";
import Icon from "@/lib/Icons";

const FormsHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">
        Administration des formulaires de déclaration
      </h1>
      <Button>
        Ajouter un formulaire
        <Icon name="plus" />
      </Button>
    </div>
  );
};
export default FormsHeader;
