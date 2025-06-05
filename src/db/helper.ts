import { sql } from "drizzle-orm";

export const SORTABLE_COLUMNS = ["id", "created_at", "updated_at"] as const;
export const SORT_DIRECTIONS = ["asc", "desc"] as const;

export function orderClauseBuilder(
  table: string,
  sortBy?: string,
  orderBy?: string
) {
  const sortColumn = SORTABLE_COLUMNS.includes(sortBy as any) ? sortBy : "id";
  const sortDirection = SORT_DIRECTIONS.includes(orderBy?.toLowerCase() as any)
    ? orderBy?.toLowerCase()
    : "asc";

  return sql.raw(`ORDER BY ${table}.${sortColumn} ${sortDirection}`);
}
