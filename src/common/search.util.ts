/**
 * Cleans text typed in a search box before it is placed inside a database filter.
 * Characters that have a meaning in filters (commas, brackets, wildcards, quotes) are replaced
 * with spaces so a search can never change the structure of the query.
 */
export function toSearchTerm(raw: string | undefined): string {
  return (raw ?? '').replace(/[%_\\,()"*]/g, ' ').replace(/\s+/g, ' ').trim();
}
