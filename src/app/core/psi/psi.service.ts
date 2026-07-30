import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, retry, throwError, timer } from 'rxjs';
import { AuditError, isRetryable, toAuditError } from './audit-error';
import { toAuditResult } from './psi.mapper';
import { AuditPair, AuditResult, PsiResponse, Strategy } from './psi.models';

const ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const MAX_RETRIES = 2;

@Injectable({ providedIn: 'root' })
export class PsiService {
  private readonly http = inject(HttpClient);

  audit(url: string, strategy: Strategy): Observable<AuditResult> {
    const params = new HttpParams()
      .set('url', url)
      .set('strategy', strategy)
      .set('category', 'performance');

    return this.http.get<PsiResponse>(ENDPOINT, { params }).pipe(
      retry({
        count: MAX_RETRIES,
        delay: (error: HttpErrorResponse, attempt) => {
          const failure = toAuditError(error);
          if (!isRetryable(failure)) {
            return throwError(() => failure);
          }
          return timer(attempt * 700);
        },
      }),
      map((body) => toAuditResult(url, strategy, body)),
      catchError((error: unknown) =>
        throwError(() =>
          error instanceof AuditError ? error : toAuditError(error as HttpErrorResponse),
        ),
      ),
    );
  }

  /** Mobile and desktop are independent runs, so waiting for them in sequence
      would double the wall clock time for no reason. */
  auditBoth(url: string): Observable<AuditPair> {
    return forkJoin({
      mobile: this.audit(url, 'mobile'),
      desktop: this.audit(url, 'desktop'),
    }).pipe(map((pair) => ({ url, ...pair })));
  }
}
