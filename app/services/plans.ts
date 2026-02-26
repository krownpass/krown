import api from "../lib/api";

export const fetchAllPlans = async (token?: string) => {
    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await api.get("/api/subscriptions/plans", { headers });
        return response.data;
    } catch (error) {
        console.error("Error fetching plans:", error);
        throw error;
    }
};
