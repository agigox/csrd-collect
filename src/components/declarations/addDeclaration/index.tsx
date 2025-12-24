"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { Button } from "@/lib/components/ui/button";
import Icon from "@/lib/Icons";

const AddDeclaration = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <span>Déclarer</span>
          <Icon name="campaign" />
        </Button>
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
