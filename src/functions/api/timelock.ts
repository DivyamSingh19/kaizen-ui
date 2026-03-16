import http from "@/functions/http";
import axios from "axios";

export interface TriggerTimelockPayload {
  target: string;
  functionSignature: string;
  args?: unknown[];
}

export interface ManualUnlockPayload {
  target: string;
}

export interface SetLockDurationPayload {
  target: string;
  duration: number;
}

interface EventQuery {
  fromBlock?: number;
  toBlock?: number;
}

/* ───────────────── HELPER ───────────────── */

function handleAxiosError(error: unknown, fallback: string) {
  console.error(fallback, error);

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      fallback;

    throw { status, message };
  }

  throw {
    status: 500,
    message: "Unexpected error",
  };
}

/* ───────────────── CONFIG ───────────────── */

export const getTimelockConfig = async () => {
  try {
    const res = await http.get(`/user/timelock/config`);
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch config");
  }
};

/* ───────────────── READ ───────────────── */

export const getTimelockStatus = async (target: string) => {
  try {
    const res = await http.get(`/user/timelock/status/${target}`);
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch status");
  }
};

export const getIsLocked = async (target: string) => {
  try {
    const res = await http.get(`/user/timelock/is-locked/${target}`);
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch lock state");
  }
};

export const getLockDuration = async (target: string) => {
  try {
    const res = await http.get(`/user/timelock/lock-duration/${target}`);
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch lock duration");
  }
};

export const getLockedUntil = async (target: string) => {
  try {
    const res = await http.get(`/user/timelock/locked-until/${target}`);
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch lockedUntil");
  }
};

/* ───────────────── WRITE ───────────────── */

export const triggerTimelock = async (payload: TriggerTimelockPayload) => {
  try {
    const res = await http.post(`/user/timelock/trigger`, payload);
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to trigger timelock");
  }
};

export const manualUnlock = async (payload: ManualUnlockPayload) => {
  try {
    const res = await http.post(`/user/timelock/manual-unlock`, payload);
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to unlock protocol");
  }
};

export const setLockDuration = async (payload: SetLockDurationPayload) => {
  try {
    const res = await http.post(`/user/timelock/set-lock-duration`, payload);
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to update lock duration");
  }
};

/* ───────────────── AUTHORITY ───────────────── */

export const checkTimelockAuthority = async (
  target: string,
  selector: string
) => {
  try {
    const res = await http.get(
      `/user/timelock/authority/can-execute?target=${target}&selector=${selector}`
    );
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed authority check");
  }
};

export const getTimelockOwner = async (target: string) => {
  try {
    const res = await http.get(`/user/timelock/authority/owner/${target}`);
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch owner");
  }
};

/* ───────────────── EVENTS ───────────────── */

export const getTimelockTriggeredEvents = async (query?: EventQuery) => {
  try {
    const res = await http.get(`/user/timelock/events/triggered`, {
      params: query,
    });
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch triggered events");
  }
};

export const getTimelockUnlockedEvents = async (query?: EventQuery) => {
  try {
    const res = await http.get(`/user/timelock/events/unlocked`, {
      params: query,
    });
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch unlocked events");
  }
};

export const getDurationUpdatedEvents = async (query?: EventQuery) => {
  try {
    const res = await http.get(`/user/timelock/events/duration-updated`, {
      params: query,
    });
    return res.data.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch duration updated events");
  }
};