import { API_BASE_URL } from "./safescope";

export function getAuthToken() {
  if (typeof window === "undefined") return null;

  return (
    window.localStorage.getItem("sentinel_auth_token") ||
    window.localStorage.getItem("token")
  );
}

export function authHeaders() {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getOrganizationSettings() {
  const response = await fetch(`${API_BASE_URL}/organization/me/settings`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Unable to load organization settings.");
  }

  return response.json();
}

export async function updateOrganizationSettings(payload: {
  riskProfileId?: string;
  name?: string;
  logoPath?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/organization/me/settings`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to save organization settings.");
  }

  return response.json();
}
