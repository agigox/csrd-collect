import Link from "next/link";
import { Button } from "@/lib/ui/button";
import { Divider } from "@/lib/Divider";
import Icon from "@/lib/Icons";

const FormsHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">
        Administration des formulaires de déclaration
        <Divider className="bg-border-divider mt-2" />
      </h1>
      <Link href="/admin/parametrage-declaratif">
        <Button>
          Ajouter un formulaire
          <Icon name="plus" />
        </Button>
      </Link>
    </div>
  );
};
export default FormsHeader;
