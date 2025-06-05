import { Hono } from "hono";

import product from "$/handler/product";
import order from "$/handler/order";

const app = new Hono();

app.route("/api/products", product);
app.route("/api/orders", order);

export default app;
