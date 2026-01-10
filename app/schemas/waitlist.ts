
import { z } from "zod";

export const PhoneStr = z
    .string()
    .regex(/^\+91\d{10}$/, "Invalid Indian phone number");

export const WaitlistSchema = z.object({
    full_name: z.string().min(2, "Name must be minimum 2 characters of length"),
    email: z.string().email(),
    phone: PhoneStr,
});

export const PartnerSchema = z.object({
    cafe_name: z.string().min(2),
    full_name: z.string().min(2),
    email: z.string().email(),
    phone: PhoneStr,
});

export type WaitlistInput = z.infer<typeof WaitlistSchema>;
export type PartnerInput = z.infer<typeof PartnerSchema>;
