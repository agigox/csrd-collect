import type { FieldRegistration, FieldType } from "./types";

import { fieldRegistration as textField } from "./text";
import { fieldRegistration as numberField } from "./number";
import { fieldRegistration as selectField } from "./select";
import { fieldRegistration as unitField } from "./unit";
import { fieldRegistration as switchField } from "./switch";
import { fieldRegistration as calendarField } from "./calendar";

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
registerField(unitField);
registerField(switchField);
registerField(calendarField);
