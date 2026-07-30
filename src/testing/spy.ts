/**
 * The same specs run on Vitest and on Karma with Jasmine. Only a handful of
 * helpers differ between the two, so they are funnelled through this file
 * instead of being duplicated per runner.
 */

interface VitestGlobals {
  spyOn: (target: object, property: string, accessor?: 'get' | 'set') => { mockReturnValue(value: unknown): void };
  useFakeTimers(): void;
  useRealTimers(): void;
  advanceTimersByTimeAsync(ms: number): Promise<void>;
}

declare const vi: VitestGlobals | undefined;

const onVitest = typeof vi !== 'undefined';

export function stubGetter<T extends object, K extends keyof T & string>(
  target: T,
  property: K,
  value: T[K],
): void {
  if (onVitest) {
    (vi as VitestGlobals).spyOn(target, property, 'get').mockReturnValue(value);
    return;
  }
  spyOnProperty(target, property, 'get').and.returnValue(value);
}

export function installFakeClock(): void {
  if (onVitest) {
    (vi as VitestGlobals).useFakeTimers();
    return;
  }
  jasmine.clock().install();
}

export function uninstallFakeClock(): void {
  if (onVitest) {
    (vi as VitestGlobals).useRealTimers();
    return;
  }
  jasmine.clock().uninstall();
}

export async function advanceClock(ms: number): Promise<void> {
  if (onVitest) {
    await (vi as VitestGlobals).advanceTimersByTimeAsync(ms);
    return;
  }
  jasmine.clock().tick(ms);
  await Promise.resolve();
}

/** Jasmine has no `it.each`, so the cases are expanded into plain specs. */
export function forEachCase<T>(name: string, cases: readonly T[], run: (value: T) => void): void {
  for (const value of cases) {
    it(`${name}: ${String(value)}`, () => run(value));
  }
}
