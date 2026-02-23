"use client";

import { useEffect, useState } from "react";
// Adjust import paths based on your project structure
import { fetchAllPlans } from "../../services/plans";
import GlassNavbar from "../../components/NavBar";
import { CheckCircle2, Sparkles } from "lucide-react";

interface Plan {
    subscription_id: number;
    subscription_name: string;
    description: string;
    price: number;
    duration_days: number;
    free_drinks: number;
    redemption_limit_per_cafe: number;
    features: { title: string; icon_url: string }[];
    is_active: boolean;
}

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const data = await fetchAllPlans();
                setPlans(data.data || []);
            } catch (err) {
                setError("Failed to load plans. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadPlans();
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30 overflow-x-hidden">
            {/* Custom keyframes for the initial load animation */}
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

            {/* Background Ambient Glow */}
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

                {loading ? (
                    <div className="flex justify-center items-center h-64 animate-slide-up" style={{ animationDelay: '150ms' }}>
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 border-red-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-400 bg-red-950/30 border border-red-900/50 backdrop-blur-md p-4 rounded-2xl max-w-md mx-auto animate-slide-up" style={{ animationDelay: '150ms' }}>
                        {error}
                    </div>
                ) : plans.length === 0 ? (
                    <div className="text-center text-zinc-500 font-light animate-slide-up" style={{ animationDelay: '150ms' }}>
                        The vault is currently closed. No active plans available.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {plans.map((plan, index) => {
                            const isPopular = plan.subscription_name.toLowerCase().includes('premium');

                            return (
                                <div
                                    key={plan.subscription_id}
                                    // Staggered delay for each card so they cascade in
                                    className={`animate-slide-up group relative flex flex-col p-8 rounded-[2rem] bg-gradient-to-b from-zinc-900/60 to-black border backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_8px_40px_-12px_rgba(220,38,38,0.25)] overflow-hidden ${isPopular ? 'border-red-500/30 hover:border-red-500/60' : 'border-white/5 hover:border-white/20'
                                        }`}
                                    style={{ animationDelay: `${(index + 1) * 150}ms` }}
                                >
                                    {/* --- THE ONE-WAY LIGHT SWEEP --- */}
                                    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[2rem]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                        <div className="absolute top-0 left-[-100%] w-full h-full opacity-0 transition-none group-hover:left-[200%] group-hover:opacity-100 group-hover:transition-all group-hover:duration-[1500ms] group-hover:ease-in-out">
                                            <div className="w-[150%] h-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent skew-x-[30deg] blur-xl"></div>
                                        </div>
                                    </div>

                                    {/* Elevated "Popular" Badge */}
                                    {isPopular && (
                                        <div className="absolute top-0 right-8 bg-gradient-to-b from-red-500 to-red-700 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-b-xl z-20 shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Popular
                                        </div>
                                    )}

                                    {/* Card Header */}
                                    <div className="mb-8 relative z-10">
                                        <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">{plan.subscription_name}</h3>
                                        <p className="text-zinc-400 text-sm h-10 leading-relaxed font-light">{plan.description}</p>
                                    </div>

                                    {/* Pricing Layout */}
                                    <div className="mb-10 relative z-10">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
                                                ₹{plan.price}
                                            </span>
                                            <span className="text-zinc-500 font-medium">/{plan.duration_days} days</span>
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <div className="flex-grow mb-10 relative z-10">
                                        <ul className="space-y-4">
                                            {plan.features
                                                ?.filter((feature) => feature?.title && feature.title.trim() !== "")
                                                .map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                                                        <span className="text-zinc-300 font-light">{feature.title}</span>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>

                                    {/* --- BRIGHT HIGH-CONTRAST BUTTON --- */}
                                    <button
                                        className={`relative z-10 w-full py-4 rounded-xl font-bold transition-all duration-300 mt-auto ${isPopular
                                                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:bg-red-500 hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]'
                                                : 'bg-zinc-100 text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]'
                                            }`}
                                    >
                                        Select {plan.subscription_name}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}