import { Hono } from "hono";
import { response } from "$/schema/response";
import { validator } from "$/middleware/validator";
import { UrlPathSchema } from "$/schema/path";
import { db } from "$/db/config";
import { sql } from "drizzle-orm";

const product = new Hono();

product.get("/", validator("query", UrlPathSchema), async (c) => {
  const { q } = c.req.valid("query");

  const stmt = sql`
    SELECT p.id, p.name, pg."group", p.price, pi.max_shoot, pi.max_print, pi.max_people, pi.max_duration FROM products p 
    LEFT JOIN product_groups pg ON pg.id = p.product_group_id
    LEFT JOIN product_items pi ON pi.id = p.product_item_id
    WHERE pg."group" = 'Package'
  `;

  const def = await db.execute(stmt);
  return response(c, 200, "SUCCESS", def);
});

export default product;
