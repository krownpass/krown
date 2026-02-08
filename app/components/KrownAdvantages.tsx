"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/* -------------------- Types -------------------- */

type AdvantageCard = {
  id: number;
  title: string;
  tag: string;
  image: string;
  grid: string;
};

/* -------------------- Data -------------------- */

const CARDS: AdvantageCard[] = [
  {
    id: 1,
    title: "Curated Café Experiences",
    tag: "Experiences",
    image: "/Frame 17.png",
    grid: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Culture-Led Gatherings",
    tag: "Community",
    image: "/Culture-Led Gatherings (1).png",
    grid: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    title: "Local Café Network",
    tag: "Chennai",
    image: "/Frame 18@2x.png",
    grid: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    title: "Access Designed Around Lifestyle",
    tag: "Membership",
    image: "/Frame 19.png",
    grid: "md:col-span-2 md:row-span-1",
  },
];

/* -------------------- Helpers -------------------- */

const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/* -------------------- Component -------------------- */

export default function KrownAdvantage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  /* -------------------- Entry animation -------------------- */

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ka-head", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(cardRefs.current, {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* -------------------- Hover focus -------------------- */

  const handleEnter = (index: number) => {
    if (isTouchDevice) return;

    cardRefs.current.forEach((card, i) => {
      gsap.to(card, {
        scale: i === index ? 1.04 : 0.94,
        opacity: i === index ? 1 : 0.75,
        zIndex: i === index ? 10 : 1,
        duration: 0.35,
        ease: "power3.out",
      });
    });
  };

  const handleLeave = () => {
    if (isTouchDevice) return;

    cardRefs.current.forEach((card) => {
      gsap.to(card, {
        scale: 1,
        opacity: 1,
        zIndex: 1,
        duration: 0.35,
        ease: "power3.out",
      });
    });
  };

  /* -------------------- Parallax -------------------- */

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    if (isTouchDevice) return;

    const card = cardRefs.current[index];
    if (!card) return;

    const img = card.querySelector("img");
    if (!img) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(img, {
      x: x * 0.04,
      y: y * 0.04,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const resetParallax = (index: number) => {
    if (isTouchDevice) return;

    const card = cardRefs.current[index];
    if (!card) return;

    const img = card.querySelector("img");
    if (!img) return;

    gsap.to(img, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  /* -------------------- JSX -------------------- */

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="ka-head mb-14 max-w-xl">
          <h2 className="text-3xl md:text-4xl font-semibold">
            The Krown Advantage
          </h2>
          <p className="mt-3 text-sm text-white/60">
            More than membership. A cultural experience designed around how
            you live, connect, and discover.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[220px] gap-6">
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => {
                handleLeave();
                resetParallax(i);
              }}
              onMouseMove={(e) => handleMouseMove(e, i)}
              className={`relative ${card.grid} rounded-3xl overflow-hidden cursor-pointer transform-gpu`}
            >
              {/* Image */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs uppercase tracking-widest text-white/60">
                  {card.tag}
                </span>
                <h3 className="mt-1 text-lg font-semibold leading-snug">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
