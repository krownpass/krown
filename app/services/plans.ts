import api from "../lib/api";

export const fetchAllPlans = async () => {
    try {
        // Using full URL temporarily to ensure it hits the right endpoint
        const response = await api.get("http://localhost:4000/api/subscriptions/plans");
        return response.data;
    } catch (error) {
        console.error("Error fetching plans:", error);
        throw error;
    }
};
