import { HttpErrorResponse } from '@angular/common/http';
import { MessageKey } from '../../i18n/en';

export type AuditErrorKind = 'network' | 'rate-limited' | 'not-audited' | 'server' | 'unknown';

const MESSAGE_KEYS: Record<AuditErrorKind, MessageKey> = {
  network: 'errorNetwork',
  'rate-limited': 'errorRateLimited',
  'not-audited': 'errorNotAudited',
  server: 'errorServer',
  unknown: 'errorUnknown',
};

export class AuditError extends Error {
  readonly kind: AuditErrorKind;
  readonly messageKey: MessageKey;
  readonly status: number;

  constructor(kind: AuditErrorKind, status: number) {
    super(`audit failed: ${kind}`);
    this.name = 'AuditError';
    this.kind = kind;
    this.status = status;
    this.messageKey = MESSAGE_KEYS[kind];
  }
}

export function toAuditError(response: HttpErrorResponse): AuditError {
  if (response.status === 0) {
    return new AuditError('network', 0);
  }
  if (response.status === 429) {
    return new AuditError('rate-limited', 429);
  }
  if (response.status === 400 || response.status === 404 || response.status === 422) {
    return new AuditError('not-audited', response.status);
  }
  if (response.status >= 500) {
    return new AuditError('server', response.status);
  }
  return new AuditError('unknown', response.status);
}

export function isRetryable(error: AuditError): boolean {
  return error.kind === 'server' || error.kind === 'network';
}
