import { response } from "$/common/response";
import { Hono } from "hono";

const app = new Hono();

app.post("/", async (c) => {
  return response(c, 200, "successfully creating data", null);
});

app.get("/", async (c) => {
  return response(c, 200, "successfully retrieve data", null);
});

app.get("/:reffId", async (c) => {
  return response(c, 200, "successfully retrieve data", null);
});

app.post("/callback", async (c) => {
  return response(c, 200, "", null);
});

export default app;
