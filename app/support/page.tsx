"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { AxiosError } from "axios";
import GlassNavbar from "../components/NavBar";
import api from "../lib/api";
import { ContactSchema, SUBJECT_VALUES } from "../schemas/support";
import type { ContactSubject } from "../schemas/support";

// ── Types ─────────────────────────────────────────────────────────────────────

type FormStatus = "idle" | "sending" | "sent" | "error";

interface RawForm {
    name: string;
    email: string;
    phone: string;
    subject: ContactSubject | "";
    message: string;
}

type FieldErrors = Partial<Record<keyof RawForm, string>>;

interface FaqItem {
    q: string;
    a: string;
}

interface FaqCategory {
    category: string;
    questions: FaqItem[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const EMPTY_FORM: RawForm = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
};

const SUBJECT_LABELS: Record<ContactSubject, string> = {
    booking: "Booking Issue",
    payment: "Payment / Refund",
    "krown-pass": "Krown Pass",
    account: "Account Issue",
    bug: "Bug Report",
    feedback: "Feedback / Suggestion",
    other: "Other",
};

const FAQ_ITEMS: FaqCategory[] = [
    {
        category: "Getting Started",
        questions: [
            {
                q: "How do I create a Krown account?",
                a: "Download the Krown app from the App Store or Google Play. Open the app and enter your phone number. You'll receive an OTP — enter it to create your account instantly. No passwords needed.",
            },
            {
                q: "Is Krown available in my city?",
                a: "Krown is currently available in Chennai, Tamil Nadu. We're expanding to more cities soon. Follow us on social media for launch updates in your area.",
            },
            {
                q: "Is Krown free to use?",
                a: "Yes! Browsing cafés, discovering events, and exploring the app is completely free. You only pay when you book an event, reserve a table, or choose to upgrade to a Krown Pass membership.",
            },
        ],
    },
    {
        category: "Bookings & Events",
        questions: [
            {
                q: "How do I book an event?",
                a: "Find an event on the Explore page, tap on it to view details, and hit 'Book Tickets'. Complete the payment via Razorpay and your ticket will be instantly available in the app.",
            },
            {
                q: "Can I cancel or get a refund for a booking?",
                a: "Refund policies vary by event and café. Check the event's Terms & Conditions before booking. For café reservations, you can cancel up to 2 hours before your booking time. Contact us if you need help with a specific booking.",
            },
            {
                q: "How do I view my tickets?",
                a: "Go to your profile and tap on 'My Tickets' or 'Bookings'. You can view all your upcoming and past event tickets there. Show the ticket QR code at the venue for entry.",
            },
        ],
    },
    {
        category: "Krown Pass",
        questions: [
            {
                q: "What is Krown Pass?",
                a: "Krown Pass is our premium membership that gives you access to curated café experiences, member-only events, priority reservations, free drink redemptions, and surprise perks across partner cafés in Chennai.",
            },
            {
                q: "How do I redeem drinks with Krown Pass?",
                a: "Open the app, go to a partner café's page, and tap 'Redeem A Drink'. Choose your drink, hit 'Continue', and show the redemption code to the café staff. It's that simple!",
            },
            {
                q: "How do I cancel my Krown Pass?",
                a: "You can manage your subscription from your account settings. If you subscribed via the web, visit your account page on krownpass.com. Your benefits remain active until the end of your billing period.",
            },
        ],
    },
    {
        category: "Account & Privacy",
        questions: [
            {
                q: "How do I delete my account?",
                a: "Visit krownpass.com/delete-account and follow the steps. You'll need to verify your phone number via OTP. Your data will be permanently deleted within 30 days of the request.",
            },
            {
                q: "How is my data protected?",
                a: "We use industry-standard encryption for all data in transit and at rest. Your personal information is never sold to third parties. We only share necessary details with cafés and event organizers to fulfill your bookings.",
            },
            {
                q: "Can I change my phone number?",
                a: "Currently, you'll need to create a new account with your new phone number. Contact our support team if you need help transferring your Krown Pass or booking history.",
            },
        ],
    },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>("Getting Started");

    const [form, setForm] = useState<RawForm>(EMPTY_FORM);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formStatus, setFormStatus] = useState<FormStatus>("idle");
    const [serverError, setServerError] = useState<string>("");

    const setField = <K extends keyof RawForm>(key: K, value: RawForm[K]): void => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (fieldErrors[key]) {
            setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
        }
    };

    const toggleFaq = (id: string): void => {
        setOpenFaq((prev) => (prev === id ? null : id));
    };

    const currentQuestions: FaqItem[] =
        FAQ_ITEMS.find((c) => c.category === activeCategory)?.questions ?? [];

    const handleSubmit = async (): Promise<void> => {
        setFieldErrors({});
        setServerError("");

        const parsed = ContactSchema.safeParse(form);
        if (!parsed.success) {
            const errs: FieldErrors = {};
            parsed.error.flatten().fieldErrors &&
                Object.entries(parsed.error.flatten().fieldErrors).forEach(
                    ([key, messages]) => {
                        if (messages?.[0]) {
                            errs[key as keyof FieldErrors] = messages[0];
                        }
                    }
                );
            setFieldErrors(errs);
            return;
        }

        setFormStatus("sending");

        try {
            await api.post<{ success: boolean; message: string }>(
                "/api/users/support/contact",
                {
                    ...parsed.data,
                    phone: parsed.data.phone || undefined,
                }
            );
            setFormStatus("sent");
            setForm(EMPTY_FORM);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            const msg =
                axiosErr.response?.data?.message ??
                "Something went wrong. Please try again or email us at support@krownpass.com";
            setServerError(msg);
            setFormStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] rounded-full bg-[#800020]/8 blur-[180px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#800020]/5 blur-[140px] animate-pulse" />
                <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-[#1a0a10]/40 blur-[100px]" />
            </div>

            <GlassNavbar onJoin={() => window.location.href = "https://krownpass.com"} />

            {/* Hero */}
            <section className="relative z-10 pt-20 pb-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex m-10 items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8 animate-[fadeIn_0.5s_ease-out]">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-white/40 text-xs tracking-wider uppercase">
                            Support available 10 AM – 8 PM IST
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl text-white font-semibold font-serif mb-5 animate-[fadeIn_0.6s_ease-out]">
                        How can we help?
                    </h1>
                    <p className="text-white/35 text-base md:text-lg leading-relaxed max-w-lg mx-auto animate-[fadeIn_0.7s_ease-out]">
                        Find answers to common questions or reach out to our team.
                        We&apos;re here to make your Krown experience seamless.
                    </p>
                </div>
            </section>

            {/* Quick Links */}
            <section className="relative z-10 px-6 pb-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                            ),
                            title: "Email Us",
                            desc: "Get a response within 24 hours",
                            action: "support@krownpass.com",
                            href: "mailto:support@krownpass.com",
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                </svg>
                            ),
                            title: "Chat with Us",
                            desc: "Available on WhatsApp",
                            action: "+91 73051 38391",
                            href: "https://wa.me/+917305138391",
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            ),
                            title: "Response Time",
                            desc: "We typically reply within",
                            action: "Under 24 hours",
                            href: "#contact",
                        },
                    ].map((item, i: number) => (
                        <a
                            key={i}
                            href={item.href}
                            className="group relative rounded-2xl border border-white/[0.06] p-6 transition-all duration-500 hover:border-[#800020]/20 hover:shadow-lg hover:shadow-[#800020]/5 animate-[fadeIn_0.5s_ease-out]"
                            style={{
                                animationDelay: `${i * 100}ms`,
                                background: "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)",
                            }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#800020]/10 border border-[#800020]/15 flex items-center justify-center mb-4 text-[#cc3355] group-hover:bg-[#800020]/20 transition-colors duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-white text-sm font-medium mb-1">{item.title}</h3>
                            <p className="text-white/25 text-xs mb-3">{item.desc}</p>
                            <p className="text-[#cc3355] text-sm font-medium">{item.action}</p>
                        </a>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="relative z-10 px-6 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl text-white font-semibold font-serif mb-3">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-white/30 text-sm">
                            Quick answers to the most common questions about Krown
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {FAQ_ITEMS.map((cat: FaqCategory) => (
                            <button
                                key={cat.category}
                                onClick={() => {
                                    setActiveCategory(cat.category);
                                    setOpenFaq(null);
                                }}
                                className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${activeCategory === cat.category
                                    ? "bg-[#800020] text-white shadow-lg shadow-[#800020]/20"
                                    : "bg-white/[0.03] border border-white/[0.06] text-white/35 hover:text-white/60 hover:border-white/[0.1]"
                                    }`}
                            >
                                {cat.category}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {currentQuestions.map((faq: FaqItem, i: number) => {
                            const id = `${activeCategory}-${i}`;
                            const isOpen = openFaq === id;
                            return (
                                <div
                                    key={id}
                                    className={`rounded-xl border transition-all duration-500 overflow-hidden ${isOpen
                                        ? "border-[#800020]/20 bg-white/[0.02]"
                                        : "border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08]"
                                        }`}
                                    style={{ animationDelay: `${i * 60}ms` }}
                                >
                                    <button
                                        onClick={() => toggleFaq(id)}
                                        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                                    >
                                        <span className={`text-sm font-medium transition-colors duration-300 ${isOpen ? "text-white" : "text-white/50"}`}>
                                            {faq.q}
                                        </span>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? "bg-[#800020]/20 rotate-45" : "bg-white/[0.03]"}`}>
                                            <svg
                                                className={`w-3.5 h-3.5 transition-colors duration-300 ${isOpen ? "text-[#cc3355]" : "text-white/25"}`}
                                                fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </div>
                                    </button>
                                    <div className={`transition-all duration-500 ease-in-out ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                                        <div className="px-6 pb-5">
                                            <div className="h-[1px] bg-white/[0.04] mb-4" />
                                            <p className="text-white/35 text-sm leading-relaxed">{faq.a}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="relative z-10 px-6 pb-20" id="contact">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl text-white font-semibold font-serif mb-3">
                            Still need help?
                        </h2>
                        <p className="text-white/30 text-sm">
                            Send us a message and we&apos;ll get back to you within 24 hours
                        </p>
                    </div>

                    <div
                        className="rounded-2xl border border-white/[0.06] p-8 md:p-10"
                        style={{
                            background: "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)",
                            backdropFilter: "blur(40px)",
                        }}
                    >
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#800020]/40 to-transparent -mt-10 mb-8 -mx-10 md:-mx-10" />

                        {formStatus === "sent" ? (
                            <div className="text-center py-8 animate-[fadeIn_0.5s_ease-out]">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </div>
                                <h3 className="text-white text-lg font-semibold font-serif mb-2">Message Sent!</h3>
                                <p className="text-white/35 text-sm mb-6">We&apos;ll get back to you within 24 hours.</p>
                                <button
                                    onClick={() => setFormStatus("idle")}
                                    className="text-[#cc3355] text-sm hover:text-[#e04070] transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-5">

                                {/* Name & Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white/40 text-xs font-medium tracking-wider uppercase block mb-2">
                                            Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setField("name", e.target.value)}
                                            placeholder="Your name"
                                            className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/15 outline-none transition-colors duration-300 ${fieldErrors.name ? "border-red-500/50 focus:border-red-500/70" : "border-white/[0.06] focus:border-[#800020]/40"
                                                }`}
                                        />
                                        {fieldErrors.name && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="text-white/40 text-xs font-medium tracking-wider uppercase block mb-2">
                                            Email <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setField("email", e.target.value)}
                                            placeholder="your@email.com"
                                            className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/15 outline-none transition-colors duration-300 ${fieldErrors.email ? "border-red-500/50 focus:border-red-500/70" : "border-white/[0.06] focus:border-[#800020]/40"
                                                }`}
                                        />
                                        {fieldErrors.email && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.email}</p>}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="text-white/40 text-xs font-medium tracking-wider uppercase block mb-2">
                                        Phone (optional)
                                    </label>
                                    <div className="flex gap-3">
                                        <div className="flex items-center px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/30 text-sm whitespace-nowrap">
                                            +91
                                        </div>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                                            }
                                            placeholder="10-digit number"
                                            maxLength={10}
                                            className={`flex-1 bg-white/[0.03] border rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/15 outline-none transition-colors duration-300 ${fieldErrors.phone ? "border-red-500/50 focus:border-red-500/70" : "border-white/[0.06] focus:border-[#800020]/40"
                                                }`}
                                        />
                                    </div>
                                    {fieldErrors.phone && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.phone}</p>}
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="text-white/40 text-xs font-medium tracking-wider uppercase block mb-2">
                                        Subject <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        value={form.subject}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                            setField("subject", e.target.value as ContactSubject | "")
                                        }
                                        className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 text-sm outline-none transition-colors duration-300 appearance-none ${form.subject ? "text-white" : "text-white/25"
                                            } ${fieldErrors.subject ? "border-red-500/50 focus:border-red-500/70" : "border-white/[0.06] focus:border-[#800020]/40"
                                            }`}
                                        style={{ colorScheme: "dark" }}
                                    >
                                        <option value="" className="bg-[#1a1a1a] text-white/40">Select a topic</option>
                                        {SUBJECT_VALUES.map((val: ContactSubject) => (
                                            <option key={val} value={val} className="bg-[#1a1a1a] text-white">
                                                {SUBJECT_LABELS[val]}
                                            </option>
                                        ))}
                                    </select>
                                    {fieldErrors.subject && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.subject}</p>}
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="text-white/40 text-xs font-medium tracking-wider uppercase block mb-2">
                                        Message <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={form.message}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setField("message", e.target.value)}
                                        placeholder="Describe your issue or question in detail..."
                                        rows={5}
                                        className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/15 outline-none transition-colors duration-300 resize-none ${fieldErrors.message ? "border-red-500/50 focus:border-red-500/70" : "border-white/[0.06] focus:border-[#800020]/40"
                                            }`}
                                    />
                                    <div className="flex justify-between items-center mt-1.5">
                                        {fieldErrors.message
                                            ? <p className="text-red-400 text-xs">{fieldErrors.message}</p>
                                            : <span />
                                        }
                                        <p className={`text-xs ml-auto ${form.message.length > 4800 ? "text-red-400" : "text-white/20"}`}>
                                            {form.message.length}/5000
                                        </p>
                                    </div>
                                </div>

                                {/* Server error */}
                                {formStatus === "error" && serverError && (
                                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
                                        <p className="text-red-400 text-sm">{serverError}</p>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={formStatus === "sending"}
                                    className="w-full py-3.5 rounded-xl bg-[#800020] text-white text-sm font-medium hover:bg-[#9a0028] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-[#800020]/20"
                                >
                                    {formStatus === "sending" ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
