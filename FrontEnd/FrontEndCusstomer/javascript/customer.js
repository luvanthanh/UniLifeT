import { apiRequest, escapeHtml, readFavorites, writeFavorites } from "./api.js";
import { API_ENDPOINTS } from "./config.js";
import { loadRoomDirectory, renderRoomCards } from "./catalog.js";
import { showToast } from "./common.js";

const roomGrid = document.querySelector("#home-room-grid");
const roomNotice = document.querySelector("#home-notice");
const universityGrid = document.querySelector("#home-university-grid");
const universityNotice = document.querySelector("#university-notice");

function showNotice(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("error", isError);
    element.hidden = false;
}

async function loadFeaturedRooms() {
    try {
        const directory = await loadRoomDirectory();
        roomGrid.innerHTML = renderRoomCards(directory.rooms.slice(0, 6), directory.motels, directory.images, directory);
        if (!directory.rooms.length) roomNotice.textContent = "API hiện chưa có phòng để hiển thị.";
        else roomNotice.hidden = true;
    } catch (error) {
        roomGrid.innerHTML = '<div class="empty-state">Không thể tải danh sách phòng. Vui lòng thử lại sau.</div>';
        showNotice(roomNotice, error.message, true);
    }
}

async function loadUniversities() {
    try {
        const universities = await apiRequest(API_ENDPOINTS.universities);
        if (!Array.isArray(universities) || !universities.length) {
            universityGrid.innerHTML = '<div class="empty-state">API hiện chưa có thông tin trường đại học.</div>';
            return;
        }

        universityGrid.innerHTML = universities.map(university => `<article class="university-card">
          <span class="university-symbol" aria-hidden="true">${escapeHtml((university.universityCode || university.universityName || "ĐH").slice(0, 2))}</span>
          <div><h3>${escapeHtml(university.universityName || "Chưa có tên trường")}</h3><p>${escapeHtml([university.universityDistrict, university.universityCity].filter(Boolean).join(", ") || university.universityAddress || "Chưa có khu vực")}</p></div>
          <span class="university-filter-note" title="Backend chưa trả mã trường trong UniversityResponse">Thông tin từ API UniLifeT</span>
        </article>`).join("");
    } catch (error) {
        universityGrid.innerHTML = '<div class="empty-state">Không thể tải danh sách trường.</div>';
        showNotice(universityNotice, error.message, true);
    }
}

document.querySelector("#home-search").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const key of ["q", "maxPrice"]) {
        const value = String(form.get(key) || "").trim();
        if (value) params.set(key, value);
    }
    const query = params.toString();
    window.location.href = `./pages/rooms.html${query ? `?${query}` : ""}`;
});

roomGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-favorite]");
    if (!button) return;
    const id = button.dataset.favorite;
    const favorites = new Set(readFavorites());
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    writeFavorites([...favorites]);
    loadFeaturedRooms();
    showToast(favorites.has(id) ? "Đã lưu phòng yêu thích trên thiết bị này." : "Đã bỏ phòng khỏi danh sách yêu thích.");
});

loadFeaturedRooms();
loadUniversities();
