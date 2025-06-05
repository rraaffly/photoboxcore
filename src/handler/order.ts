import { response } from "$/schema/response";
import { Hono } from "hono";

const order = new Hono();

order.get("/", async (c) => {
  return response(c, 200, "SUCCESS", null);
});

export default order;
