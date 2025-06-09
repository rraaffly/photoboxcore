import { db } from "$/db/config";
import { tablePromotions, type Promotions } from "$/db/model";
import { getEndOfDay } from "$/util/date";
import { eq } from "drizzle-orm";

export async function findPromotionCodes() {}

export async function findPromotionCodeByCode(code: string): Promise<Promotions | null> {
  if (!code) return null;
  const promotion = await db.select().from(tablePromotions).where(eq(tablePromotions.code, code));
  return promotion[0] ?? null;
}

export async function isPromotionCodeValid(promotions: Promotions): Promise<boolean> {
  if (!promotions || !promotions.validUntil) return false;

  const eod = getEndOfDay(promotions.validUntil);
  if (!eod) return false;

  const currentDate = new Date();
  const untilDate = new Date(eod);
  return currentDate <= untilDate;
}
