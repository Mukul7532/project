import axios from "axios";
import { mockAuditLogs, mockStats } from "./data/mockAuditLogs";
import { mockShipmentEvents, mockShipmentProjection } from "./data/mockShipmentEvents";

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
export async function fetchShipment(shipmentId) {
  try {
    const res = await axios.get(`${BASE_URL}/queries/shipment/${shipmentId}`, { timeout: 5000 });
    if (!res.data?.success) {
      throw new Error("Request failed");
    }
    return { data: res.data.data, error: null };
  } catch (err) {
    console.warn("Falling back to mock shipment data:", err.message);
    const normalizedId = shipmentId.trim().toUpperCase().replace(/\s+/g, "");
    if (normalizedId === "SHIP-1001") {
      return {
        data: { shipmentId: "SHIP-1001", events: mockShipmentEvents, data: mockShipmentProjection },
        error: "Using sample data — backend not connected yet.",
      };
    }
    return { data: null, error: "No data found and backend is unreachable. Try SHIP-1001 for a sample." };
  }
}