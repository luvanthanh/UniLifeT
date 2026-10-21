import { ApiError, apiRequest, escapeHtml, formatVnd, signIn } from "../../shared/api.js";

const demoRooms = [
    { roomId: "demo-1", roomPrice: 3200000, roomArea: 28, roomType: "Studio", roomStatus: "Available", roomAddress: "Hải Châu, Đà Nẵng", roomDescription: "Studio thoáng sáng gần trung tâm", image: "photo-1522708323590-d24dbb6b0267" },
    { roomId: "demo-2", roomPrice: 4500000, roomArea: 35, roomType: "1 phòng ngủ", roomStatus: "Available", roomAddress: "Sơn Trà, Đà Nẵng", roomDescription: "Căn hộ tiện nghi gần biển", image: "photo-1505693416388-ac5ce068fe85" },
    { roomId: "demo-3", roomPrice: 2800000, roomArea: 24, roomType: "Phòng riêng", roomStatus: "Available", roomAddress: "Liên Chiểu, Đà Nẵng", roomDescription: "Phòng riêng yên tĩnh, nhiều ánh sáng", image: "photo-1523755231516-e43fd2e8dca5" }
];

let rooms = [];
let motels = [];
let roomImages = [];
let filterKind = "all";

const imageUrl = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=850&q=80`;
const notice = document.querySelector("#api-notice");
const grid = document.querySelector("#room-grid");
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function motelFor(room) {
    return motels.find(motel => motel.motelId === room.motelId);
}

function imageFor(room, index) {
    const linkedImage = roomImages.find(image => image.roomId === room.roomId)?.imageUrl;
    return linkedImage || room.imageUrl || imageUrl(demoRooms[index % demoRooms.length].image);
}

function renderRooms() {
    const query = document.querySelector("#search-location").value.trim().toLocaleLowerCase("vi");
    const budget = Number(document.querySelector("#search-budget").value) || Infinity;
    const filtered = rooms.filter(room => {
        const motel = motelFor(room);
        const location = `${room.roomAddress || ""} ${motel?.motelAddress || ""} ${motel?.motelName || ""}`.toLocaleLowerCase("vi");
        const isAvailable = /available|còn|trống/i.test(room.roomStatus || "");
        const lowPrice = Number(room.roomPrice) <= 3500000;
        return location.includes(query) && Number(room.roomPrice) <= budget
            && (filterKind !== "available" || isAvailable)
            && (filterKind !== "low" || lowPrice);
    });
    document.querySelector("#result-count").textContent = `${filtered.length} phòng phù hợp`;
    const saved = new Set(JSON.parse(localStorage.getItem("unitlife.favorites") || "[]"));

    if (!filtered.length) {
        grid.innerHTML = '<div class="empty">Chưa tìm thấy phòng phù hợp. Hãy thử điều chỉnh khu vực hoặc ngân sách nhé.</div>';
        return;
    }

    grid.innerHTML = filtered.map((room, index) => {
        const motel = motelFor(room);
        const title = room.roomType || room.roomDescription || "Phòng cho thuê";
        const area = room.roomArea ? `${escapeHtml(room.roomArea)} m²` : "Diện tích linh hoạt";
        const address = room.roomAddress || motel?.motelAddress || "Đang cập nhật địa chỉ";
        const available = /available|còn|trống/i.test(room.roomStatus || "");
        return `<article class="room-card">
          <div class="room-photo"><img src="${escapeHtml(imageFor(room, index))}" alt="${escapeHtml(title)}" loading="lazy"><span class="room-badge">${available ? "● Đang nhận khách" : "Không khả dụng"}</span><button class="favorite-btn ${saved.has(room.roomId) ? "saved" : ""}" data-favorite="${escapeHtml(room.roomId)}" aria-label="Lưu phòng">${saved.has(room.roomId) ? "♥" : "♡"}</button></div>
          <div class="room-content"><div class="room-topline"><h3 class="room-title">${escapeHtml(title)}</h3><span class="rating">★ 4.9</span></div><p class="room-location">⌖ ${escapeHtml(address)}</p><div class="room-meta"><span>▧ ${area}</span><span>⌂ ${escapeHtml(motel?.motelName || "UniLifeT")}</span></div><div class="room-price-line"><span class="room-price">${formatVnd(room.roomPrice)} <small>/ tháng</small></span><button class="room-detail" data-detail="${escapeHtml(room.roomId)}">Chi tiết ↗</button></div></div>
        </article>`;
    }).join("");
}

async function loadListings() {
    try {
        const [roomData, motelData, imageData] = await Promise.all([
            apiRequest("/roms"), apiRequest("/motels"), apiRequest("/room-images")
        ]);
        rooms = Array.isArray(roomData) ? roomData : [];
        motels = Array.isArray(motelData) ? motelData : [];
        roomImages = Array.isArray(imageData) ? imageData : [];
        notice.hidden = true;
        renderRooms();
    } catch (error) {
        if (!(error instanceof ApiError)) throw error;
        rooms = demoRooms;
        motels = [];
        roomImages = [];
        notice.textContent = `${error.message} Đang hiển thị dữ liệu minh họa.`;
        notice.hidden = false;
        renderRooms();
    }
}

document.querySelector("#search-form").addEventListener("submit", event => {
    event.preventDefault();
    renderRooms();
    document.querySelector("#rooms").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll(".filter-chip").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
    filterKind = button.dataset.kind;
    renderRooms();
}));

grid.addEventListener("click", event => {
    const favorite = event.target.closest("[data-favorite]");
    if (favorite) {
        const favorites = new Set(JSON.parse(localStorage.getItem("unitlife.favorites") || "[]"));
        const id = favorite.dataset.favorite;
        favorites.has(id) ? favorites.delete(id) : favorites.add(id);
        localStorage.setItem("unitlife.favorites", JSON.stringify([...favorites]));
        renderRooms();
        return;
    }
    const detail = event.target.closest("[data-detail]");
    if (detail) showToast(`Phòng #${detail.dataset.detail} · Hãy đăng nhập để tiếp tục trao đổi với chủ trọ.`);
});

const loginModal = document.querySelector("#login-modal");
document.querySelector("#login-open").addEventListener("click", () => { loginModal.hidden = false; });
loginModal.addEventListener("click", event => { if (event.target === loginModal || event.target.closest("[data-close]")) loginModal.hidden = true; });
document.querySelector("#login-form").addEventListener("submit", async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    try {
        await signIn(form.get("username"), form.get("password"));
        loginModal.hidden = true;
        showToast("Đăng nhập thành công. Chào mừng bạn!");
    } catch (error) {
        showToast(error.message);
    } finally {
        button.disabled = false;
    }
});

document.querySelector("#menu-toggle").addEventListener("click", () => document.querySelector(".main-nav").classList.toggle("open"));
loadListings();
