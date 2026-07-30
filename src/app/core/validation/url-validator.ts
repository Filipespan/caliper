import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const ALLOWED_PROTOCOLS = ['http:', 'https:'];

export function isAuditableUrl(value: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(value.trim());
  } catch {
    return false;
  }

  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
    return false;
  }

  // The API needs a public host, so a bare hostname without a dot cannot resolve.
  return parsed.hostname.includes('.') && !parsed.hostname.endsWith('.');
}

export const urlValidator: ValidatorFn = (
  control: AbstractControl<string | null>,
): ValidationErrors | null => {
  const value = control.value ?? '';
  if (value.trim() === '') {
    return null;
  }
  return isAuditableUrl(value) ? null : { url: true };
};
