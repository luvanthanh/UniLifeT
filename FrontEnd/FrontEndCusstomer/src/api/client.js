const BACKEND_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "/api" : BACKEND_ORIGIN);
const SESSION_KEY = "unitlife.token";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken() {
  return localStorage.getItem(SESSION_KEY);
}

export function getRole(token = getToken()) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return String(payload.scope || payload.role || "").replace(/^ROLE_/, "").toUpperCase();
  } catch {
    return "";
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("unitlife.userId");
  localStorage.removeItem("unitlife.userName");
}

export async function request(path, options = {}) {
  const { auth = true, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});
  const token = auth ? getToken() : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) headers.set("Content-Type", "application/json");

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
  } catch {
    throw new ApiError("Không kết nối được backend. Hãy kiểm tra API đang chạy.", 0);
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    if (response.status === 401 && token) {
      clearSession();
      window.dispatchEvent(new Event("unitlife:session-expired"));
    }
    throw new ApiError(typeof payload === "object" ? payload.message || "Yêu cầu không thành công." : payload || "Yêu cầu không thành công.", response.status);
  }
  return payload && typeof payload === "object" && "data" in payload ? payload.data : payload;
}

let motelRequest;
const imageRequests = new Map();

export const api = {
  rooms: () => request("/rooms", { auth: false }),
  room: (id) => request(`/rooms/${id}`, { auth: false }),
  motels: () => motelRequest ||= request("/motels", { auth: false }),
  roomImages: (id) => {
    if (!imageRequests.has(id)) imageRequests.set(id, request(`/room-images/get-room-image/${id}`, { auth: false }));
    return imageRequests.get(id);
  },
  universities: () => request("/universities", { auth: false }),
  services: () => request("/services", { auth: false }),
  amenities: () => request("/amenities", { auth: false }),
  roomAmenities: (roomId) => request(`/room-amenity/get-room-amenity/${roomId}`, { auth: false }),
  login: (body) => request("/users/auth/login", { method: "POST", body: JSON.stringify(body), auth: false }),
  register: (body) => request("/users/auth/register", { method: "POST", body: JSON.stringify(body), auth: false }),
  me: () => request("/users/me"),
  updateMe: (body) => request("/users/me", { method: "PATCH", body: JSON.stringify(body) }),
  favorites: () => request("/room-favorites/me"),
  addFavorite: (roomId) => request("/room-favorites", { method: "POST", body: JSON.stringify({ roomId }) }),
  removeFavorite: (roomId) => request(`/room-favorites/${roomId}`, { method: "DELETE" }),
  rentals: () => request("/rental-requests/me"),
  requestRental: (body) => request("/rental-requests", { method: "POST", body: JSON.stringify(body) }),
  requestViewing: (body) => request("/viewing-appointments", { method: "POST", body: JSON.stringify(body) }),
  reviews: (roomId) => request(`/room-reviews/room/${roomId}`, { auth: false }),
  createReview: (body) => request("/room-reviews", { method: "POST", body: JSON.stringify(body) })
};

export function imageUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value, BACKEND_ORIGIN);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

export function money(value) {
  if (value === null || value === undefined || value === "") return "Chưa có giá";
  return `${new Intl.NumberFormat("vi-VN").format(Number(value))} đ`;
}
