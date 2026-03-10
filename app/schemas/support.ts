// src/schemas/user.schema.ts
import { z } from "zod";

// ── Support / Contact ─────────────────────────────────────────────────────────

export const SUBJECT_VALUES = [
    "booking",
    "payment",
    "krown-pass",
    "account",
    "bug",
    "feedback",
    "other",
] as const;

export type ContactSubject = (typeof SUBJECT_VALUES)[number];
export type ContactStatus = "open" | "in_progress" | "resolved" | "closed";

export const ContactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required.")
        .max(120, "Name must be at most 120 characters."),

    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Please enter a valid email address.")
        .max(255),

    // optional — only validate format when a value is actually provided
    phone: z
        .string()
        .trim()
        .regex(/^\d{10}$/, "Phone must be exactly 10 digits.")
        .optional()
        .or(z.literal("")),

    subject: z
        .string()
        .trim()
        .refine(
            (v): v is ContactSubject =>
                (SUBJECT_VALUES as readonly string[]).includes(v),
            { message: "Please select a valid subject." }
        ),

    message: z
        .string()
        .trim()
        .min(10, "Message must be at least 10 characters.")
        .max(5000, "Message must be at most 5,000 characters."),
});

export interface ContactRow {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: ContactSubject;
    message: string;
    status: ContactStatus;
    created_at: Date;
    updated_at: Date;
}

// ── Inferred types ────────────────────────────────────────────────────────────

export type ContactInput = z.infer<typeof ContactSchema>;
