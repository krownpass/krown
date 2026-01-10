"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function IntroOverlay({
    onComplete,
}: {
    onComplete: () => void;
}) {
    const root = useRef<HTMLDivElement>(null);
    const played = useRef(false);

    useLayoutEffect(() => {
        if (played.current) return;
        played.current = true;

        const ctx = gsap.context(() => {
            const q = gsap.utils.selector(root);

            gsap.set(root.current, { autoAlpha: 1 });
            gsap.set(q(".word"), { autoAlpha: 0, y: 60 });
            gsap.set(q(".logo"), { autoAlpha: 0, scale: 0.9 });

            const tl = gsap.timeline();

            tl.to(q(".word"), {
                autoAlpha: 1,
                y: 0,
                stagger: 0.12,
                duration: 0.8,
                ease: "power3.out",
            })
                .to(q(".word"), {
                    autoAlpha: 0,
                    y: -40,
                    stagger: 0.08,
                    duration: 0.6,
                    ease: "power2.in",
                }, "+=0.3")

                .to(q(".logo"), {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.9,
                    ease: "power3.out",
                })

                .to(q(".logo"), {
                    scale: 12,
                    autoAlpha: 0,
                    duration: 1.2,
                    ease: "power4.in",
                })

                // 🔑 FINAL FADE (THIS IS CRITICAL)
                .to(root.current, {
                    autoAlpha: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                        // allow browser one clean frame
                        requestAnimationFrame(() => {
                            root.current!.style.display = "none";
                            root.current!.style.pointerEvents = "none";
                            onComplete();
                        });
                    },
                });

        }, root);

        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div
            ref={root}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
            <div className="absolute z-10 flex gap-3 text-white font-bold tracking-tight text-[clamp(1.7rem,5vw,3.4rem)]">
                <span className="word">YOU</span>
                <span className="word">SHOULD</span>
                <span className="word">MEET</span>
            </div>

            <div className="logo absolute z-0 text-[#C00148] font-extrabold tracking-[0.2em] text-[clamp(2.4rem,9vw,6rem)]">
                KROWN
            </div>
        </div>
    );
}
