import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function response<T>(
  c: Context,
  status: ContentfulStatusCode,
  message: string,
  result: T
) {
  return c.json({ message, result }, status);
}
