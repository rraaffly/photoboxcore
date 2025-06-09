import { response } from "$/common/response";
import { IdParamValidator, QueryValidator, validator } from "$/middleware/validator";
import { findProductBy, findProductGroups, findProducts } from "$/service/product";
import { Hono } from "hono";

const app = new Hono();

app.get("/", validator("query", QueryValidator), async (c) => {
  const { q, sort, order } = c.req.valid("query");
  const data = await findProducts({ sort, order, q });
  return response(c, 200, "successfully retrieved data", data);
});

app.get("/:id", validator("param", IdParamValidator), async (c) => {
  const params = c.req.valid("param");
  if (!params.id) return response(c, 400, "bad request", params.id);
  const data = await findProductBy("id", params.id);
  return response(c, 200, "successfully retrieved data", data);
});

app.get("/groups", validator("query", QueryValidator), async (c) => {
  const { q, sort, order } = c.req.valid("query");
  const data = await findProductGroups({ sort, order, q });
  return response(c, 200, "successfully retrieved data", data);
});

export default app;
