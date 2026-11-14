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
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Không kết nối được backend. Hãy kiểm tra API đang chạy.", 0);
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    throw new ApiError(typeof payload === "object" ? payload.message || "Yêu cầu không thành công." : payload || "Yêu cầu không thành công.", response.status);
  }
  return payload && typeof payload === "object" && "data" in payload ? payload.data : payload;
}

let motelRequest;
const imageRequests = new Map();

export const api = {
  rooms: () => request("/rooms"),
  room: (id) => request(`/rooms/${id}`),
  motels: () => motelRequest ||= request("/motels"),
  roomImages: (id) => {
    if (!imageRequests.has(id)) imageRequests.set(id, request(`/room-images/get-room-image/${id}`));
    return imageRequests.get(id);
  },
  universities: () => request("/universities"),
  services: () => request("/services"),
  amenities: () => request("/amenities"),
  roomAmenities: (roomId) => request(`/room-amenity/get-room-amenity/${roomId}`),
  login: (body) => request("/users/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/users/auth/register", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/users/me"),
  updateMe: (body) => request("/users/me", { method: "PATCH", body: JSON.stringify(body) }),
  favorites: () => request("/room-favorites/me"),
  addFavorite: (roomId) => request("/room-favorites", { method: "POST", body: JSON.stringify({ roomId }) }),
  removeFavorite: (roomId) => request(`/room-favorites/${roomId}`, { method: "DELETE" }),
  rentals: () => request("/rental-requests/me"),
  requestRental: (body) => request("/rental-requests", { method: "POST", body: JSON.stringify(body) }),
  requestViewing: (body) => request("/viewing-appointments", { method: "POST", body: JSON.stringify(body) }),
  reviews: (roomId) => request(`/room-reviews/room/${roomId}`),
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
