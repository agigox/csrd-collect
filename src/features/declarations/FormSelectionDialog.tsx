"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/lib/ui/dialog";
import { Button } from "@/lib/ui/button";
import { useFormsStore, type FormDefinition } from "@/stores";
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
  const { forms, loading, fetchForms } = useFormsStore();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchForms();
    }
  }, [open, fetchForms]);

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
      <DialogContent className="sm:max-w-125" hideOverlay>
        <DialogHeader>
          <DialogTitle>Nouvelle déclaration</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 max-h-100 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement des formulaires...
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun formulaire disponible
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-[14px] text-secondary-foreground">
                Que souhaitez vous déclarer ?
              </div>
              <div className="w-full flex items-center justify-center">
                <div className="max-w-98 flex flex-col gap-[8.5px]">
                  {forms.map((form) => (
                    <button
                      key={form.id}
                      onClick={() => setSelectedFormId(form.id)}
                      className={cn(
                        "text-left p-4 rounded-lg border-2 transition-colors py-1.75 px-3",
                        selectedFormId === form.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="text-xs text-muted-foreground">
                        {form.code}
                      </div>
                      <div className="font-semibold text-foreground">
                        {form.name}
                      </div>
                      {form.description && (
                        <div className="text-sm text-muted-foreground">
                          {form.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
