import { Injectable, signal } from '@angular/core';
import { AuditPair } from '../psi/psi.models';

export interface HistoryEntry {
  readonly url: string;
  readonly mobileScore: number | null;
  readonly desktopScore: number | null;
  readonly ranAt: number;
}

const STORAGE_KEY = 'caliper.history';
const LIMIT = 5;

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly entriesSignal = signal<readonly HistoryEntry[]>(read());

  readonly entries = this.entriesSignal.asReadonly();

  record(pair: AuditPair): void {
    const entry: HistoryEntry = {
      url: pair.url,
      mobileScore: pair.mobile.score,
      desktopScore: pair.desktop.score,
      ranAt: Date.now(),
    };
    const next = [entry, ...this.entriesSignal().filter((e) => e.url !== entry.url)].slice(0, LIMIT);
    this.entriesSignal.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  clear(): void {
    this.entriesSignal.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }
}

function read(): readonly HistoryEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]).slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}
