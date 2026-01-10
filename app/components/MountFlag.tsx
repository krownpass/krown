

"use client";

import { useEffect } from "react";

export function MountFlag() {
    useEffect(() => {
        document.documentElement.setAttribute("data-mounted", "true");
    }, []);

    return null;
}
