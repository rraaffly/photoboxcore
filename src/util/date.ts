export function getEndOfDay(strDate: string) {
  const eod = new Date(strDate);
  if (isNaN(eod.getTime())) return null;
  eod.setHours(23, 59, 59, 999);
  return eod.toString();
}
