import { getSession, parseApiResponse, requireSignIn, safeHttpUrl, showToast } from "./common.js";

const session = getSession();
const form = document.querySelector("#profile-form");
const notice = document.querySelector("#profile-notice");
let original = null;
let editing = false;

function showNotice(message, error = false) {
    notice.textContent = message;
    notice.classList.toggle("error", error);
    notice.hidden = false;
}

if (requireSignIn()) {
    loadProfile();
}

async function loadProfile() {
    if (!session.userId) {
        showNotice("Phiên đăng nhập không có mã người dùng. Hãy đăng nhập lại.", true);
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/users/${encodeURIComponent(session.userId)}`, {
            headers: { Authorization: `Bearer ${session.token}` }
        });
        original = await parseApiResponse(response);
        for (const key of ["userName", "userEmail", "userPhone", "userGender", "userBirthday", "userAddress"]) {
            form.elements[key].value = original[key] || "";
        }
        document.querySelector("#profile-name").textContent = original.userName || "Tài khoản";
        document.querySelector("#profile-email").textContent = original.userEmail || "";
        const avatar = document.querySelector("#profile-avatar");
        const avatarUrl = safeHttpUrl(original.userAvatar);
        avatar.textContent = "";
        if (avatarUrl) {
            const image = document.createElement("img");
            image.src = avatarUrl;
            image.alt = "Ảnh đại diện";
            avatar.append(image);
        } else if (original.userName) {
            avatar.textContent = original.userName.slice(0, 1).toLocaleUpperCase("vi");
        }
        form.hidden = false;
        document.querySelector("#profile-edit").disabled = false;
        setEditing(false);
        notice.hidden = true;
    } catch (error) {
        const message = error.status === 403
            ? "Backend hiện chỉ cấp quyền xem hồ sơ cho ADMIN. Tài khoản sinh viên không thể tải hồ sơ qua API này."
            : error.message;
        showNotice(message, true);
    }
}

document.querySelector("#profile-cancel").addEventListener("click", () => {
    if (!original) return;
    for (const key of ["userName", "userEmail", "userPhone", "userGender", "userBirthday", "userAddress"]) {
        form.elements[key].value = original[key] || "";
    }
    setEditing(false);
});

document.querySelector("#profile-edit").addEventListener("click", () => setEditing(true));

function setEditing(value) {
    editing = value;
    for (const field of form.querySelectorAll("input")) field.disabled = !value;
    document.querySelector("#profile-save").disabled = !value;
    document.querySelector("#profile-cancel").disabled = !value;
    document.querySelector("#profile-edit").disabled = value;
}

form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!original || !session.userId || !editing) return;
    showNotice("Chưa gửi thay đổi: API PUT hiện ánh xạ cả mật khẩu, nhưng hồ sơ đọc được không có mật khẩu. Gửi form có thể làm mất mật khẩu tài khoản. Cần backend hỗ trợ cập nhật từng phần trước khi bật lưu.", true);
    showToast("Chưa gửi cập nhật hồ sơ để tránh ghi đè mật khẩu.");
});
