"use client";

import { useState } from "react";
import IntroOverlay from "../components/Intro";

export default function IntroGate({
    children,
}: {
    children: React.ReactNode;
}) {
    const [done, setDone] = useState(false);

    return (
        <>
            {!done && (
                <IntroOverlay onComplete={() => setDone(true)} />
            )}

            <div
                className={`transition-opacity duration-500 ease-out ${done ? "opacity-100" : "opacity-0"
                    }`}
            >
                {children}
            </div>
        </>
    );
}
