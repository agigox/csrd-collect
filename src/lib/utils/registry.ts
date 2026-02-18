import type { FieldType } from "@/models/FieldTypes";
import type { FieldRegistration } from "@/lib/types/field";

import { fieldRegistration as textField } from "@/features/preview/text";
import { fieldRegistration as numberField } from "@/features/preview/number";
import { fieldRegistration as selectField } from "@/features/preview/select";
import { fieldRegistration as switchField } from "@/features/preview/switch";
import { fieldRegistration as dateField } from "@/features/preview/date";
import { fieldRegistration as radioField } from "@/features/preview/radio";
import { fieldRegistration as checkboxField } from "@/features/preview/checkbox";
import { fieldRegistration as importField } from "@/features/preview/import";

const fieldRegistry = new Map<FieldType, FieldRegistration>();

export function registerField(registration: FieldRegistration): void {
  fieldRegistry.set(registration.type, registration);
}

export function getField(type: FieldType): FieldRegistration | undefined {
  return fieldRegistry.get(type);
}

export function getAllFieldTypes(): FieldType[] {
  return Array.from(fieldRegistry.keys());
}

registerField(textField);
registerField(numberField);
registerField(selectField);
registerField(switchField);
registerField(dateField);
registerField(radioField);
registerField(checkboxField);
registerField(importField);
