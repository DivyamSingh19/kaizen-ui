
import http from "@/functions/http";
import axios from "axios";

interface CreateProfilePayload {
  bio?: string;
  avatarUrl?: string;
  headLine?: string;
}

interface EditProfilePayload {
  bio?: string;
  avatarUrl?: string;
  headLine?: string;
}

export const getProfile = async () => {
  try {
    const res = await http.get("/user/profile/", {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("Error while fetching profile", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch profile";

      throw { status, message };
    }

    throw {
      status: 500,
      message: "Unexpected error",
    };
  }
};

export const createProfile = async (payload: CreateProfilePayload) => {
  try {
    const res = await http.post("/user/profile/create", payload, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("Error while creating profile", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create profile";

      throw { status, message };
    }

    throw {
      status: 500,
      message: "Unexpected error",
    };
  }
};

export const editProfile = async (payload: EditProfilePayload) => {
  try {
    const res = await http.put("/user/profile/edit", payload, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("Error while editing profile", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";

      throw { status, message };
    }

    throw {
      status: 500,
      message: "Unexpected error",
    };
  }
};

export const deleteProfile = async () => {
  try {
    const res = await http.delete("/user/profile/", {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("Error while deleting profile", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete profile";

      throw { status, message };
    }

    throw {
      status: 500,
      message: "Unexpected error",
    };
  }
};
