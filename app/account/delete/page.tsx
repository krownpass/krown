"use client";

import { useState, useEffect } from "react";
import GlassNavbar from "../../components/NavBar";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteAccountPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [confirmationText, setConfirmationText] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/user/me")
            .then((res) => {
                if (!res.ok) throw new Error("Could not fetch profile. Are you logged in?");
                return res.json();
            })
            .then((data) => {
                setProfile(data.data || data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleDelete = async () => {
        if (confirmationText.toLowerCase() !== "confirm") {
            return;
        }

        setDeleting(true);
        setError("");

        try {
            const res = await fetch("/api/user/me", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || "Failed to delete account");
            }

            setSuccess(true);
            setTimeout(() => {
                window.location.href = "krown://";
            }, 3000);
        } catch (err: any) {
            setError(err.message);
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
                <GlassNavbar onJoin={() => window.location.href = "https://krownpass.com"} />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#800020]" />
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col relative overflow-hidden text-white pt-24 px-6 items-center justify-center">
                <GlassNavbar onJoin={() => window.location.href = "https://krownpass.com"} />
                <div className="text-center max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md">
                    <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Account Deleted</h1>
                    <p className="text-white/60 mb-6">
                        Your account and all associated data have been permanently deleted. You will be redirected shortly.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#800020]/10 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#800020]/5 blur-[120px] animate-pulse" />
            </div>

            <GlassNavbar onJoin={() => window.location.href = "https://krownpass.com"} />

            <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-76px)] px-6 py-12">
                <div className="w-full max-w-lg bg-[#111] border border-white/5 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
                    <div className="p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-3">Delete Account</h1>
                            <p className="text-white/60 text-sm">
                                This action is permanent and cannot be undone. All your personal data, memberships, and history will be wiped.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-4 text-red-400">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        {profile && (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 mb-8">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/50">👤</div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{profile.user_name || "User"}</div>
                                    <div className="text-sm text-white/50">{profile.user_mobile_no || profile.user_email || "Account selected"}</div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">
                                    To confirm, type <strong className="text-white">confirm</strong> below
                                </label>
                                <input
                                    type="text"
                                    placeholder="Type 'confirm'"
                                    value={confirmationText}
                                    onChange={(e) => setConfirmationText(e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => window.location.href = "krown://"}
                                    disabled={deleting}
                                    className="flex-1 py-4 flex items-center justify-center gap-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Cancel
                                </button>
                                
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting || confirmationText.toLowerCase() !== "confirm"}
                                    className="flex-1 py-4 bg-red-600/90 hover:bg-red-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                                >
                                    {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete My Account"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}