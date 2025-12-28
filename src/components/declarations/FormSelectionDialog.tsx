"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/lib/components/ui/dialog";
import { Button } from "@/lib/components/ui/button";
import { useForms, FormDefinition } from "@/context/FormsContext";
import { cn } from "@/lib/utils";

interface FormSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormSelect: (form: FormDefinition) => void;
}

const FormSelectionDialog = ({
  open,
  onOpenChange,
  onFormSelect,
}: FormSelectionDialogProps) => {
  const { forms, loading } = useForms();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const handleCancel = () => {
    setSelectedFormId(null);
    onOpenChange(false);
  };

  const handleAdd = () => {
    const selectedForm = forms.find((f) => f.id === selectedFormId);
    if (selectedForm) {
      onFormSelect(selectedForm);
      setSelectedFormId(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle déclaration</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Que souhaitez vous déclarer ?
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto py-2">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement des formulaires...
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun formulaire disponible
            </div>
          ) : (
            forms.map((form) => (
              <button
                key={form.id}
                onClick={() => setSelectedFormId(form.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-colors",
                  selectedFormId === form.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {form.id}
                </div>
                <div className="font-semibold text-foreground">
                  {form.name}
                </div>
                {form.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {form.description}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleAdd} disabled={!selectedFormId}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormSelectionDialog;
