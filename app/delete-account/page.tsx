"use client";

import { useState, useEffect, useRef } from "react";
import GlassNavbar from "../components/NavBar";

const STEPS = { INFO: 0, VERIFY: 1, CONFIRM: 2, SUCCESS: 3 } as const;
type Step = (typeof STEPS)[keyof typeof STEPS];

const DELETE_ITEMS = [
    "Your profile and personal information",
    "Booking history and event registrations",
    "Krown Pass membership and benefits",
    "Redeemed drinks and active rewards",
    "Saved cafés and favourites",
];

const REASONS = [
    "I don't use this app anymore",
    "I found a better alternative",
    "Privacy concerns",
    "Too many notifications",
    "App performance issues",
    "Other",
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.krownpass.com";

export default function DeleteAccountPage() {
    const [step, setStep] = useState<Step>(STEPS.INFO);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [sessionId, setSessionId] = useState("");
    const [reason, setReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(0);

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Timer countdown
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    // ─── SEND OTP ───
    const handleSendOtp = async () => {
        if (!phone || phone.length < 10) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/api/auth/otp/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: `+91${phone.replace(/\D/g, "").slice(-10)}`,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to send OTP");
            setSessionId(data.data?.session_id || data.session_id);
            setTimer(30);
            setStep(STEPS.VERIFY);
        } catch (e: any) {
            setError(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // ─── VERIFY OTP ───
    const handleVerifyOtp = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            setError("Please enter the 6-digit OTP");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/api/auth/delete-account/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: `+91${phone.replace(/\D/g, "").slice(-10)}`,
                    otp: code,
                    session_id: sessionId,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Invalid OTP");
            setStep(STEPS.CONFIRM);
        } catch (e: any) {
            setError(e.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    // ─── DELETE ACCOUNT ───
    const handleDelete = async () => {
        if (!reason) {
            setError("Please select a reason");
            return;
        }
        if (reason === "Other" && !customReason.trim()) {
            setError("Please provide your reason");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/api/auth/delete-account`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: `+91${phone.replace(/\D/g, "").slice(-10)}`,
                    session_id: sessionId,
                    reason: reason === "Other" ? customReason : reason,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete account");
            setStep(STEPS.SUCCESS);
        } catch (e: any) {
            setError(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // ─── OTP HANDLERS ───
    const handleOtpChange = (value: string, index: number) => {
        const clean = value.replace(/\D/g, "");
        const newOtp = [...otp];
        newOtp[index] = clean;
        setOtp(newOtp);
        if (clean && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    // ─── SPINNER ───
    const Spinner = () => (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );

    return (
        <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden p-12">
            {/* ─── Ambient Background ─── */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#800020]/10 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#800020]/5 blur-[120px] animate-pulse" />
            </div>

            {/* ─── Header ─── */}
            <GlassNavbar onJoin={() => window.location.href = "https://krownpass.com"} />
            {/* ─── Main ─── */}
            <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-76px)] px-6 py-12">
                <div className="w-full max-w-md">
                    {/* ─── Step Indicator ─── */}
                    {step !== STEPS.SUCCESS && (
                        <div className="flex items-center justify-center gap-2 mb-10">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500 ${step === i
                                            ? "bg-[#800020] text-white shadow-lg shadow-[#800020]/30 scale-110"
                                            : step > i
                                                ? "bg-[#800020]/30 text-white/60"
                                                : "bg-white/5 text-white/20"
                                            }`}
                                    >
                                        {step > i ? "✓" : i + 1}
                                    </div>
                                    {i < 2 && (
                                        <div
                                            className={`w-12 h-[1px] transition-all duration-500 ${step > i ? "bg-[#800020]/50" : "bg-white/5"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ─── Card ─── */}
                    <div
                        className="relative rounded-2xl border border-white/[0.06] overflow-hidden"
                        style={{
                            background:
                                "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                            backdropFilter: "blur(40px)",
                        }}
                    >
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#800020]/60 to-transparent" />

                        <div className="p-8">
                            {/* ════════ STEP 1: INFO ════════ */}
                            {step === STEPS.INFO && (
                                <div className="animate-[fadeIn_0.5s_ease-out]">
                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-2xl bg-[#800020]/10 border border-[#800020]/20 flex items-center justify-center mb-6">
                                        <svg
                                            className="w-7 h-7 text-[#cc3355]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                            />
                                        </svg>
                                    </div>

                                    <h1 className="text-2xl text-white mb-2 font-semibold font-serif">
                                        Delete Your Account
                                    </h1>
                                    <p className="text-white/40 text-sm leading-relaxed mb-8">
                                        We&apos;re sorry to see you go. Before proceeding, please
                                        understand what happens when you delete your Krown account.
                                    </p>

                                    {/* What gets deleted */}
                                    <p className="text-white/60 text-xs font-medium tracking-wider uppercase mb-3">
                                        What will be deleted
                                    </p>
                                    <div className="space-y-3 mb-8">
                                        {DELETE_ITEMS.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3 animate-[slideUp_0.4s_ease-out_forwards] opacity-0"
                                                style={{ animationDelay: `${i * 80}ms` }}
                                            >
                                                <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-red-400 text-[10px]">✕</span>
                                                </div>
                                                <span className="text-white/50 text-sm">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Notice */}
                                    <div className="bg-white/[0.02] rounded-xl border border-white/[0.04] p-4 mb-8">
                                        <p className="text-white/30 text-xs leading-relaxed">
                                            <span className="text-white/50 font-medium">Note:</span>{" "}
                                            Your data will be permanently deleted within 30 days.
                                            Transaction records may be retained for legal compliance as
                                            required by Indian law.
                                        </p>
                                    </div>

                                    {/* Phone input */}
                                    <label className="text-white/40 text-xs font-medium tracking-wider uppercase block mb-2">
                                        Verify your phone number
                                    </label>
                                    <div className="flex gap-3 mb-6">
                                        <div className="flex items-center px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 text-sm">
                                            +91
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(
                                                    e.target.value.replace(/\D/g, "").slice(0, 10)
                                                );
                                                setError("");
                                            }}
                                            placeholder="Enter your phone number"
                                            maxLength={10}
                                            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#800020]/40 transition-colors duration-300"
                                        />
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3 mb-4">
                                            <p className="text-red-400 text-sm">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleSendOtp}
                                        disabled={loading || phone.length < 10}
                                        className="w-full py-3.5 rounded-xl bg-[#800020] text-white text-sm font-medium hover:bg-[#9a0028] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-[#800020]/20"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Spinner /> Sending OTP...
                                            </span>
                                        ) : (
                                            "Continue with OTP Verification"
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* ════════ STEP 2: VERIFY OTP ════════ */}
                            {step === STEPS.VERIFY && (
                                <div className="animate-[fadeIn_0.5s_ease-out]">
                                    <button
                                        onClick={() => {
                                            setStep(STEPS.INFO);
                                            setOtp(["", "", "", "", "", ""]);
                                            setError("");
                                        }}
                                        className="text-white/30 text-sm hover:text-white/60 transition-colors mb-6"
                                    >
                                        ← Back
                                    </button>

                                    <div className="w-14 h-14 rounded-2xl bg-[#800020]/10 border border-[#800020]/20 flex items-center justify-center mb-6">
                                        <svg
                                            className="w-7 h-7 text-[#cc3355]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                                            />
                                        </svg>
                                    </div>

                                    <h1 className="text-2xl text-white mb-2 font-semibold font-serif">
                                        Verify Your Identity
                                    </h1>
                                    <p className="text-white/40 text-sm mb-8">
                                        We&apos;ve sent a 6-digit OTP to{" "}
                                        <span className="text-white/60">+91 {phone}</span>
                                    </p>

                                    {/* OTP Inputs */}
                                    <div className="flex gap-3 justify-center mb-6">
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                ref={(el) => {
                                                    otpRefs.current[i] = el;
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e.target.value, i)}
                                                onKeyDown={(e) => handleOtpKeyDown(e, i)}
                                                maxLength={1}
                                                autoFocus={i === 0}
                                                className="w-12 h-14 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-center text-lg font-medium outline-none focus:border-[#800020]/60 focus:bg-white/[0.05] transition-all duration-300"
                                            />
                                        ))}
                                    </div>

                                    {/* Resend */}
                                    <div className="text-center mb-6">
                                        {timer > 0 ? (
                                            <p className="text-white/20 text-sm">
                                                Resend in 00:{String(timer).padStart(2, "0")}
                                            </p>
                                        ) : (
                                            <button
                                                onClick={handleSendOtp}
                                                className="text-[#cc3355] text-sm hover:text-[#e04070] transition-colors"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3 mb-4">
                                            <p className="text-red-400 text-sm">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={loading || otp.join("").length < 6}
                                        className="w-full py-3.5 rounded-xl bg-[#800020] text-white text-sm font-medium hover:bg-[#9a0028] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-[#800020]/20"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Spinner /> Verifying...
                                            </span>
                                        ) : (
                                            "Verify OTP"
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* ════════ STEP 3: CONFIRM ════════ */}
                            {step === STEPS.CONFIRM && (
                                <div className="animate-[fadeIn_0.5s_ease-out]">
                                    <button
                                        onClick={() => {
                                            setStep(STEPS.VERIFY);
                                            setError("");
                                        }}
                                        className="text-white/30 text-sm hover:text-white/60 transition-colors mb-6"
                                    >
                                        ← Back
                                    </button>

                                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                                        <svg
                                            className="w-7 h-7 text-red-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                            />
                                        </svg>
                                    </div>

                                    <h1 className="text-2xl text-white mb-2 font-semibold font-serif">
                                        Final Confirmation
                                    </h1>
                                    <p className="text-white/40 text-sm mb-8">
                                        This action is{" "}
                                        <span className="text-red-400 font-medium">
                                            permanent and irreversible
                                        </span>
                                        . Please tell us why you&apos;re leaving.
                                    </p>

                                    {/* Reasons */}
                                    <div className="space-y-2 mb-6">
                                        {REASONS.map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => {
                                                    setReason(r);
                                                    setError("");
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-300 ${reason === r
                                                    ? "bg-[#800020]/10 border-[#800020]/30 text-white"
                                                    : "bg-white/[0.02] border-white/[0.04] text-white/40 hover:border-white/[0.08] hover:text-white/60"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${reason === r
                                                            ? "border-[#800020] bg-[#800020]"
                                                            : "border-white/20"
                                                            }`}
                                                    >
                                                        {reason === r && (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                        )}
                                                    </div>
                                                    {r}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom reason */}
                                    {reason === "Other" && (
                                        <textarea
                                            value={customReason}
                                            onChange={(e) => setCustomReason(e.target.value)}
                                            placeholder="Please tell us your reason..."
                                            rows={3}
                                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#800020]/40 transition-colors duration-300 resize-none mb-6"
                                        />
                                    )}

                                    {error && (
                                        <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3 mb-4">
                                            <p className="text-red-400 text-sm">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Spinner /> Deleting Account...
                                            </span>
                                        ) : (
                                            "Permanently Delete My Account"
                                        )}
                                    </button>

                                    <button
                                        onClick={() =>
                                            (window.location.href = "https://krownpass.com")
                                        }
                                        className="w-full py-3 mt-3 rounded-xl text-white/40 text-sm hover:text-white/60 transition-colors duration-300"
                                    >
                                        Cancel — Keep My Account
                                    </button>
                                </div>
                            )}

                            {/* ════════ STEP 4: SUCCESS ════════ */}
                            {step === STEPS.SUCCESS && (
                                <div className="animate-[fadeIn_0.5s_ease-out] text-center py-4">
                                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                                        <svg
                                            className="w-8 h-8 text-green-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m4.5 12.75 6 6 9-13.5"
                                            />
                                        </svg>
                                    </div>

                                    <h1 className="text-2xl text-white mb-3 font-semibold font-serif">
                                        Account Deleted
                                    </h1>
                                    <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                                        Your account and all associated data will be permanently
                                        removed within 30 days. We&apos;re sorry to see you go.
                                    </p>

                                    <div className="bg-white/[0.02] rounded-xl border border-white/[0.04] p-4 mb-8 text-left">
                                        <p className="text-white/30 text-xs leading-relaxed">
                                            <span className="text-white/50 font-medium">
                                                What happens next:
                                            </span>{" "}
                                            You&apos;ll be logged out from all devices. Your data will
                                            be queued for deletion. If you change your mind, contact us
                                            at{" "}
                                            <a
                                                href="mailto:support@krownpass.com"
                                                className="text-[#cc3355]"
                                            >
                                                support@krownpass.com
                                            </a>{" "}
                                            within 30 days.
                                        </p>
                                    </div>

                                    <a
                                        href="https://krownpass.com"
                                        className="inline-block w-full py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/60 text-sm font-medium hover:bg-white/[0.08] transition-all duration-300"
                                    >
                                        Return to Krown
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-center text-white/15 text-xs mt-8">
                        © 2026 Krown Private Limited. All rights reserved.
                    </p>
                </div>
            </main>
        </div>
    );
}
