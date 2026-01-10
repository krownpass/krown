"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function IntroOverlay({
    onComplete,
}: {
    onComplete: () => void;
}) {
    const root = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!root.current) return;

        const ctx = gsap.context(() => {
            const q = gsap.utils.selector(root);

            gsap.set(root.current, { autoAlpha: 1 });
            gsap.set(q(".word"), { autoAlpha: 0, y: 60 });
            gsap.set(q(".logo"), {
                autoAlpha: 0,
                scale: 0.9,
                y: 12,
                transformOrigin: "50% 50%",
            });

            gsap.timeline({
                defaults: { ease: "power3.out" },
                onComplete,
            })
                // WORDS IN
                .to(q(".word"), {
                    autoAlpha: 1,
                    y: 0,
                    stagger: 0.12,
                    duration: 0.8,
                })

                // WORDS OUT
                .to(q(".word"), {
                    autoAlpha: 0,
                    y: -40,
                    stagger: 0.08,
                    duration: 0.6,
                    ease: "power2.in",
                })

                // GAP (DO NOT PAUSE)
                .to({}, { duration: 0.12 })

                // LOGO IN
                .to(q(".logo"), {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.7,
                })

                // LOGO BURST
                .to(q(".logo"), {
                    scale: 10,
                    autoAlpha: 0,
                    duration: 1.1,
                    ease: "power4.in",
                })

                // OVERLAY FADE
                .to(root.current, {
                    autoAlpha: 0,
                    duration: 0.4,
                });
        }, root);

        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div
            ref={root}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black opacity-0 invisible">
            <div className="absolute z-20 flex gap-3 text-white font-bold text-[clamp(1.7rem,5vw,3.4rem)]">
                <span className="word">YOU</span>
                <span className="word">SHOULD</span>
                <span className="word">MEET</span>
            </div>

            <div className="logo absolute z-10 text-[#C00148] font-extrabold tracking-[0.25em] text-[clamp(2.6rem,9vw,6.5rem)]">
                KROWN
            </div>
        </div>
    );
}
