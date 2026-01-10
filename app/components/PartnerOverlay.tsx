"use client";

import { X, Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Input } from "./Overlay";
import { PartnerSchema } from "../schemas/waitlist";
import { requestPartner } from "../services/waitlist";
import z from "zod";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function PartnerOverlay({ open, onClose }: Props) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);
    const submitBtnRef = useRef<HTMLButtonElement>(null);

    const [mounted, setMounted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        cafe_name: "",
        full_name: "",
        phone: "",
        email: "",
    });

    /* ================= BODY SCROLL LOCK ================= */
    useEffect(() => {
        if (!open) return;

        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [open]);

    /* ================= MOUNT ================= */
    useEffect(() => {
        if (open) {
            setMounted(true);
            setSubmitted(false);
            setError(null);
        }
    }, [open]);

    /* ================= OPEN ANIMATION ================= */
    useLayoutEffect(() => {
        if (!mounted) return;

        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(cardRef.current, { opacity: 0, y: 20, scale: 0.96 });

        const tl = gsap.timeline();
        tl.to(overlayRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: "power1.out",
        }).to(
            cardRef.current,
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "power3.out",
            },
            "-=0.1"
        );

        return () => {
            tl.kill();
        };
    }, [mounted]);

    /* ================= FORM → SUCCESS ================= */
    useLayoutEffect(() => {
        if (!submitted) return;

        gsap.set(successRef.current, {
            opacity: 0,
            pointerEvents: "none",
        });

        const tl = gsap.timeline();

        tl.to(submitBtnRef.current, {
            scale: 0.96,
            duration: 0.12,
        })
            .to(submitBtnRef.current, {
                scale: 1,
                duration: 0.18,
            })
            .to(formRef.current, {
                opacity: 0,
                scale: 0.98,
                duration: 0.35,
            })
            .to(successRef.current, {
                opacity: 1,
                duration: 0.45,
                onStart: () => {
                    successRef.current!.style.pointerEvents = "auto";
                },
            });

        return () => {
            tl.kill();
        };
    }, [submitted]);

    /* ================= CLOSE ================= */
    const handleClose = () => {
        gsap.timeline({
            onComplete: () => {
                setMounted(false);
                onClose();
            },
        })
            .to(cardRef.current, {
                opacity: 0,
                y: 10,
                scale: 0.97,
                duration: 0.25,
            })
            .to(overlayRef.current, {
                opacity: 0,
                duration: 0.2,
            });
    };

    if (!mounted) return null;

    return (
        <div
            ref={overlayRef}

            className="fixed inset-0 z-[999] bg-black overflow-y-auto"
        >
            {/* Close */}
            <button
                onClick={handleClose}
                className="absolute top-6 right-6 z-50 flex items-center gap-2 text-sm text-white/70 hover:text-white"
            >
                <X className="h-4 w-4" />
                Close
            </button>

            {/* PAGE */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-24">
                {/* HEADER */}
                <div className="mb-12 max-w-2xl">
                    <h1 className="font-serif italic text-[2.4rem] sm:text-[2.8rem] text-white">
                        Partner with Krown
                    </h1>
                    <p className="mt-4 text-sm text-white/60">
                        Join Chennai’s premium café membership network and host curated community experiences.
                    </p>
                </div>

                {/* CARD */}
                <div className="relative flex justify-center">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-[-80px] bg-[radial-gradient(circle,rgba(141,0,46,0.35),transparent_70%)] blur-[90px]"
                    />

                    <div
                        ref={cardRef}
                        className="relative w-full max-w-[520px] min-h-[520px] rounded-[14px] border border-white/10 bg-[#0e0e0e] px-6 sm:px-8 py-8 sm:py-10 shadow-[0_40px_120px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        {/* STACK */}
                        <div className="relative min-h-[440px]">
                            {/* FORM */}
                            <div
                                ref={formRef}
                                className="absolute inset-0"
                                style={{
                                    opacity: submitted ? 0 : 1,
                                    pointerEvents: submitted ? "none" : "auto",
                                }}
                            >
                                <form
                                    className="space-y-5 sm:space-y-6"
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        setError(null);

                                        try {
                                            setLoading(true);

                                            const payload =
                                                PartnerSchema.parse({
                                                    cafe_name: form.cafe_name,
                                                    full_name: form.full_name,
                                                    phone: form.phone,

                                                    email: form.email,
                                                });

                                            await requestPartner(payload);
                                            setSubmitted(true);
                                        } catch (err) {
                                            if (err instanceof z.ZodError) {
                                                setError(
                                                    err.issues?.[0]?.message ??
                                                    "Invalid input"
                                                );
                                            } else {
                                                setError(
                                                    "You're already on the waitlist"
                                                );
                                            }
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                >
                                    <Input
                                        label="Café Name *"
                                        value={form.cafe_name}
                                        onChange={(v) =>
                                            setForm({
                                                ...form,
                                                cafe_name: v,
                                            })
                                        }
                                        placeholder="Enter café name"
                                    />

                                    <Input
                                        label="Owner / Promoter / In-Charge Name *"
                                        value={form.full_name}
                                        onChange={(v) =>
                                            setForm({
                                                ...form,
                                                full_name: v,
                                            })
                                        }
                                        placeholder="Enter your name"
                                    />


                                    <Input
                                        label="Contact Phone Number *"
                                        value={form.phone}
                                        onChange={(v) =>
                                            setForm({
                                                ...form,
                                                phone: v,
                                            })
                                        }

                                        placeholder="+91 XXXXX XXXXX"
                                    />

                                    <Input
                                        label="Contact Email Address *"
                                        type="email"
                                        value={form.email}
                                        onChange={(v) =>
                                            setForm({
                                                ...form,
                                                email: v,
                                            })
                                        }

                                        placeholder="cafe@example.com"
                                    />
                                    <button
                                        ref={submitBtnRef}
                                        type="submit"
                                        disabled={loading}
                                        className="mt-4 w-full rounded-xl bg-[#8d002e] py-3 text-sm font-medium text-white hover:bg-[#a0003c] transition disabled:opacity-60"
                                    >
                                        Submit Partnership Request
                                    </button>

                                    {error && (
                                        <p className="text-xs text-red-400">
                                            {error}
                                        </p>
                                    )}
                                </form>

                                <p className="mt-6 text-center text-xs text-white/40">
                                    Our team will review your details and reach out shortly.
                                </p>
                            </div>

                            {/* SUCCESS */}
                            <div
                                ref={successRef}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                                style={{
                                    opacity: 0,
                                    pointerEvents: "none",
                                }}
                            >
                                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#8d002e]">
                                    <Check className="h-5 w-5 text-[#8d002e]" />
                                </div>

                                <h2 className="font-serif text-xl italic text-white">
                                    Partnership request received
                                </h2>

                                <p className="mt-4 max-w-sm text-sm text-white/60">
                                    Thank you for reaching out. Our team will review your details and get in touch shortly.
                                </p>

                                <p className="mt-2 text-xs text-white/40">
                                    This usually takes 24–48 hours.
                                </p>

                                <button
                                    onClick={handleClose}
                                    className="mt-8 rounded-lg bg-[#8d002e] px-6 py-2 text-sm text-white hover:bg-[#a0003c]"
                                >
                                    Back to Home
                                </button>

                                <button className="mt-3 text-xs text-white/50 hover:text-white">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
