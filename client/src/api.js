import axios from "axios";
import { mockAuditLogs, mockStats } from "./data/mockAuditLogs";

const BASE_URL = "/api";

export async function fetchAuditLogs() {
  try {
    const res = await axios.get(`${BASE_URL}/logs`, { timeout: 4000 });
    if (!Array.isArray(res.data)) {
      throw new Error("Unexpected response format");
    }
    return { data: res.data, error: null };
  } catch (err) {
    console.warn("Falling back to mock logs:", err.message);
    return { data: mockAuditLogs, error: "Using sample data — backend not connected yet." };
  }
}

export async function fetchStats() {
  try {
    const res = await axios.get(`${BASE_URL}/stats`, { timeout: 4000 });
    if (!res.data || typeof res.data !== "object" || Array.isArray(res.data)) {
      throw new Error("Unexpected response format");
    }
    return { data: res.data, error: null };
  } catch (err) {
    console.warn("Falling back to mock stats:", err.message);
    return { data: mockStats, error: "Using sample data — backend not connected yet." };
  }
}