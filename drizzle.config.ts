import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./sql",
  schema: "./src/db/model.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "tmpphotobox",
  },
});
