"use client";

import Image from "next/image";

export default function GlassNavbar({
    onJoin,
    onBecomePartner,
}: {
    onJoin: () => void;
    onBecomePartner: () => void;
}) {
    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <nav
                className="w-full max-w-[1440px] rounded-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
            >
                <div className="mx-auto max-w-[1320px] px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center">

                                <Image
                                    src="/Logo-48.png"
                                    alt="logo"
                                    width={40}
                                    height={40}
                                    className="mb-1 ml-2"
                                />
                            </div>
                            <span className="text-white font-semibold tracking-wide">
                                KROWN
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-14">
                            <button
                                onClick={onBecomePartner}
                                className="hidden sm:inline-flex text-sm text-white/60 hover:text-white transition"
                            >
                                Partner with Us
                            </button>

                            <button
                                onClick={onJoin}
                                className="rounded-lg bg-[#800020] px-5 py-2 text-sm font-medium text-white hover:bg-[#a0003c] transition shadow-md"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
