import { db } from "$/db/config";
import { asc, desc, eq, inArray, like, or } from "drizzle-orm";
import { tableProductGroups, tableProductItems, tableProducts, type Products } from "$/db/model";
import type { ListArgs } from "$/common/types";
import type { AnyColumn } from "drizzle-orm";

export async function findProductBy<T extends keyof Products>(key: T, value: Products[T]) {
  const data = await db
    .select({
      productId: tableProducts.id,
      productName: tableProducts.name,
      productPrice: tableProducts.price,
      productGroup: tableProductGroups.group,
      maxShoot: tableProductItems.maxShoot,
      maxPrint: tableProductItems.maxPrint,
      maxPeople: tableProductItems.maxPeople,
      maxDuration: tableProductItems.maxDuration,
    })
    .from(tableProducts)
    .leftJoin(tableProductGroups, eq(tableProductGroups.id, tableProducts.productGroupId))
    .leftJoin(tableProductItems, eq(tableProductItems.productId, tableProducts.id))
    .where(eq(tableProducts[key as keyof typeof tableProducts] as AnyColumn, value));
  return data;
}

export async function findProductByIds(ids: number[]) {
  if (ids.length === 0) return [];
  const data = await db.select().from(tableProducts).where(inArray(tableProducts.id, ids));
  return data;
}

export async function findProducts(args: ListArgs) {
  const data = await db
    .select({
      productId: tableProducts.id,
      productName: tableProducts.name,
      productPrice: tableProducts.price,
      productGroup: tableProductGroups.group,
      maxShoot: tableProductItems.maxShoot,
      maxPrint: tableProductItems.maxPrint,
      maxPeople: tableProductItems.maxPeople,
      maxDuration: tableProductItems.maxDuration,
    })
    .from(tableProducts)
    .leftJoin(tableProductGroups, eq(tableProductGroups.id, tableProducts.productGroupId))
    .leftJoin(tableProductItems, eq(tableProductItems.productId, tableProducts.id))
    .where(
      args.q ? or(like(tableProducts.name, `%${args.q}%`), like(tableProductGroups.group, `%${args.q}%`)) : undefined
    )
    .orderBy(
      args.order === "asc"
        ? asc(tableProducts[args.sort as keyof typeof tableProducts] as AnyColumn)
        : desc(tableProducts[args.sort as keyof typeof tableProducts] as AnyColumn)
    );
  return data;
}

export async function findProductGroups(args: ListArgs) {
  const data = await db
    .select({ id: tableProductGroups.id, group: tableProductGroups.group })
    .from(tableProductGroups)
    .where(args.q ? like(tableProductGroups.group, `%${args.q}%`) : undefined)
    .orderBy(
      args.order === "asc"
        ? asc(tableProductGroups[args.sort as keyof typeof tableProductGroups] as AnyColumn)
        : desc(tableProductGroups[args.sort as keyof typeof tableProductGroups] as AnyColumn)
    );

  return data;
}
