"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PartnerClient() {
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                        },
                    }
                );
            });

            // Magnetic cards
            gsap.utils.toArray<HTMLElement>(".magnetic").forEach((card) => {
                card.addEventListener("mousemove", (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    gsap.to(card, {
                        x: x * 0.12,
                        y: y * 0.12,
                        duration: 0.4,
                        ease: "power3.out",
                    });
                });

                card.addEventListener("mouseleave", () => {
                    gsap.to(card, { x: 0, y: 0, duration: 0.6 });
                });
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={root}>
            {/* WHAT IT MEANS */}
            <section className="section">
                <h2 className="section-title reveal">
                    What It Means to Be a Krown Partner
                </h2>

                <div className="grid-4">
                    {[
                        ["Curated Footfall", "Quality members, not random walk-ins"],
                        ["Community Events", "Runs, brunches & pop-ups"],
                        ["Brand Visibility", "Featured across Krown"],
                        ["Chennai-First", "Hyperlocal, culture-led cafés"],
                    ].map(([title, desc]) => (
                        <div key={title} className="card magnetic reveal">
                            <h3>{title}</h3>
                            <p>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="section">
                <h2 className="section-title reveal">How the Partnership Works</h2>

                <div className="steps">
                    {[
                        ["01", "Apply to Partner", "Share café details with Krown"],
                        ["02", "Get Onboarded", "Align on experiences & community"],
                        ["03", "Host Experiences", "Welcome Krown members"],
                    ].map(([n, t, d]) => (
                        <div key={n} className="step reveal">
                            <span className="step-no">{n}</span>
                            <h3>{t}</h3>
                            <p>{d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* VALUES */}
            <section className="split">
                <h2 className="reveal">
                    Krown partners with cafés that believe in
                    <br /> community, not just footfall.
                </h2>

                <ul className="pill-list reveal">
                    <li>Independent cafés</li>
                    <li>Culture-driven spaces</li>
                    <li>Community-friendly teams</li>
                    <li>Chennai-based locations</li>
                </ul>
            </section>

            {/* STATS */}
            {/* <section className="section">
                <h2 className="section-title reveal">Why Cafés Choose Krown</h2>

                <div className="grid-3">
                    {[
                        ["500+", "ACTIVE MEMBERS"],
                        ["30+", "PARTNER CAFÉS"],
                        ["₹50k+", "AVG MONTHLY VALUE"],
                    ].map(([v, l]) => (
                        <div key={l} className="stat reveal magnetic">
                            <strong>{v}</strong>
                            <span>{l}</span>
                        </div>
                    ))}
                </div>
            </section> */}

            {/* CTA */}
            <section className="cta reveal">
                <h2>Ready to explore a partnership?</h2>
                <div className="cta-actions">
                    <button className="btn primary">Become a Partner</button>
                    <button className="btn ghost">Contact Us</button>
                </div>
            </section>
        </div>
    );
}
