"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { FieldConfig } from "@/lib/form-fields";

export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  schema: FieldConfig[];
}

interface FormsContextType {
  forms: FormDefinition[];
  loading: boolean;
  error: string | null;
  currentForm: FormDefinition | null;
  setCurrentForm: (form: FormDefinition | null) => void;
  saveForm: (form: FormDefinition) => void;
  createForm: (form: Omit<FormDefinition, "id" | "createdAt" | "updatedAt">) => FormDefinition;
  deleteForm: (id: string) => void;
  refetch: () => Promise<void>;
}

const FormsContext = createContext<FormsContextType | null>(null);

interface FormsProviderProps {
  children: ReactNode;
}

export function FormsProvider({ children }: FormsProviderProps) {
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentForm, setCurrentForm] = useState<FormDefinition | null>(null);

  const fetchForms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/data/forms.json");

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setForms(data.forms);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
      console.error("Erreur lors du chargement des formulaires:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const saveForm = useCallback((updatedForm: FormDefinition) => {
    setForms((prevForms) => {
      const index = prevForms.findIndex((f) => f.id === updatedForm.id);
      if (index !== -1) {
        const newForms = [...prevForms];
        newForms[index] = {
          ...updatedForm,
          updatedAt: new Date().toISOString().split("T")[0],
        };
        return newForms;
      }
      return prevForms;
    });

    if (currentForm?.id === updatedForm.id) {
      setCurrentForm({
        ...updatedForm,
        updatedAt: new Date().toISOString().split("T")[0],
      });
    }
  }, [currentForm]);

  const createForm = useCallback((formData: Omit<FormDefinition, "id" | "createdAt" | "updatedAt">): FormDefinition => {
    const today = new Date().toISOString().split("T")[0];
    const newForm: FormDefinition = {
      ...formData,
      id: Date.now().toString(),
      createdAt: today,
      updatedAt: today,
    };

    setForms((prevForms) => [...prevForms, newForm]);
    return newForm;
  }, []);

  const deleteForm = useCallback((id: string) => {
    setForms((prevForms) => prevForms.filter((f) => f.id !== id));
    if (currentForm?.id === id) {
      setCurrentForm(null);
    }
  }, [currentForm]);

  const value: FormsContextType = {
    forms,
    loading,
    error,
    currentForm,
    setCurrentForm,
    saveForm,
    createForm,
    deleteForm,
    refetch: fetchForms,
  };

  return <FormsContext value={value}>{children}</FormsContext>;
}

export function useForms() {
  const context = useContext(FormsContext);

  if (!context) {
    throw new Error("useForms doit être utilisé dans un FormsProvider");
  }

  return context;
}
