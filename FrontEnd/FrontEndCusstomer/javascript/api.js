import { API_BASE_URL, STORAGE_KEYS } from "./config.js";

export class ApiError extends Error {
    constructor(message, status = 0) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export function getSession() {
    return {
        token: localStorage.getItem(STORAGE_KEYS.token),
        userId: localStorage.getItem(STORAGE_KEYS.userId),
        userName: localStorage.getItem(STORAGE_KEYS.userName)
    };
}

export function saveSession({ token, userId, userName }) {
    if (!token || !userId) throw new ApiError("Phản hồi đăng nhập thiếu token hoặc mã người dùng.");
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.userId, String(userId));
    if (userName) localStorage.setItem(STORAGE_KEYS.userName, userName);
}

export function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.userId);
    localStorage.removeItem(STORAGE_KEYS.userName);
}

export async function apiRequest(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (options.body !== undefined && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const token = getSession().token;
    if (token) headers.set("Authorization", `Bearer ${token}`);

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers
        });
    } catch (error) {
        throw new ApiError(`Không thể kết nối API (${API_BASE_URL}). Hãy kiểm tra backend và CORS.`);
    }

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message = typeof payload === "object" && payload
            ? payload.message || payload.error || `Yêu cầu thất bại (${response.status}).`
            : payload || `Yêu cầu thất bại (${response.status}).`;
        throw new ApiError(message, response.status);
    }

    return payload && typeof payload === "object" && "data" in payload
        ? payload.data
        : payload;
}

export function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
}

export function safeHttpUrl(value) {
    if (!value) return "";
    try {
        const url = new URL(value, window.location.href);
        return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch {
        return "";
    }
}

export function formatVnd(value) {
    const amount = Number(value);
    return Number.isFinite(amount)
        ? new Intl.NumberFormat("vi-VN").format(amount) + " đ"
        : "Liên hệ";
}

export function readFavorites() {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || "[]");
        return Array.isArray(value) ? value.map(String) : [];
    } catch {
        return [];
    }
}

export function writeFavorites(ids) {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...new Set(ids.map(String))]));
}
