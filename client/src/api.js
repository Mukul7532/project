import axios from 'axios';

// Backend URL - Change this to your backend server
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// AUDIT LOGS
// ============================================

export const fetchAuditLogs = async () => {
  try {
    const response = await api.get('/logs');
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error: error.response?.data?.message || 'Failed to fetch logs',
    };
  }
};

export const createAuditLog = async (logData) => {
  try {
    const response = await api.post('/logs', logData);
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.message || 'Failed to create log',
    };
  }
};

export const deleteAuditLog = async (id) => {
  try {
    await api.delete(`/logs/${id}`);
    return {
      data: { success: true },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.message || 'Failed to delete log',
    };
  }
};

// ============================================
// DASHBOARD STATS
// ============================================

export const fetchStats = async () => {
  try {
    const response = await api.get('/stats');
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.message || 'Failed to fetch stats',
    };
  }
};

// ============================================
// REPORTS
// ============================================

export const fetchReports = async (dateRange = '30days') => {
  try {
    const response = await api.get('/reports', {
      params: { dateRange },
    });
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.message || 'Failed to fetch reports',
    };
  }
};

// ============================================
// SETTINGS
// ============================================

export const fetchSettings = async () => {
  try {
    const response = await api.get('/settings');
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.message || 'Failed to fetch settings',
    };
  }
};

export const saveSettings = async (settings) => {
  try {
    const response = await api.post('/settings', settings);
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.message || 'Failed to save settings',
    };
  }
};

export default api;