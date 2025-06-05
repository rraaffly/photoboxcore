import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const audit = {
  createdAt: timestamp(),
  updatedAt: timestamp(),
};

export const productGroups = pgTable("product_groups", {
  id: serial().primaryKey(),
  group: varchar({ length: 50 }),
  ...audit,
});

export const productItems = pgTable("product_items", {
  id: serial().primaryKey(),
  productId: integer().references(() => products.id),
  maxShoot: integer(),
  maxPrint: integer(),
  maxPeople: integer(),
  maxDuration: integer(),
  ...audit,
});

export const products = pgTable("products", {
  id: serial().primaryKey(),
  name: varchar({ length: 150 }),
  productGroupId: integer().references(() => productGroups.id),
  ...audit,
});
