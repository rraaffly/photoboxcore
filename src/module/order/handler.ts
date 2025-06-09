import { response } from "$/common/response";
import { CreateOrderSchema, type CreateOrderRequest } from "./schema";
import { IdParamValidator, QueryValidator, validator } from "$/middleware/validator";
import { Hono } from "hono";
import { createOrder, findOrderBy, findOrders, updateOrderStatus } from "$/service/order";

const app = new Hono();

app.get("/", validator("query", QueryValidator), async (c) => {
  const { sort, order } = c.req.valid("query");
  const data = await findOrders({ sort, order });
  return response(c, 200, "successfully retrieve data", data);
});

app.get("/:reffId", validator("param", IdParamValidator), async (c) => {
  const params = c.req.valid("param");
  if (!params.reffId) return response(c, 400, "bad request", params.reffId);
  const data = await findOrderBy("reffId", params.reffId);
  return response(c, 200, "successfully retrieve data", data);
});

app.patch("/:reffId/status", validator("param", IdParamValidator), async (c) => {
  const params = c.req.valid("param");
  if (!params.reffId) return response(c, 400, "bad request", params.reffId);
  const data = await updateOrderStatus("reffId", params.reffId);
  return response(c, 200, "successfully retrieve data", data);
});

app.post("/", validator("json", CreateOrderSchema), async (c) => {
  const request = (await c.req.json()) as CreateOrderRequest;
  if (!request.orders || request.orders.length === 0) return response(c, 400, "bad request", null);
  const data = await createOrder(request);
  return response(c, 200, "successfully creating data", data);
});

export default app;
