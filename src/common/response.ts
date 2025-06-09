import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function response<T>(c: Context, status: ContentfulStatusCode, message: string, data: T) {
  return c.json({ message, data }, status);
}
