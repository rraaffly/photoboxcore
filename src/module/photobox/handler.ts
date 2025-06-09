import { response } from "$/common/response";
import { Hono } from "hono";

const app = new Hono();

app.post("/", async (c) => {
  return response(c, 200, "successfully creating data", null);
});

app.get("/", async (c) => {
  return response(c, 200, "successfully creating data", null);
});

app.patch("/:accessKey/status", async (c) => {
  return response(c, 200, "successfully creating data", null);
});

export default app;
