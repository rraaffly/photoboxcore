import { response } from "$/common/response";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { ZodTypeDef } from "zod";
import type { ValidationTargets } from "hono";

export function validator<
  Target extends keyof ValidationTargets,
  Output = any,
  Def extends ZodTypeDef = ZodTypeDef,
  Input = Output
>(target: Target, schema: z.Schema<Output, Def, Input>) {
  return zValidator(target, schema, (result, c) => {
    const { data, ...rest } = result;
    if (!result.success) {
      return response(c, 400, "bad request", { ...rest });
    }
  });
}

export const ALLOWED_SORT_COLUMN = ["id", "createdAt", "updatedAt"] as const;
export type SortByType = (typeof ALLOWED_SORT_COLUMN)[number];

export const ALLOWED_ORDER_DIRECTION = ["asc", "desc"] as const;
export type OrderDirectionType = (typeof ALLOWED_ORDER_DIRECTION)[number];

export const IdParamValidator = z.object({
  id: z.coerce.number().optional(),
  reffId: z.coerce.string().optional(),
});

export const ReffIdParamValidator = z.object({
  id: z.coerce.string(),
});

export const QueryValidator = z.object({
  q: z.string().default(""),
  sort: z.enum(ALLOWED_SORT_COLUMN).default("id"),
  order: z.enum(ALLOWED_ORDER_DIRECTION).default("asc"),
});
