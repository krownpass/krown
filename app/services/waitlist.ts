import api from "../lib/api";
import { PartnerInput, WaitlistInput } from "../schemas/waitlist";


export const joinWaitlist = async (data: WaitlistInput) => {
    const res = await api.post("/api/krown/add/waitlist", data);
    return res.data;
};

export const requestPartner = async (data: PartnerInput) => {
    const res = await api.post("/api/krown/add/partner-for-krown", data);
    return res.data;
};
