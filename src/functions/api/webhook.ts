import http from "../http";
import axios from "axios";

export const createWebhook = async (projectId: string) => {
    try {
        const res = await http.post(`/user/webhook/create`, {
        }, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error while creating webhook", error);
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message =
                error.response?.data?.message || error.message || "Failed to create webhook";
            throw { status, message };
        }
        throw {
            status: 500,
            message: "Unexpected error",
        };
    }
}