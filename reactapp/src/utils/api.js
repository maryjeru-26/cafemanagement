/**
 * Centralized API configuration and helper functions
 * Base URL: http://localhost:8080
 */

const BASE_URL = "https://cafemanagement-production-3f70.up.railway.app";

/**
 * Get JWT token from localStorage
 */
const getToken = () => localStorage.getItem("jwt");

/**
 * Get default headers with authorization
 */
const getHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Generic fetch wrapper
 */
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const includeAuth = options.includeAuth !== false;

  const config = {
    ...options,
    headers: {
      ...getHeaders(includeAuth),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * GET request
 */
export const apiGet = async (endpoint, options = {}) => {
  return request(endpoint, {
    ...options,
    method: "GET",
  });
};

/**
 * POST request
 */
export const apiPost = async (endpoint, data, options = {}) => {
  return request(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * PUT request
 */
export const apiPut = async (endpoint, data, options = {}) => {
  return request(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 */
export const apiDelete = async (endpoint, options = {}) => {
  return request(endpoint, {
    ...options,
    method: "DELETE",
  });
};

/**
 * Export BASE_URL and getToken for reference
 */
export { BASE_URL, getToken };
