"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

type Vec = { x: number; y: number };

export default function CircularRevealStrips() {
    const [mounted, setMounted] = useState(false);
    const [stripes, setStripes] = useState(12);

    /* ---------------- MOUNT GUARD ---------------- */
    useEffect(() => {
        setMounted(true);
    }, []);

    /* ---------------- RESPONSIVE STRIPES ---------------- */
    useEffect(() => {
        if (!mounted) return;

        const update = () => {
            setStripes(window.innerWidth < 768 ? 6 : 12);
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [mounted]);

    /* ---------------- MOTION VALUES ---------------- */
    const x1 = useMotionValue(50);
    const y1 = useMotionValue(110);
    const x2 = useMotionValue(50);
    const y2 = useMotionValue(110);
    const x3 = useMotionValue(20);
    const y3 = useMotionValue(110);
    const x4 = useMotionValue(80);
    const y4 = useMotionValue(110);
    const cx = useMotionValue(50);
    const cy = useMotionValue(90);

    /* ---------------- HELPERS ---------------- */
    const lerp = (a: number, b: number, t: number) =>
        a + (b - a) * t;

    const easeInOut = (t: number) =>
        t * t * (3 - 2 * t); // smoothstep

    const e1Path: Vec[] = [
        { x: 50, y: 110 },
        { x: 50, y: 20 },
        { x: 85, y: 25 },
        { x: 50, y: 110 },
    ];

    const e2Path: Vec[] = [
        { x: 50, y: 110 },
        { x: 18, y: 45 },
        { x: 50, y: 110 },
    ];

    const e3Path: Vec[] = [
        { x: 20, y: 110 },
        { x: 20, y: 80 },
        { x: 20, y: 110 },
    ];

    const e4Path: Vec[] = [
        { x: 80, y: 110 },
        { x: 80, y: 80 },
        { x: 80, y: 110 },
    ];

    const samplePath = (path: Vec[], p: number) => {
        const segments = path.length - 1;
        if (segments <= 0) return path[0];

        const raw = p * segments;
        const i = Math.min(Math.floor(raw), segments - 1);
        const next = path[i + 1] ?? path[i];
        const t = easeInOut(raw - i);

        return {
            x: lerp(path[i].x, next.x, t),
            y: lerp(path[i].y, next.y, t),
        };
    };

    /* ---------------- ANIMATION LOOP ---------------- */
    useEffect(() => {
        if (!mounted) return;

        let raf = 0;
        let start = 0;
        const duration = 28000;

        const loop = (now: number) => {
            if (!start) start = now;
            const p = ((now - start) % duration) / duration;

            const p1 = samplePath(e1Path, p);
            const p2 = samplePath(e2Path, p);
            const p3 = samplePath(e3Path, p);
            const p4 = samplePath(e4Path, p);

            x1.set(p1.x); y1.set(p1.y);
            x2.set(p2.x); y2.set(p2.y);
            x3.set(p3.x); y3.set(p3.y);
            x4.set(p4.x); y4.set(p4.y);

            cx.set((p1.x + p2.x + p3.x + p4.x) / 4);
            cy.set((p1.y + p2.y + p3.y + p4.y) / 4);

            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [mounted]);

    /* ---------------- GRADIENTS ---------------- */
    const colorField = useMotionTemplate`
        radial-gradient(ellipse 52% 58% at ${x1}% ${y1}%, #C00148 0%, transparent 60%),
        radial-gradient(ellipse 48% 54% at ${x2}% ${y2}%, #800020 0%, transparent 60%),
        radial-gradient(ellipse 46% 52% at ${x3}% ${y3}%, #C00148 0%, transparent 60%),
        radial-gradient(ellipse 46% 52% at ${x4}% ${y4}%, #800020 0%, transparent 60%)
    `;

    const vignette = useMotionTemplate`
        radial-gradient(
            ellipse 90% 88% at ${cx}% ${cy}%,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0.35) 45%,
            rgba(0,0,0,0.9) 85%
        )
    `;

    /* ---------------- RENDER ---------------- */
    if (!mounted) {
        return <div className="absolute inset-0 overflow-hidden bg-black" />;
    }

    return (
        <div className="absolute inset-0 overflow-hidden bg-black">
            {/* STRIPES */}
            <div className="absolute inset-x-0 -top-[20%] w-[120%] h-[140%] flex">
                {Array.from({ length: stripes }).map((_, i) => (
                    <div
                        key={i}
                        className="flex-1"
                        style={{
                            backgroundImage: `
          linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 15%, transparent 85%, rgba(0,0,0,0.6)),
          linear-gradient(to right, #8f0028, #800020 35%, #800020 65%, #5a0015)
        `,
                        }}
                    />
                ))}
            </div>

            {/* COLOR REVEAL */}
            <motion.div
                className="absolute inset-0"
                style={{
                    backgroundImage: colorField,
                    mixBlendMode: "screen",
                }}
            />

            {/* VIGNETTE */}
            <motion.div
                className="absolute inset-0"
                style={{
                    backgroundImage: vignette,
                }}
            />
        </div>
    );
}
