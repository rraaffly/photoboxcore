import { response } from "$/schema/response";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { ValidationTargets } from "hono";
import type { ZodTypeDef } from "zod";

export function validator<
  Target extends keyof ValidationTargets,
  Output = any,
  Def extends ZodTypeDef = ZodTypeDef,
  Input = Output
>(target: Target, schema: z.Schema<Output, Def, Input>) {
  return zValidator(target, schema, (result, c) => {
    const { data, ...rest } = result;
    if (!result.success) {
      return response(c, 400, "BAD_REQUEST", { ...rest });
    }
  });
}
