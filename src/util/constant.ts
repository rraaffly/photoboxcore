export const ORDER_STATUS_KEY = ["OPEN", "PAYMENT", "CANCEL", "CLOSE"] as const;

export const ORDER_STATUS: Record<(typeof ORDER_STATUS_KEY)[number], string> = {
  OPEN: "OPEN",
  PAYMENT: "PAYMENT",
  CANCEL: "CANCEL",
  CLOSE: "CLOSE",
};

export const TRANSACTION_STATUS_KEY = ["WAITING", "SUCCESS", "FAILED", "REFUNDED", "EXPIRED"] as const;

export const TRANSACTION_STATUS: Record<(typeof TRANSACTION_STATUS_KEY)[number], string> = {
  WAITING: "WAITING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  EXPIRED: "EXPIRED",
};
