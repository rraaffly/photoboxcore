import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

const client = new SQL({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "root",
  database: "photobox",
});
export const db = drizzle({ client, casing: "snake_case" });
