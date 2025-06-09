import { bigint, integer, numeric, pgTable, serial, date, varchar, timestamp } from "drizzle-orm/pg-core";

const audit = {
  createdAt: bigint({ mode: "number" }).$defaultFn(() => Date.now()),
  updatedAt: bigint({ mode: "number" }),
};

export const tableProductGroups = pgTable("product_groups", {
  id: serial().primaryKey(),
  group: varchar({ length: 50 }),
  ...audit,
});

export type ProductGroups = typeof tableProductGroups.$inferSelect;

export const tableProductItems = pgTable("product_items", {
  id: serial().primaryKey(),
  productId: integer().references(() => tableProducts.id),
  maxShoot: integer(),
  maxPrint: integer(),
  maxPeople: integer(),
  maxDuration: integer(),
  ...audit,
});

export const tableProducts = pgTable("products", {
  id: serial().primaryKey(),
  name: varchar({ length: 150 }),
  productGroupId: integer().references(() => tableProductGroups.id),
  price: numeric({ precision: 12, scale: 2 }),
  ...audit,
});

export type Products = typeof tableProducts.$inferSelect;

export const tablePromotions = pgTable("promotions", {
  id: serial().primaryKey(),
  code: varchar({ length: 20 }),
  percentage: integer(),
  validUntil: date(),
  ...audit,
});

export type Promotions = typeof tablePromotions.$inferSelect;

export const tableOrderItems = pgTable("order_items", {
  id: serial().primaryKey(),
  reffId: varchar({ length: 20 }),
  productId: integer().references(() => tableProducts.id),
  quantity: integer(),
  subtotal: numeric({ precision: 12, scale: 2 }),
  ...audit,
});

export type OrderItemsInsert = typeof tableOrderItems.$inferInsert;

export const tableOrders = pgTable("orders", {
  id: serial().primaryKey(),
  customerKey: varchar({ length: 255 }),
  reffId: varchar({ length: 20 }),
  promotionCode: varchar({ length: 20 }),
  subtotal: numeric({ precision: 12, scale: 2 }),
  total: numeric({ precision: 12, scale: 2 }),
  status: varchar({ length: 10 }),
  ...audit,
});

export type Orders = typeof tableOrders.$inferSelect;
export type OrdersInsert = typeof tableOrders.$inferInsert;

export const tableTransaction = pgTable("transactions", {
  id: serial().primaryKey(),
  reffId: varchar({ length: 20 }),
  method: varchar({ length: 10 }),
  destination: varchar({ length: 15 }),
  paidAmount: numeric({ precision: 12, scale: 2 }),
  paidAt: timestamp(),
  status: varchar({ length: 10 }),
  ...audit,
});

export type Transactions = typeof tableTransaction.$inferSelect;
export type TransactionsInsert = typeof tableTransaction.$inferInsert;

export const tablePhotoboxAccess = pgTable("photobox_access", {
  id: serial().primaryKey(),
  accessKey: varchar({ length: 6 }),
  productId: integer().references(() => tableProducts.id),
  reffId: varchar({ length: 20 }),
  status: varchar({ length: 10 }),
});
