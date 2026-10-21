const API_BASE = window.UNILIFE_API_BASE || "http://localhost:8080";

export class ApiError extends Error {
    constructor(message, status = 0, payload = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.payload = payload;
    }
}

export async function apiRequest(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");
    if (options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    const token = localStorage.getItem("unitlife.token");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } catch (error) {
        throw new ApiError("Không thể kết nối backend UniLifeT. Hãy kiểm tra backend và cấu hình CORS.", 0, error);
    }

    const payload = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
        throw new ApiError(payload?.message || `Yêu cầu thất bại (${response.status}).`, response.status, payload);
    }
    if (payload && typeof payload === "object" && "code" in payload && payload.code !== 1000 && payload.code !== 200) {
        throw new ApiError(payload.message || "Backend từ chối yêu cầu.", response.status, payload);
    }
    return payload && typeof payload === "object" && "data" in payload ? payload.data : payload;
}

export async function signIn(username, password) {
    const result = await apiRequest("/users/auth/login", {
        method: "POST",
        body: JSON.stringify({ userName: username, userPassword: password })
    });
    if (!result?.token) throw new ApiError("Đăng nhập thành công nhưng backend không trả về token.");
    localStorage.setItem("unitlife.token", result.token);
    if (result.userId != null) localStorage.setItem("unitlife.userId", String(result.userId));
    localStorage.setItem("unitlife.username", username);
    return result;
}

export function signOut() {
    const token = localStorage.getItem("unitlife.token");
    localStorage.removeItem("unitlife.token");
    localStorage.removeItem("unitlife.userId");
    localStorage.removeItem("unitlife.username");
    return token;
}

export function formatVnd(value) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(value) || 0);
}

export function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
}
