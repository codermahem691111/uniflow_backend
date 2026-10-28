/** Keeps only the properties that were actually provided (not `undefined`). `null` is kept: it means "clear this value". */
export function definedOnly<T>(source: Partial<Record<keyof T, unknown>>): Partial<T> {
  return Object.fromEntries(Object.entries(source).filter(([, value]) => value !== undefined)) as Partial<T>;
}
