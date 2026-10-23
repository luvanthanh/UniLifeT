import { loadRoomDirectory, renderRoomCards } from "./catalog.js";

const roomGrid = document.querySelector("#home-room-grid");
const roomNotice = document.querySelector("#home-notice");
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

loadFeaturedRooms();
