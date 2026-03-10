import http from "@/functions/http";
import axios from "axios";
interface LoginPayload {
  email: string;
  password: string;
}
interface RegisterPayload{
    email:string,
    password:string,
    name:string,
    orgId:string
}

export const login = async (loginPayload: LoginPayload) => {
  try {
    const res = await http.post(`/engineer/auth/login`, loginPayload);
    return res.data;
  } catch (error) {
    console.error("Error while login", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || error.message || "Failed to login";

      throw { status, message };
    }

    throw {
      status: 500,
      message: "Unexpected error",
    };
  }
};


export const register = async (registerPayload: RegisterPayload) => {
  try {
    const res = await http.post(`/engineer/auth/register`, registerPayload,{
        withCredentials:true
    });
    return res.data;
  } catch (error) {
    console.error("Error while register", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || error.message || "Failed to register";

      throw { status, message };
    }

    throw {
      status: 500,
      message: "Unexpected error",
    };
  }
};


export const logout = async()=>{
    try {
        const res = await http.post("/engineer/auth/logout",{},{
            withCredentials:true
        })
        return res.data
    } catch (error) {
        console.error("Error while logout",error)
        if(axios.isAxiosError(error)){
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message || "Failed to logout"
            throw {status,message}
        }
        throw{
            status:500,
            message:"Unexpected error"
        }
    }
}

export const me = async()=>{
    try {
        const res = await http.post("/engineer/auth/me",{},{
            withCredentials:true
        })
        return res.data
    } catch (error) {
        console.error("Error while logout",error)
        if(axios.isAxiosError(error)){
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message || "Failed to fetch engineer data"
            throw {status,message}
        }
        throw{
            status:500,
            message:"Unexpected error"
        }
    }
}