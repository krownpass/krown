"use client";

import { useEffect, useState } from "react";
import IntroOverlay from "../components/Intro";

export default function IntroGate({
    children,
}: {
    children: React.ReactNode;
}) {
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (done) {
            document.documentElement.setAttribute(
                "data-intro",
                "ready"
            );
        }
    }, [done]);

    return (
        <>
            {!done && (
                <IntroOverlay onComplete={() => setDone(true)} />
            )}

            {/* App always mounted but hidden by CSS */}
            {children}
        </>
    );
}
