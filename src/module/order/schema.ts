import { EmailTyping, PhoneNumberTyping, StringTyping } from "$/util/typing";
import { z } from "zod";

export const CreateOrderItemsSchema = z.object({
  productId: z.number(),
  quantity: z.number(),
});

export type CreateOrderItemsRequest = z.infer<typeof CreateOrderItemsSchema>;

export const CreateOrderSchema = z.object({
  customerKey: StringTyping.trim(),
  promotionCode: StringTyping.trim().optional(),
  orders: z.array(CreateOrderItemsSchema),
});

export type CreateOrderRequest = z.infer<typeof CreateOrderSchema>;
