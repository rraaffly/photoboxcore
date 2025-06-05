import { z } from "zod";

export const UrlPathSchema = z.object({
  q: z.string().default(""),
});
