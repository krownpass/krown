
import { z } from "zod";

export const WaitlistSchema = z.object({
    full_name: z.string().min(2, "Name must be minimum 2 characters of length"),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Only valid Indian phone numbers are allowed")
});

export const PartnerSchema = z.object({
    cafe_name: z.string().min(2),
    full_name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Only valid Indian phone numbers are allowed")
});

export type WaitlistInput = z.infer<typeof WaitlistSchema>;
export type PartnerInput = z.infer<typeof PartnerSchema>;
