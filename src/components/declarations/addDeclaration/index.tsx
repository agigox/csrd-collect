"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";

const AddDeclaration = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 h-8 px-3 bg-bg-brand hover:bg-brand-hover text-white font-semibold text-base rounded transition-colors">
          Déclarer
          <Megaphone className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="!fixed !top-0 !right-0 !left-auto !h-screen !w-[547px] !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-l !border-y-0 !border-r-0 data-[state=open]:!animate-slide-in-from-right data-[state=closed]:!animate-slide-out-to-right">
        <DialogHeader>
          <DialogTitle>Nouvelle déclaration</DialogTitle>
          <DialogDescription>
            Créez une nouvelle déclaration en remplissant le formulaire
            ci-dessous.
          </DialogDescription>
        </DialogHeader>
        {/* TODO: Add form content here */}
      </DialogContent>
    </Dialog>
  );
};

export default AddDeclaration;
