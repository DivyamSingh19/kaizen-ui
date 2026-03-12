import axios from "axios";
import http from "../http";

export const getProjects= async () => {
    try {
        const res = await http.get("/user/data/projects",{
            withCredentials:true
        })  
        return res.data
    } catch (error) {
        console.error("Error while fetching projects",error)
        if(axios.isAxiosError(error)){
            const status = error.response?.status
            const message = error.response?.data?.message || error.message || "failed to fetch posts"
            throw {
                status,
                message
            }
        }
        throw{
            status:500,
            message:"Unexpected error"
        }
    }
}