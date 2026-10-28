export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Turns "page 3 of size 10" into database row positions, and wraps the result. */
export class PageRequest {
  private constructor(
    readonly page: number,
    readonly pageSize: number,
  ) {}

  static from(query: { page: number; pageSize: number }): PageRequest {
    return new PageRequest(query.page, query.pageSize);
  }

  /** Index of the first row (0-based). */
  get firstIndex(): number {
    return (this.page - 1) * this.pageSize;
  }

  /** Index of the last row (inclusive), as the database range expects. */
  get lastIndex(): number {
    return this.firstIndex + this.pageSize - 1;
  }

  toResult<T>(items: T[], total: number): Paginated<T> {
    return { items, total, page: this.page, pageSize: this.pageSize };
  }
}
