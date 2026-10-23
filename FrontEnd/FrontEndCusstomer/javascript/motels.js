import { escapeHtml, parseApiResponse } from "./common.js";
import { renderRoomCards } from "./catalog.js";

const content = document.querySelector("#motels-content");
const notice = document.querySelector("#motels-notice");
const title = document.querySelector("#motels-title");
const description = document.querySelector("#motels-description");
const eyebrow = document.querySelector("#motels-eyebrow");
const breadcrumb = document.querySelector("#motel-breadcrumb");
const params = new URLSearchParams(location.search);
const universityId = params.get("universityId");
const motelId = params.get("motelId");

function showError(error) {
    notice.textContent = error.message;
    notice.classList.add("error");
    notice.hidden = false;
    content.innerHTML = '<p class="empty-state">Không tải được dữ liệu từ API.</p>';
}

function renderMotels(motels) {
    if (!motels.length) {
        content.innerHTML = '<p class="empty-state">API hiện chưa có nhà trọ liên kết với trường này.</p>';
        return;
    }

    content.innerHTML = `<div class="motel-grid">${motels.map(motel => {
        const motelIdValue = motel.motelId;
        const href = `./motel.html?motelId=${encodeURIComponent(motelIdValue)}`;
        const card = `<h2>${escapeHtml(motel.motelName || "API không cung cấp tên nhà trọ")}</h2>
          ${motel.motelAddress ? `<p>${escapeHtml(motel.motelAddress)}</p>` : ""}
          ${motel.motelOwner ? `<p class="motel-owner">${escapeHtml(motel.motelOwner)}</p>` : ""}
          <p class="motel-link">Xem phòng tại nhà trọ →</p>`;
        return motelIdValue === null || motelIdValue === undefined
            ? `<article class="motel-card">${card}</article>`
            : `<a class="motel-card" href="${href}">${card}</a>`;
    }).join("")}</div>`;
}

async function loadMotelsForUniversity() {
    const [universityResponse, motelsResponse] = await Promise.all([
        fetch(`http://localhost:8080/universities/${encodeURIComponent(universityId)}`),
        fetch("http://localhost:8080/motels")
    ]);
    const [university, motels] = await Promise.all([
        parseApiResponse(universityResponse),
        parseApiResponse(motelsResponse)
    ]);
    if (!Array.isArray(motels)) throw new Error("API nhà trọ trả về dữ liệu không đúng định dạng.");

    const universityName = university.universityName || "Trường đại học";
    title.textContent = `Nhà trọ gần ${universityName}`;
    description.textContent = "Danh sách nhà trọ được liên kết với trường trong dữ liệu backend.";
    eyebrow.textContent = "Nhà trọ theo trường";
    breadcrumb.textContent = universityName;
    renderMotels(motels.filter(motel =>
        Array.isArray(motel.universityIds)
        && motel.universityIds.some(id => String(id) === String(universityId))
    ));
}

async function loadRoomsForMotel() {
    const [motelResponse, roomsResponse, imagesResponse] = await Promise.all([
        fetch(`http://localhost:8080/motels/${encodeURIComponent(motelId)}`),
        fetch("http://localhost:8080/roms"),
        fetch("http://localhost:8080/room-images")
    ]);
    const [motel, rooms, images] = await Promise.all([
        parseApiResponse(motelResponse),
        parseApiResponse(roomsResponse),
        parseApiResponse(imagesResponse)
    ]);
    if (!Array.isArray(rooms) || !Array.isArray(images)) {
        throw new Error("API phòng hoặc hình ảnh trả về dữ liệu không đúng định dạng.");
    }

    const motelName = motel.motelName || "Nhà trọ";
    title.textContent = motelName;
    description.textContent = motel.motelAddress || "API không cung cấp địa chỉ nhà trọ.";
    eyebrow.textContent = "Phòng trong nhà trọ";
    breadcrumb.textContent = motelName;
    const motelRooms = rooms.filter(room => String(room.motelId) === String(motelId));
    const imageUrls = images.filter(image => motelRooms.some(room => String(room.roomId) === String(image.roomId)));
    content.classList.add("motel-rooms");
    content.innerHTML = motelRooms.length
        ? `<h2 class="motel-section-title">Danh sách phòng</h2>${renderRoomCards(
            motelRooms,
            [motel],
            imageUrls,
            { detailHrefPrefix: "./room-detail.html" }
        )}`
        : '<p class="empty-state">API hiện chưa có phòng trong nhà trọ này.</p>';

    if (motel.motelOwner) {
        const owner = document.createElement("p");
        owner.className = "muted";
        owner.textContent = `Chủ trọ: ${motel.motelOwner}`;
        description.after(owner);
    }

}

async function init() {
    try {
        if (universityId && /^\d+$/.test(universityId) && !motelId) {
            await loadMotelsForUniversity();
            return;
        }
        if (motelId && /^\d+$/.test(motelId) && !universityId) {
            await loadRoomsForMotel();
            return;
        }
        throw new Error("Thiếu hoặc sai mã trường/nhà trọ trong đường dẫn.");
    } catch (error) {
        showError(error);
    }
}

init();
