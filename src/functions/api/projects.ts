import http from "@/functions/http";
import axios from "axios";

interface AddProjectPayload {
  title: string;
  description?: string;
  contractAddress: string;
  abi: object;
}

interface EditProjectPayload {
  title?: string;
  description?: string;
  contractAddress?: string;
  abi?: object;
}

interface UpdateStatusPayload {
  projectId: string;
  status: string;
}

const handleError = (error: unknown, fallbackMessage: string): never => {
  console.error(fallbackMessage, error);
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || fallbackMessage;
    throw { status, message };
  }
  throw { status: 500, message: "Unexpected error" };
};

export const addProject = async (payload: AddProjectPayload) => {
  try {
    const res = await http.post("/user/project/add", payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error, "Failed to create project");
  }
};

export const getAllProjects = async () => {
  try {
    const res = await http.get("/user/project/all", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error, "Failed to fetch projects");
  }
};

export const getProjectById = async (id: string) => {
  try {
    const res = await http.get(`/user/project/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error, "Failed to fetch project");
  }
};

export const editProject = async (id: string, payload: EditProjectPayload) => {
  try {
    const res = await http.put(`/user/project/edit/${id}`, payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error, "Failed to update project");
  }
};

export const deleteProject = async (id: string) => {
  try {
    const res = await http.delete(`/user/project/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error, "Failed to delete project");
  }
};

export const updateProjectStatus = async (payload: UpdateStatusPayload) => {
  try {
    const res = await http.put("/user/project/status", payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error, "Failed to update project status");
  }
};