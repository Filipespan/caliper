import { inject, Injectable } from '@angular/core';
import { catchError, concatMap, from, map, Observable, of, scan, startWith } from 'rxjs';
import { AuditError } from '../../core/psi/audit-error';
import { AuditResult, Strategy } from '../../core/psi/psi.models';
import { PsiService } from '../../core/psi/psi.service';

export interface CompareRow {
  readonly url: string;
  readonly result: AuditResult | null;
  readonly error: AuditError | null;
}

export interface CompareProgress {
  readonly rows: readonly CompareRow[];
  readonly total: number;
  readonly finished: boolean;
}

@Injectable({ providedIn: 'root' })
export class CompareQueueService {
  private readonly psi = inject(PsiService);

  /** concatMap, not forkJoin or mergeMap: the PageSpeed API answers a burst of
      requests with 429, so the urls have to leave one at a time. */
  run(urls: readonly string[], strategy: Strategy = 'mobile'): Observable<CompareProgress> {
    return from(urls).pipe(
      concatMap((url) =>
        this.psi.audit(url, strategy).pipe(
          map((result): CompareRow => ({ url, result, error: null })),
          catchError((error: AuditError) => of<CompareRow>({ url, result: null, error })),
        ),
      ),
      scan((rows: CompareRow[], row) => [...rows, row], []),
      map((rows) => ({ rows, total: urls.length, finished: rows.length === urls.length })),
      startWith({ rows: [], total: urls.length, finished: false } as CompareProgress),
    );
  }
}
