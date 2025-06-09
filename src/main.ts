import { Hono } from "hono";

import { Product } from "$/module/product";
import { Order } from "$/module/order";
import { Payment } from "$/module/payment";
import { Photobox } from "$/module/photobox";

const app = new Hono();

app.route("/api/products", Product);
app.route("/api/orders", Order);
app.route("/api/payments", Payment);
app.route("/api/photobox", Photobox);

export default app;
