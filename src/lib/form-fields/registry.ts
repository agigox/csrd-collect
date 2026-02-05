import type { FieldRegistration, FieldType } from "@/models/FieldTypes";

import { fieldRegistration as textField } from "../dynamic-field/text";
import { fieldRegistration as numberField } from "../dynamic-field/number";
import { fieldRegistration as selectField } from "../dynamic-field/select";
import { fieldRegistration as switchField } from "../dynamic-field/switch";
import { fieldRegistration as dateField } from "../dynamic-field/date";
import { fieldRegistration as radioField } from "../dynamic-field/radio";
import { fieldRegistration as checkboxField } from "../dynamic-field/checkbox";
import { fieldRegistration as importField } from "../dynamic-field/import";

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
