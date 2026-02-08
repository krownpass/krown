"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { IMAGES } from "@/public";

type WeekCard = {
    title: string;
    subtitle: string;
    image: string;
};

const WEEK_CARDS: WeekCard[] = [
    {
        title: "For unplanned hangouts",
        subtitle: "Good places, better company.",
        image: "/nightCafe.png",
    },
    {
        title: "For focused workdays",
        subtitle: "Where work feels uninterrupted.",
        image: "/workday .jpeg",
    },
    {
        title: "For nights that linger",
        subtitle: "Quiet tables, good energy.",
        image: "/Dnight.jpg",
    },
    {
        title: "For nights that go long",
        subtitle: "Energy, music, movement.",
        image: "/Pnight.jpg",
    },
];

export default function KrownWeek() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);

    const [isMounted, setIsMounted] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const ctx = gsap.context(() => {
            gsap.from(".kw-head", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });

            gsap.from(cardsRef.current, {
                y: 40,
                opacity: 0,
                stagger: 0.15,
                delay: 0.2,
                ease: "power3.out",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isMounted]);

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    };

    const scrollByAmount = (amount: number) => {
        scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
    };

    const onMouseDown = (e: React.MouseEvent) => {
        if (isTouch) return;
        const el = scrollRef.current;
        if (!el) return;
        isDragging.current = true;
        startX.current = e.pageX;
        startScrollLeft.current = el.scrollLeft;
    };

    const stopDrag = () => {
        isDragging.current = false;
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || isTouch) return;
        const el = scrollRef.current;
        if (!el) return;
        const delta = e.pageX - startX.current;
        el.scrollLeft = startScrollLeft.current - delta * 1.2;
    };

    /* Hover micro-interactions */
    const hoverIn = (el: HTMLDivElement) => {
        if (isTouch) return;

        gsap.to(el, {
            y: -8,
            scale: 1.03,
            duration: 0.35,
            ease: "power3.out",
        });

        const img = el.querySelector("img") as HTMLImageElement | null;
        if (img) {
            gsap.to(img, {
                scale: 1.1,
                duration: 0.6,
                ease: "power3.out",
            });
        }
    };

    const hoverOut = (el: HTMLDivElement) => {
        if (isTouch) return;

        gsap.to(el, {
            y: 0,
            scale: 1,
            duration: 0.35,
            ease: "power3.out",
        });

        const img = el.querySelector("img") as HTMLImageElement | null;
        if (img) {
            gsap.to(img, {
                scale: 1,
                duration: 0.6,
                ease: "power3.out",
            });
        }
    };

    return (
        <section ref={sectionRef} className="relative w-full bg-black text-white py-24 px-6">
            <div className="max-w-7xl mx-auto relative">
                <div className="kw-head mb-14">
                    <h2 className="text-3xl md:text-4xl font-semibold">How Krown fits into your week</h2>
                    <p className="mt-3 text-sm text-white/60 max-w-xl">
                        However your week flows, Krown flows with it.
                    </p>
                </div>

                <button
                    onClick={() => scrollByAmount(-420)}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur flex items-center justify-center transition ${!canScrollLeft || isTouch ? "opacity-0 pointer-events-none" : "hover:bg-black/80"
                        }`}
                >
                    <span className="text-white text-xl">‹</span>
                </button>

                <button
                    onClick={() => scrollByAmount(420)}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur flex items-center justify-center transition ${!canScrollRight || isTouch ? "opacity-0 pointer-events-none" : "hover:bg-black/80"
                        }`}
                >
                    <span className="text-white text-xl">›</span>
                </button>

                <div
                    ref={scrollRef}
                    onScroll={updateScrollState}
                    onMouseDown={onMouseDown}
                    onMouseUp={stopDrag}
                    onMouseLeave={stopDrag}
                    onMouseMove={onMouseMove}
                    className="flex gap-6 md:gap-8 overflow-x-auto pb-8 select-none no-scrollbar"
                >
                    {WEEK_CARDS.map((card, i) => (
                        <div
                            key={card.title}
                            ref={(el) => {
                                if (el) cardsRef.current[i] = el;
                            }}
                            onMouseEnter={(e) => hoverIn(e.currentTarget as HTMLDivElement)}
                            onMouseLeave={(e) => hoverOut(e.currentTarget as HTMLDivElement)}
                            className="relative min-w-[280px] sm:min-w-[320px] md:min-w-[360px] h-[380px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden flex-shrink-0"
                        >
                            <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 pt-24 bg-gradient-to-t from-[#800020] to-transparent">
                                <h3 className="text-lg sm:text-xl font-semibold">{card.title}</h3>
                                <p className="mt-2 text-sm text-white/75">{card.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
