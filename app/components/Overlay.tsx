"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { WaitlistSchema } from "../schemas/waitlist";
import { z } from "zod";
import { joinWaitlist } from "../services/waitlist";

/* ================= INPUT ================= */

type InputProps = {
    label: string;
    placeholder: string;
    type?: string;
    value?: string;
    error?: boolean;
    onChange?: (value: string) => void;
};

export function Input({
    label,
    placeholder,
    type = "text",
    value,
    error,
    onChange,
}: InputProps) {
    return (
        <div>
            <label className="mb-1 block text-xs tracking-wide text-white/50">
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className={`w-full rounded-xl bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition ${error
                    ? "border border-[#C00148]"
                    : "border border-white/10 focus:border-[#C00148]"
                    }`}
            />
        </div>
    );
}

/* ================= OVERLAY ================= */

export default function JoinOverlay({
    onClose,
}: {
    onClose: () => void;
}) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);
    const glowTL = useRef<HTMLDivElement>(null);
    const glowBR = useRef<HTMLDivElement>(null);

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        full_name?: string;
        phone?: string;
        email?: string;
    }>({});

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
    });

    /* ================= OPEN / CLOSE PAGE TRANSITION ================= */
    useEffect(() => {
        const overlay = overlayRef.current;
        const card = cardRef.current;
        if (!overlay || !card) return;

        document.body.style.overflow = "hidden";

        gsap.set(overlay, { opacity: 0 });
        gsap.set(card, { y: "-120%", scale: 0.96 });

        gsap.timeline()
            .to(overlay, {
                opacity: 1,
                duration: 0.25,
                ease: "power2.out",
            })
            .to(card, {
                y: "0%",
                scale: 1,
                duration: 0.6,
                ease: "power4.out",
            }, "-=0.1");

        return () => {
            document.body.style.overflow = "";
            gsap.killTweensOf("*");
        };
    }, []);
    const handleClose = () => {
        const card = cardRef.current;
        const overlay = overlayRef.current;


        gsap.killTweensOf([glowTL.current, glowBR.current]);
        // Reset state
        setSubmitted(false);
        setErrors({});

        if (!card || !overlay) {
            onClose();
            return;
        }

        // Reset internal visuals BEFORE exit
        gsap.set(successRef.current, { opacity: 0, scale: 0.95 });
        gsap.set(formRef.current, { opacity: 1, scale: 1 });
        gsap.set(card, { height: "auto" });

        // Animate card DOWN
        gsap.to(card, {
            y: "120%",
            scale: 0.96,
            duration: 0.5,
            ease: "power4.in",
            onComplete: () => {
                gsap.set(overlay, {
                    opacity: 0,
                    duration: 0.35,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.set(overlay, { pointerEvents: "none" });

                        document.body.style.overflow = "";
                        onClose();
                    }
                });
            },
        });
    };
    useEffect(() => {
        if (!submitted) return;
        if (!formRef.current || !successRef.current || !cardRef.current) return;

        const tl = gsap.timeline();

        tl.to(formRef.current, {
            opacity: 0,
            scale: 0.96,
            duration: 0.3,
        })
            .to(
                cardRef.current,
                {
                    height: "380px",
                    duration: 0.4,
                    ease: "power3.out",
                },
                "-=0.1"
            )
            .to(
                successRef.current,
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                },
                "-=0.25"
            );

        gsap.to([glowTL.current, glowBR.current], {
            opacity: 0.6,
            scale: 1.1,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        return () => {
            tl.kill();
        };
    }, [submitted]);
    /* ================= RENDER ================= */

    useEffect(() => {
        if (!submitted) return;

        const timer = setTimeout(() => {
            handleClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [submitted]);
    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9999] bg-black opacity-0 "
        >
            {/* CLOSE */}
            <button
                onClick={handleClose}
                className="absolute right-6 top-6 z-20 rounded-full border border-white/20 p-2 text-white"
            >
                <X />
            </button>

            <div className="flex h-full items-center justify-center px-4">
                <div className="relative w-full flex justify-center">
                    <div
                        ref={cardRef}
                        className="relative w-[min(90vw,520px)] min-h-[min(90vh,660px)] overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl"
                    >
                        {/* GLOWS */}
                        <div
                            ref={glowTL}
                            className="pointer-events-none absolute inset-0 opacity-30"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(192,1,72,0.4), transparent 45%)",
                            }}
                        />
                        <div
                            ref={glowBR}
                            className="pointer-events-none absolute inset-0 opacity-25"
                            style={{
                                background:
                                    "linear-gradient(315deg, rgba(192,1,72,0.35), transparent 50%)",
                            }}
                        />

                        {/* GLASS */}
                        <div className="pointer-events-none absolute inset-0 bg-white/5" />

                        {/* FORM */}
                        <div
                            ref={formRef}
                            className="absolute inset-0 p-6 sm:p-10"
                        >
                            <div className="text-center">
                                <h2 className="text-[2rem] font-serif italic text-white">
                                    Be the first to experience
                                    <br />
                                    Chennai’s curated lifestyle.
                                </h2>
                                <p className="mt-4 text-sm text-white/60">
                                    Limited memberships. Early access to curated cafés,
                                    events, and community.
                                </p>
                            </div>

                            <form
                                className="mt-10 space-y-5"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    setErrors({});

                                    try {
                                        setLoading(true);

                                        const payload = WaitlistSchema.parse({
                                            full_name: form.full_name,
                                            phone: form.phone,
                                            email: form.email,
                                        });

                                        await joinWaitlist(payload);
                                        setSubmitted(true);
                                    } catch (err) {
                                        if (err instanceof z.ZodError) {
                                            const fieldErrors: any = {};
                                            err.issues.forEach((issue) => {
                                                const key = issue.path[0] as string;
                                                fieldErrors[key] = issue.message;
                                            });
                                            setErrors(fieldErrors);
                                        } else {
                                            setErrors({
                                                phone: "You're already on the waitlist",
                                            });
                                        }
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            >
                                <Input
                                    label="FULL NAME"
                                    placeholder="Enter your full name"
                                    value={form.full_name}
                                    error={!!errors.full_name}
                                    onChange={(v) => setForm({ ...form, full_name: v })}
                                />
                                {errors.full_name && (
                                    <p className="text-xs text-[#C00148]">{errors.full_name}</p>
                                )}
                                <Input
                                    label="WHATSAPP NUMBER"
                                    placeholder="+91 987654****"
                                    value={form.phone}
                                    error={!!errors.phone}
                                    onChange={(v) => setForm({ ...form, phone: v })}
                                />
                                {errors.phone && (
                                    <p className="text-xs text-[#C00148]">{errors.phone}</p>
                                )}
                                <Input
                                    label="EMAIL ADDRESS"
                                    placeholder="you@example.com"
                                    type="email"
                                    value={form.email}
                                    error={!!errors.email}
                                    onChange={(v) => setForm({ ...form, email: v })}
                                />
                                {errors.email && (
                                    <p className="text-xs text-[#C00148]">{errors.email}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-gradient-to-r from-[#800020] to-[#A00028] py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50"
                                >
                                    {loading ? "Joining..." : "Join the Waitlist"}
                                </button>
                            </form>
                        </div>

                        {/* SUCCESS */}
                        <div
                            ref={successRef}
                            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center opacity-0"
                        >
                            <div className="mb-4 text-3xl text-[#C00148]">👑</div>
                            <h2 className="text-2xl font-serif italic text-white">
                                You're on the list.
                            </h2>
                            <p className="mt-3 max-w-xs text-sm text-white/60">
                                We’ll notify you when your KROWN access is ready.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
