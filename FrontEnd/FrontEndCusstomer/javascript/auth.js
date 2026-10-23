import { parseApiResponse, saveSession, showToast } from "./common.js";

const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const forgotForm = document.querySelector("#forgot-form");

document.addEventListener("click", event => {
    const button = event.target.closest("[data-toggle-password]");
    if (!button) return;
    const input = button.parentElement.querySelector("input");
    input.type = input.type === "password" ? "text" : "password";
    button.textContent = input.type === "password" ? "Hiện" : "Ẩn";
});

function setFormMessage(message, error = false) {
    const box = document.querySelector("#form-message");
    if (!box) return;
    box.textContent = message;
    box.classList.toggle("error", error);
    if (box.classList.contains("notice")) {
        box.classList.toggle("error", error);
        box.hidden = !message;
    }
}

function setLoading(form, loading, label) {
    const button = form.querySelector('button[type="submit"]');
    if (loading) {
        button.dataset.label = button.textContent;
        button.textContent = label;
        button.disabled = true;
    } else {
        button.textContent = button.dataset.label || button.textContent;
        button.disabled = false;
    }
}

if (loginForm) {
    loginForm.addEventListener("submit", async event => {
        event.preventDefault();
        setFormMessage("");
        const data = new FormData(loginForm);
        setLoading(loginForm, true, "Đang đăng nhập…");
        try {
            const response = await fetch("http://localhost:8080/users/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: String(data.get("userName")).trim(),
                    userPassword: data.get("userPassword")
                })
            });
            const result = await parseApiResponse(response);
            if (!result.checkAuthenticated) throw new Error("Thông tin đăng nhập không hợp lệ.");
            saveSession({ token: result.token, userId: result.userId, userName: String(data.get("userName")).trim() });
            const returnTo = new URLSearchParams(location.search).get("return");
            if (returnTo) {
                const target = new URL(returnTo, location.href);
                if (target.origin === location.origin) {
                    location.href = `${target.pathname}${target.search}${target.hash}`;
                    return;
                }
            }
            location.href = "../index.html";
        } catch (error) {
            setFormMessage(error.message || "Không thể đăng nhập.", true);
        } finally {
            setLoading(loginForm, false, "");
        }
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", async event => {
        event.preventDefault();
        setFormMessage("");
        const data = new FormData(registerForm);
        const password = String(data.get("userPassword"));
        if (password !== String(data.get("passwordConfirm"))) {
            setFormMessage("Mật khẩu nhập lại không khớp.", true);
            return;
        }
        setLoading(registerForm, true, "Đang tạo tài khoản…");
        try {
            const response = await fetch("http://localhost:8080/users/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: String(data.get("userName")).trim(),
                    userEmail: String(data.get("userEmail")).trim(),
                    userPhone: String(data.get("userPhone")).trim() || null,
                    userPassword: password
                })
            });
            await parseApiResponse(response);
            setFormMessage("Đăng ký thành công. Chuyển đến trang đăng nhập…");
            showToast("Tài khoản đã được tạo.");
            setTimeout(() => { location.href = "./login.html"; }, 900);
        } catch (error) {
            setFormMessage(error.message || "Không thể đăng ký tài khoản.", true);
        } finally {
            setLoading(registerForm, false, "");
        }
    });
}

if (forgotForm) {
    forgotForm.addEventListener("submit", event => {
        event.preventDefault();
        setFormMessage("Backend hiện chưa có endpoint quên mật khẩu. Chưa có email nào được gửi.", true);
    });
}
