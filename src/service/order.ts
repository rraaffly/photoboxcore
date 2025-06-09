import { db } from "$/db/config";
import { findProductByIds } from "./product";
import { findPromotionCodeByCode, isPromotionCodeValid } from "./promotion";
import { tableOrderItems, tableOrders, tableProductGroups, tableProducts, tableTransaction } from "$/db/model";
import type { OrderItemsInsert, Orders, OrdersInsert, TransactionsInsert } from "$/db/model";
import type { CreateOrderRequest } from "$/module/order";
import type { ListArgs } from "$/common/types";
import { ORDER_STATUS, TRANSACTION_STATUS } from "$/util/constant";
import { asc, desc, eq, type AnyColumn } from "drizzle-orm";

export function createReffId(): string {
  const reffId = BigInt(Date.now()) * 1_000_000n + (process.hrtime.bigint() % 1_000_000n);
  return reffId.toString();
}

export async function findOrders(args: ListArgs) {
  const data = await db
    .select(selectOrders())
    .from(tableOrders)
    .leftJoin(tableOrderItems, eq(tableOrderItems.reffId, tableOrders.reffId))
    .leftJoin(tableProducts, eq(tableOrderItems.productId, tableProducts.id))
    .orderBy(
      args.order === "asc"
        ? asc(tableOrders[args.sort as keyof typeof tableOrders] as AnyColumn)
        : desc(tableOrders[args.sort as keyof typeof tableOrders] as AnyColumn)
    );

  return orderMap(data);
}

export async function findOrderBy<T extends keyof Orders>(key: T, value: Orders[T]) {
  const data = await db
    .select(selectOrders())
    .from(tableOrders)
    .leftJoin(tableOrderItems, eq(tableOrderItems.reffId, tableOrders.reffId))
    .leftJoin(tableProducts, eq(tableOrderItems.productId, tableProducts.id))
    .where(eq(tableOrders[key as keyof typeof tableOrders] as AnyColumn, value));

  return orderMap(data);
}

export async function createOrder(request: CreateOrderRequest) {
  const { customerKey, promotionCode, orders } = request;
  const reffId = createReffId();
  const status = ORDER_STATUS.OPEN;
  const createdAt = Date.now();

  const productIds = orders.map((item) => item.productId);
  const products = await findProductByIds(productIds);
  const productMap = new Map(products.map((p) => [p.id, p]));

  const subtotalPerOrderItems = orders.map(({ productId, quantity }) => {
    const price = Number(productMap.get(productId)?.price ?? 0);
    return price * quantity;
  });

  const subtotalPerOrder = subtotalPerOrderItems.reduce((a, b) => a + b, 0);

  let percentage = 0;
  if (promotionCode) {
    const promotions = await findPromotionCodeByCode(promotionCode);
    if (promotions && (await isPromotionCodeValid(promotions))) {
      percentage = Number(promotions.percentage) / 100;
    }
  }

  const discount = subtotalPerOrder * percentage;
  const total = subtotalPerOrder - discount;

  await db.transaction(async (tx) => {
    const dataOrderItem: OrderItemsInsert[] = request.orders.map(({ productId, quantity }, i) => ({
      reffId,
      productId,
      quantity: quantity,
      subtotal: subtotalPerOrderItems[i]?.toString(),
      createdAt,
    }));
    await tx.insert(tableOrderItems).values(dataOrderItem);

    const dataOrder: OrdersInsert = {
      reffId,
      customerKey,
      promotionCode,
      subtotal: String(subtotalPerOrder),
      total: String(total),
      status,
      createdAt,
    };
    await tx.insert(tableOrders).values(dataOrder);

    const dataTransaction: TransactionsInsert = { reffId, status: TRANSACTION_STATUS.WAITING, createdAt };
    await tx.insert(tableTransaction).values(dataTransaction);
  });

  return { reffId, promotionCode, status };
}

export async function updateOrderStatus<T extends keyof Orders>(key: T, value: Orders[T]) {}

type OrderMapType = {
  orderId: number;
  orderReffId: string | null;
  orderPromotionCode: string | null;
  orderSubtotal: string | null;
  orderTotal: string | null;
  orderStatus: string | null;
  orderItemId: number | null;
  orderItemQuantity: number | null;
  orderItemSubtotal: string | null;
  productId: number | null;
  productName: string | null;
  productPrice: string | null;
};

function selectOrders() {
  return {
    orderId: tableOrders.id,
    orderReffId: tableOrders.reffId,
    orderPromotionCode: tableOrders.promotionCode,
    orderSubtotal: tableOrders.subtotal,
    orderTotal: tableOrders.total,
    orderStatus: tableOrders.status,
    orderItemId: tableOrderItems.id,
    orderItemQuantity: tableOrderItems.quantity,
    orderItemSubtotal: tableOrderItems.subtotal,
    productId: tableProducts.id,
    productName: tableProducts.name,
    productPrice: tableProducts.price,
  };
}

function orderMap(data: OrderMapType[]) {
  const map = new Map<number, any>();

  for (const d of data) {
    if (!map.has(d.orderId)) {
      map.set(d.orderId, {
        id: d.orderId,
        reffId: d.orderReffId,
        promotionCode: d.orderPromotionCode,
        subtotal: d.orderSubtotal,
        total: d.orderTotal,
        status: d.orderStatus,
        orders: [],
      });
    }

    if (d.orderItemId) {
      map.get(d.orderId)?.orders.push({
        id: d.orderItemId,
        name: d.productName,
        price: d.productPrice,
        quantity: d.orderItemQuantity,
        subtotal: d.orderItemSubtotal,
      });
    }
  }

  return Array.from(map.values());
}
