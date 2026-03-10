"use client";
import { useEffect, useState } from "react";
import IntroOverlay from "../components/Intro";

export default function IntroGate({ children }: { children: React.ReactNode }) {
    const [done, setDone] = useState(true); // ← true = hidden by default

    useEffect(() => {
        if (window.location.pathname === "/") {
            setDone(false); // only show intro on home page
        }
    }, []);

    return (
        <>
            {!done && <IntroOverlay onComplete={() => setDone(true)} />}
            <div className={`transition-opacity duration-500 ease-out ${done ? "opacity-100" : "opacity-0"}`}>
                {children}
            </div>
        </>
    );
}
