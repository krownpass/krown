"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchAllPlans } from "../services/plans";
import GlassNavbar from "../components/NavBar";
import { CheckCircle2, Sparkles } from "lucide-react";

interface Plan {
    subscription_id: number;
    subscription_name: string;
    description?: string;
    price: string;
    valid_days: number;
    features: { title: string; icon_url?: string }[];
    applies_to_all_cafes: boolean;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 2,
            staleTime: 1000 * 60 * 5,
        },
    },
});

const PlanCard = ({ plan, index }: { plan: Plan; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const router = useRouter();
    const isPopular = plan.subscription_name.toLowerCase().includes("premium");
    const formattedPrice = parseFloat(plan.price);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                }
            },
            { threshold: 0.4 }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => {
            if (cardRef.current) observer.unobserve(cardRef.current);
        };
    }, [hasAnimated]);

    const handleSelectPlan = () => {
        router.push(`/payment?plan_id=${plan.subscription_id}`);
    };

    return (
        <div
            ref={cardRef}
            className={`animate-slide-up relative flex flex-col p-6 md:p-8 rounded-[2rem] bg-gradient-to-b from-zinc-900/80 to-[#0a0a0a] border backdrop-blur-xl overflow-hidden transition-all duration-500 ${
                isPopular
                    ? "border-red-500/50 shadow-[0_0_40px_rgba(220,38,38,0.4)]"
                    : "border-red-800/50 shadow-[0_0_25px_rgba(220,38,38,0.25)]"
            }`}
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
        >
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[2rem]">
                <div
                    className={`absolute top-0 left-[-150%] w-[150%] h-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent skew-x-[30deg] blur-2xl transition-all duration-[1500ms] ease-in-out ${
                        hasAnimated ? "translate-x-[250%]" : ""
                    }`}
                ></div>
            </div>

            {isPopular && (
                <div className="absolute top-0 right-6 bg-gradient-to-b from-red-500 to-red-700 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-b-xl z-20 shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Popular
                </div>
            )}

            <div className="mb-6 relative z-10 text-center md:text-left">
                <h3 className="text-3xl font-bold tracking-tight mb-2 text-white">{plan.subscription_name}</h3>
                {plan.description && <p className="text-zinc-400 text-sm leading-relaxed font-light">{plan.description}</p>}
            </div>

            <div className="mb-8 relative z-10 text-center md:text-left">
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400">
                        ₹{formattedPrice}
                    </span>
                    <span className="text-zinc-500 font-medium">/{plan.valid_days} days</span>
                </div>
            </div>

            <div className="flex-grow mb-10 relative z-10 bg-black/20 p-5 rounded-2xl border border-white/5">
                <ul className="space-y-4">
                    {plan.features
                        ?.filter((feature) => feature?.title && feature.title.trim() !== "")
                        .map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                                <span className="text-zinc-300 font-light text-sm md:text-base">{feature.title}</span>
                            </li>
                        ))}
                </ul>
            </div>

            <button
                onClick={handleSelectPlan}
                className={`relative z-10 w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 mt-auto ${
                    isPopular
                        ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:bg-red-500 active:bg-red-700 active:scale-[0.97] active:shadow-none"
                        : "bg-zinc-100 text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-white active:bg-zinc-300 active:scale-[0.97] active:shadow-none"
                }`}
            >
                Select {plan.subscription_name}
            </button>
        </div>
    );
};

function PlansContent() {
    const { data: plans = [], isLoading, isError, error } = useQuery({
        queryKey: ["plans"],
        queryFn: async () => {
            const response = await fetchAllPlans();
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch plans");
            }

            return response.data as Plan[];
        },
    });

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
                <GlassNavbar onJoin={() => { }} onBecomePartner={() => { }} />
            </div>

            <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[40%] bg-red-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <main className="relative z-10 pt-28 pb-24 px-5 max-w-md md:max-w-7xl mx-auto">
                <div className="text-center mb-16 relative animate-slide-up" style={{ animationDelay: "0ms" }}>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 font-serif italic pr-2">KrownPass</span>
                    </h1>
                    <p className="text-zinc-400 text-base md:text-lg mx-auto font-light px-2">
                        Unlock exclusive perks, free drinks, and priority access across the city's most distinguished venues.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64 animate-slide-up" style={{ animationDelay: "150ms" }}>
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 border-red-500"></div>
                    </div>
                ) : isError ? (
                    <div className="text-center text-red-400 bg-red-950/30 border border-red-900/50 backdrop-blur-md p-4 rounded-2xl animate-slide-up" style={{ animationDelay: "150ms" }}>
                        {error instanceof Error ? error.message : "Failed to load plans."}
                    </div>
                ) : plans.length === 0 ? (
                    <div className="text-center text-zinc-500 font-light animate-slide-up" style={{ animationDelay: "150ms" }}>
                        The vault is currently closed. No active plans available.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <PlanCard key={plan.subscription_id} plan={plan} index={index} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function PlansClient() {
    return (
        <QueryClientProvider client={queryClient}>
            <PlansContent />
        </QueryClientProvider>
    );
}
