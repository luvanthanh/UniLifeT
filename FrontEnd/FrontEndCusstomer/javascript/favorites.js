import { escapeHtml, readFavorites, writeFavorites } from "./api.js";
import { loadRoomDirectory, renderRoomCards } from "./catalog.js";
import { showToast } from "./common.js";

const grid = document.querySelector("#favorites-grid");
const notice = document.querySelector("#favorites-notice");

async function renderFavorites() {
    try {
        const directory = await loadRoomDirectory();
        const ids = new Set(readFavorites());
        const favoriteRooms = directory.rooms.filter(room => ids.has(String(room.roomId)));
        grid.innerHTML = renderRoomCards(favoriteRooms, directory.motels, directory.images, {
            ...directory,
            detailHrefPrefix: "./room-detail.html"
        });
        if (ids.size && !favoriteRooms.length) {
            notice.textContent = "Danh sách đã lưu nhưng các phòng này không còn trong dữ liệu API.";
            notice.hidden = false;
        } else {
            notice.hidden = true;
        }
    } catch (error) {
        grid.innerHTML = '<div class="empty-state">Không thể tải thông tin phòng yêu thích.</div>';
        notice.textContent = error.message;
        notice.classList.add("error");
        notice.hidden = false;
    }
}

grid.addEventListener("click", event => {
    const button = event.target.closest("[data-favorite]");
    if (!button) return;
    const id = button.dataset.favorite;
    writeFavorites(readFavorites().filter(savedId => savedId !== id));
    showToast("Đã bỏ phòng khỏi danh sách yêu thích trên thiết bị này.");
    renderFavorites();
});

renderFavorites();
