const API_ROOT = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "/api" : "http://localhost:8080");
const TOKEN_KEY = "unilife_admin_token";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";

export function getRole(token = getToken()) {
  try {
    const raw = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(raw));
    return String(claims.scope || claims.role || "").replace(/^ROLE_/, "").toUpperCase();
  } catch {
    return "";
  }
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function request(path, options = {}) {
  const { auth = true, ...fetchOptions } = options;
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (auth && token) headers.set("Authorization", `Bearer ${token}`);
  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) headers.set("Content-Type", "application/json");

  let response;
  try {
    response = await fetch(`${API_ROOT}${path}`, { ...fetchOptions, headers });
  } catch {
    throw new ApiError("Không kết nối được backend. Hãy kiểm tra API tại localhost:8080.", 0);
  }
  const type = response.headers.get("content-type") || "";
  const body = type.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    throw new ApiError(typeof body === "object" ? body.message || `Yêu cầu thất bại (${response.status}).` : body || `Yêu cầu thất bại (${response.status}).`, response.status);
  }
  return body && typeof body === "object" && "data" in body ? body.data : body;
}

export const api = {
  login: (username, password) => request("/users/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ userName: username, userPassword: password })
  }),
  me: () => request("/users/me"),
  list: (path) => request(path),
  create: (path, data) => request(path, { method: "POST", body: JSON.stringify(data) }),
  update: (path, data) => request(path, { method: "PUT", body: JSON.stringify(data) }),
  remove: (path) => request(path, { method: "DELETE" })
};

export const formatNumber = (value) => value == null || value === "" ? "—" : Number(value).toLocaleString("vi-VN");
