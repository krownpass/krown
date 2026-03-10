import type { Metadata } from 'next';
import PlansClient from "../../client/plans-client";

export const metadata: Metadata = {
    title: "Choose Your KrownPass",
    description: "Unlock exclusive perks, free drinks, and priority access across the city's most distinguished venues.",
};

export default function PlansPage() {
    return <PlansClient />;
}