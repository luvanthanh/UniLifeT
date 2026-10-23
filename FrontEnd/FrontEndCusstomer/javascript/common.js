import { apiRequest, clearSession, escapeHtml, getSession } from "./api.js";
import { API_ENDPOINTS } from "./config.js";

let toastTimer;

export function showToast(message, variant = "") {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${variant}`.trim();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
}

export function requireSignIn(returnTo = window.location.href) {
    const { token } = getSession();
    if (!token) {
        window.location.href = `${document.body.dataset.root || "./"}pages/login.html?return=${encodeURIComponent(returnTo)}`;
        return false;
    }
    return true;
}

function renderChrome() {
    const root = document.body.dataset.root || "./";
    const header = document.querySelector("[data-site-header]");
    const footer = document.querySelector("[data-site-footer]");
    const current = document.body.dataset.page;
    const session = getSession();

    if (header) {
        header.className = "site-header";
        header.innerHTML = `<div class="container nav-wrap">
          <a class="brand" href="${root}index.html" aria-label="UniLifeT - Trang chủ"><span class="brand-mark">⌂</span><span>UniLife<span class="brand-t">T</span><small>TÌM PHÒNG GẦN TRƯỜNG</small></span></a>
          <nav class="main-nav" aria-label="Điều hướng chính">
            <a class="${current === "home" ? "active" : ""}" href="${root}index.html">Trang chủ</a>
            <a class="${current === "rooms" ? "active" : ""}" href="${root}pages/rooms.html">Tìm phòng</a>
            <a href="${root}index.html#universities">Trường đại học</a>
            <a class="${current === "favorites" ? "active" : ""}" href="${root}pages/favorites.html">Yêu thích</a>
            <a class="mobile-auth" href="${root}pages/login.html" ${session.token ? "hidden" : ""}>Đăng nhập</a>
            <a class="mobile-auth" href="${root}pages/register.html" ${session.token ? "hidden" : ""}>Đăng ký tài khoản</a>
            <a class="mobile-auth" href="${root}pages/profile.html" ${session.token ? "" : "hidden"}>Hồ sơ cá nhân</a>
            <button class="mobile-auth" type="button" data-logout ${session.token ? "" : "hidden"}>Đăng xuất</button>
          </nav>
          <div class="nav-actions">
            <a class="text-link" href="${root}pages/login.html" ${session.token ? "hidden" : ""}>Đăng nhập</a>
            <a class="text-link" href="${root}pages/register.html" ${session.token ? "hidden" : ""}>Đăng ký</a>
            <a class="text-link" href="${root}pages/profile.html" ${session.token ? "" : "hidden"}>${session.userName ? `Xin chào, ${escapeHtml(session.userName)}` : "Tài khoản"}</a>
            <button class="text-link" type="button" data-logout ${session.token ? "" : "hidden"}>Đăng xuất</button>
            <a class="btn" href="${root}pages/rooms.html">Khám phá phòng <span aria-hidden="true">↗</span></a>
            <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false">☰</button>
          </div>
        </div>`;
    }

    if (footer) {
        footer.className = "site-footer";
        footer.innerHTML = `<div class="container">
          <div class="footer-grid">
            <div class="footer-about"><a class="brand" href="${root}index.html"><span class="brand-mark">⌂</span><span>UniLife<span class="brand-t">T</span><small>TÌM PHÒNG GẦN TRƯỜNG</small></span></a><p>UniLifeT hỗ trợ sinh viên tìm phòng theo trường đại học, ngân sách và nhu cầu thực tế.</p></div>
            <div class="footer-column"><h3>Khám phá</h3><a href="${root}pages/rooms.html">Tìm phòng</a><a href="${root}index.html#universities">Trường đại học</a><a href="${root}pages/favorites.html">Phòng yêu thích</a></div>
            <div class="footer-column"><h3>Tài khoản</h3><a href="${root}pages/login.html">Đăng nhập</a><a href="${root}pages/register.html">Tạo tài khoản</a><a href="${root}pages/my-rentals.html">Yêu cầu thuê</a></div>
            <div class="footer-column"><h3>Hỗ trợ</h3><a href="${root}pages/forgot-password.html">Quên mật khẩu</a><span class="footer-contact">Chính sách và điều khoản sẽ được cập nhật.</span><span class="footer-contact">Thông tin liên hệ sẽ được cập nhật.</span></div>
          </div>
          <div class="footer-bottom"><span>© 2026 UniLifeT. Thông tin hiển thị phụ thuộc dữ liệu API.</span><span>Không đại diện cho bất kỳ tin đăng nào chưa được xác minh.</span></div>
        </div>`;
    }
}

document.addEventListener("click", async event => {
    const toggle = event.target.closest(".menu-toggle");
    if (toggle) {
        const nav = document.querySelector(".main-nav");
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    }

    const logout = event.target.closest("[data-logout]");
    if (logout) {
        logout.disabled = true;
        const { token } = getSession();
        try {
            if (token) await apiRequest(API_ENDPOINTS.logout, {
                method: "POST",
                body: JSON.stringify({ token })
            });
        } catch (error) {
            showToast(`Không xác nhận được đăng xuất phía máy chủ: ${error.message}. Đã xóa phiên trên thiết bị.`);
        } finally {
            clearSession();
            window.location.href = `${document.body.dataset.root || "./"}index.html`;
        }
    }
});

renderChrome();
