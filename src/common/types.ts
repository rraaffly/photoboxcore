import type { OrderDirectionType, SortByType } from "$/middleware/validator";

export type ListArgs = {
  q?: string;
  sort: SortByType;
  order: OrderDirectionType;
};
