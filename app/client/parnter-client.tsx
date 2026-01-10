
"use client";

import { useState } from "react";
import PartnerOverlay from "../components/PartnerOverlay";
import PartnerLearnMoreSection from "../(marketting)/components/ParnterLearnMoreSection";

export default function PartnerSectionClient() {
    const [partnerOpen, setPartnerOpen] = useState(false);

    return (
        <>
            <PartnerLearnMoreSection
                onBecomePartner={() => setPartnerOpen(true)}
            />
            <PartnerOverlay
                open={partnerOpen}
                onClose={() => setPartnerOpen(false)}
            />
        </>
    );
}
