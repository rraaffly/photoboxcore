import { z } from "zod";

export const StringTyping = z.string();
export const EmailTyping = z.string().email();
export const PhoneNumberTyping = z.string();
