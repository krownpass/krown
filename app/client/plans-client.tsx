"use client";

import { useEffect, useRef, useState } from "react";
import GlassNavbar from "../components/NavBar";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ---------------------------------------------------------------------------
//  Types
// ---------------------------------------------------------------------------

interface Plan {
    subscription_id: number;
    subscription_name: string;
    description: string;
    price: number;
    valid_days: number;
    features: { title: string; icon_url: string }[];
    id: number;
    applies_to_all_cafes: boolean;
    cafe_names: string;
}

interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayFailedResponse {
    error: {
        code: string;
        description: string;
        source: string;
        step: string;
        reason: string;
        metadata?: { order_id?: string; payment_id?: string };
    };
}

declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => {
            open: () => void;
            on: (event: string, handler: (response: RazorpayFailedResponse) => void) => void;
        };
    }
}

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

const sanitizeParam = (value: string, maxLen = 200): string => {
    const cleaned = value.replace(/[^a-zA-Z0-9 _.\-]/g, "").slice(0, maxLen);
    return encodeURIComponent(cleaned);
};

const forceRedirectToApp = (deepLink: string) => {
    try {
        const searchParams = new URL(window.location.href).searchParams;
        const source = searchParams.get('source');
        const redirectUrl = searchParams.get('redirect_url');

        if (source === 'web' && redirectUrl) {
            const externalUrl = new URL(redirectUrl);
            const parsedDeepLink = new URL(deepLink.replace("krown://", "http://dummy/"));
            
            parsedDeepLink.searchParams.forEach((value, key) => {
                externalUrl.searchParams.set(key, value);
            });
            window.location.replace(externalUrl.toString());
            return;
        }
    } catch {
        // Safe fallback backwards to standard native app handling
    }

    const userAgent = navigator.userAgent || "";
    const isAndroid = /android/i.test(userAgent);

    if (isAndroid) {
        const intentUrl = `intent://${deepLink.replace("krown://", "")}#Intent;scheme=krown;package=com.krown.app;end;`;
        window.location.replace(intentUrl);
    } else {
        window.location.replace(deepLink);
    }

    setTimeout(() => {
        window.close();
    }, 1500);
};

// ---------------------------------------------------------------------------
//  Card UI Sub-Component (Handles Scroll Animation)
// ---------------------------------------------------------------------------
const PlanCard = ({ 
    plan, 
    index, 
    isPaymentLoading, 
    onPayment 
}: { 
    plan: Plan; 
    index: number; 
    isPaymentLoading: boolean; 
    onPayment: (plan: Plan) => void 
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    const isPopular = plan.subscription_name.toLowerCase().includes("premium");
    const features = plan.features || [];

    useEffect(() => {
        // Trigger animation when 70% of the card is visible on the screen
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                }
            },
            { threshold: 0.7 } 
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => {
            if (cardRef.current) observer.unobserve(cardRef.current);
        };
    }, [hasAnimated]);

    return (
        <div
            ref={cardRef}
            className={`animate-slide-up relative flex flex-col p-6 md:p-8 rounded-[2rem] bg-gradient-to-b from-zinc-900/80 to-[#0a0a0a] border backdrop-blur-xl overflow-hidden transition-all duration-500 group ${
                isPopular
                    ? "border-red-500/50 shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:border-red-500/80"
                    : "border-red-800/50 shadow-[0_0_25px_rgba(220,38,38,0.25)] hover:border-red-700/60"
            } hover:-translate-y-2`}
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
        >
            {/* The Wave Effect: Triggers on group-hover (desktop) AND when hasAnimated is true (mobile scroll) */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[2rem]">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className={`absolute top-0 left-[-150%] w-[150%] h-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent skew-x-[30deg] blur-2xl transition-all duration-[1500ms] ease-in-out group-hover:translate-x-[250%] ${
                    hasAnimated ? "translate-x-[250%]" : ""
                }`}></div>
            </div>

            {isPopular && (
                <div className="absolute top-0 right-6 bg-gradient-to-b from-red-500 to-red-700 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-b-xl z-20 shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Popular
                </div>
            )}

            <div className="mb-6 relative z-10 text-center md:text-left">
                <h3 className="text-3xl font-bold tracking-tight mb-2 text-white">{plan.subscription_name}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">{plan.description}</p>
            </div>

            <div className="mb-8 relative z-10 text-center md:text-left">
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400">
                        ₹{plan.price}
                    </span>
                    <span className="text-zinc-500 font-medium">/{plan.valid_days} days</span>
                </div>
            </div>

            <div className="flex-grow mb-10 relative z-10 bg-black/20 p-5 rounded-2xl border border-white/5">
                <ul className="space-y-4">
                    {features
                        .filter((feature) => feature?.title && feature.title.trim() !== "")
                        .map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                {feature.icon_url ? (
                                    <img
                                        src={feature.icon_url}
                                        alt={`${feature.title} icon`}
                                        className="w-5 h-5 shrink-0 mt-0.5 object-contain"
                                    />
                                ) : (
                                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                                )}
                                <span className="text-zinc-300 font-light text-sm md:text-base">{feature.title}</span>
                            </li>
                        ))}
                </ul>
            </div>

            <button
                onClick={() => onPayment(plan)}
                disabled={isPaymentLoading}
                className={`relative z-10 w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 mt-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isPopular
                        ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:bg-red-500 active:bg-red-700 active:scale-[0.97] active:shadow-none"
                        : "bg-zinc-100 text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-white active:bg-zinc-300 active:scale-[0.97] active:shadow-none"
                }`}
            >
                {isPaymentLoading ? "Processing..." : `Select ${plan.subscription_name}`}
            </button>
        </div>
    );
};

// ---------------------------------------------------------------------------
//  Component
// ---------------------------------------------------------------------------

export default function PlansClient() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const paymentHandledRef = useRef(false);
    const razorpayReady = useRef(false);
    const router = useRouter();

    // Load Razorpay SDK
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => { razorpayReady.current = true; };
        document.body.appendChild(script);
    }, []);

    const fetchPlans = async () => {
        const res = await fetch("/api/plans", { credentials: "include" });
        if (res.status === 401) {
            throw new Error("Unauthorized");
        }
        if (!res.ok) {
            throw new Error("Failed to load plans");
        }
        const json = await res.json();
        return json.data as Plan[];
    };

    const { data: plans = [], isLoading, isError, error } = useQuery({
        queryKey: ["plans"],
        queryFn: fetchPlans,
        retry: false,
    });

    const isUnauthorized = isError && error?.message === "Unauthorized";

    useEffect(() => {
        if (isUnauthorized) {
            toast.error("No token found. Plans page can be visible from mobile only", {
                duration: 4000,
                style: {
                    background: '#333',
                    color: '#fff',
                    border: '1px solid #555'
                }
            });
            router.push("/");
        }
    }, [isUnauthorized, router]);

    if (isUnauthorized) {
        return null; // Return null while redirecting
    }

    const handlePayment = async (plan: Plan) => {
        if (isPaymentLoading) return;
        setIsPaymentLoading(true);

        try {
            const res = await fetch(`/api/plans/${plan.subscription_id}/pay`, {
                method: "POST",
                credentials: "include",
            });

            if (res.status === 401) {
                forceRedirectToApp("krown://payment/failure?status=expired&reason=session_expired");
                return;
            }

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || "Failed to start payment");
            }

            const data = await res.json();
            const { sdkPayload, transaction_id } = data;

            paymentHandledRef.current = false;

            if (!razorpayReady.current || !window.Razorpay) {
                await new Promise<void>((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('Razorpay SDK failed to load')), 10000);
                    const check = setInterval(() => {
                        if (window.Razorpay) {
                            clearInterval(check);
                            clearTimeout(timeout);
                            resolve();
                        }
                    }, 200);
                });
            }

            const options: Record<string, unknown> = {
                key: sdkPayload.keyId,
                amount: sdkPayload.amount,
                currency: sdkPayload.currency,
                name: "Krown Subscription",
                description: `Subscribe to ${plan.subscription_name}`,
                order_id: sdkPayload.orderId,
                prefill: {
                     contact: sdkPayload.prefill.contact
                },
                theme: { color: "#C11E38" },
                handler: async function (_response: RazorpaySuccessResponse) {
                    paymentHandledRef.current = true;
                    setIsProcessing(true);
                    const maxAttempts = 10;
                    let attempt = 0;
                    let paymentConfirmed = false;

                    while (attempt < maxAttempts) {
                        attempt++;
                        try {
                            const pollRes = await fetch(
                                `/api/plans/payment-status/${transaction_id}`,
                                { credentials: "include" }
                            );

                            if (pollRes.ok) {
                                const pollData = await pollRes.json();

                                if (pollData.status === 'success' || pollData.success === true) {
                                    paymentConfirmed = true;
                                    break;
                                } else if (pollData.status === 'failed') {
                                    setIsProcessing(false);
                                    forceRedirectToApp(`krown://payment/failure?status=failed&reason=payment_failed`);
                                    return;
                                }
                            }
                        } catch (error) {
                            // network error — retry on next iteration
                            if (attempt === maxAttempts) {
                                setIsProcessing(false);
                                forceRedirectToApp(`krown://payment/failure?status=error&reason=verification_timeout`);
                                return;
                            }
                        }

                        await new Promise(r => setTimeout(r, 2000));
                    }

                    setIsProcessing(false);

                    if (paymentConfirmed) {
                        forceRedirectToApp(`krown://payment/success?status=success&transaction_id=${sanitizeParam(transaction_id)}`);
                    } else {
                        forceRedirectToApp(`krown://payment/success?status=pending&transaction_id=${sanitizeParam(transaction_id)}`);
                    }
                },
                modal: {
                    ondismiss: function() {
                         if (!paymentHandledRef.current) {
                             if (document.hidden) {
                                 const handleVisibility = () => {
                                     if (!document.hidden && !paymentHandledRef.current) {
                                         document.removeEventListener('visibilitychange', handleVisibility);
                                         setTimeout(() => {
                                             if (!paymentHandledRef.current) {
                                                 forceRedirectToApp(`krown://payment/failure?status=cancelled`);
                                             }
                                         }, 3000);
                                     }
                                 };
                                 document.addEventListener('visibilitychange', handleVisibility);
                                 return;
                             }

                             setTimeout(() => {
                                 if (!paymentHandledRef.current && !document.hidden) {
                                     forceRedirectToApp(`krown://payment/failure?status=cancelled`);
                                 }
                             }, 2000);
                         }
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            
            rzp.on("payment.failed", function (response: RazorpayFailedResponse) {
                    paymentHandledRef.current = true;
                    const reason = sanitizeParam(response.error?.description || "Payment failed");
                    forceRedirectToApp(`krown://payment/failure?status=failed&reason=${reason}`);
            });
            
            rzp.open();

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            const reason = sanitizeParam(message);
            forceRedirectToApp(`krown://payment/failure?status=error&reason=${reason}`);
        } finally {
            setIsPaymentLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30 overflow-x-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    opacity: 0;
                    animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}} />

            <div className="relative z-30">
                <GlassNavbar
                    onJoin={() => { }}
                    onBecomePartner={() => { }}
                />
            </div>

            {isProcessing && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment...</h2>
                    <p className="text-zinc-400">Please do not close this page.</p>
                </div>
            )}

            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20 relative animate-slide-up" style={{ animationDelay: '0ms' }}>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 font-serif italic pr-2">KrownPass</span>
                    </h1>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Unlock exclusive perks, free drinks, and priority access across the city's most distinguished venues.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64 animate-slide-up" style={{ animationDelay: '150ms' }}>
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 border-red-500"></div>
                    </div>
                ) : isError ? (
                    <div className="text-center text-red-400 bg-red-950/30 border border-red-900/50 backdrop-blur-md p-4 rounded-2xl max-w-md mx-auto animate-slide-up" style={{ animationDelay: '150ms' }}>
                        Failed to load plans. Please try again later.
                    </div>
                ) : plans.length === 0 ? (
                    <div className="text-center text-zinc-500 font-light animate-slide-up" style={{ animationDelay: '150ms' }}>
                        The vault is currently closed. No active plans available.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {plans.map((plan, index) => (
                            <PlanCard 
                                key={plan.subscription_id} 
                                plan={plan} 
                                index={index} 
                                isPaymentLoading={isPaymentLoading} 
                                onPayment={handlePayment} 
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
