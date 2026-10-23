import { apiRequest, escapeHtml, formatVnd, readFavorites, safeHttpUrl, writeFavorites } from "./api.js";
import { API_ENDPOINTS } from "./config.js";
import { isAvailable, roomTitle } from "./catalog.js";
import { requireSignIn, showToast } from "./common.js";

const content = document.querySelector("#detail-content");
const notice = document.querySelector("#detail-notice");
const roomId = new URLSearchParams(location.search).get("id");
const lightbox = document.querySelector("#lightbox");
let images = [];
let currentImage = 0;

function showNotice(message, error = false) {
    notice.textContent = message;
    notice.classList.toggle("error", error);
    notice.hidden = false;
}

function renderGallery() {
    const shown = images.filter(image => safeHttpUrl(image.imageUrl)).slice(0, 5);
    if (!shown.length) return '<div class="gallery-empty">Phòng chưa có hình ảnh được cung cấp.</div>';
    return shown.map((image, index) => `<button class="gallery-image" type="button" data-gallery="${index}" aria-label="Mở ảnh ${index + 1}">
      <img src="${escapeHtml(image.imageUrl)}" alt="${escapeHtml(image.imageName || `Ảnh phòng ${index + 1}`)}" ${index ? 'loading="lazy"' : ""}>
    </button>`).join("");
}

function renderDetail(room, motel, roomServices, services, roomAmenities, amenities) {
    const title = roomTitle(room);
    const address = room.roomAddress || motel?.motelAddress || "Chưa có địa chỉ";
    const saved = readFavorites().includes(String(room.roomId));
    const relatedServices = roomServices.map(link => services.find(item => String(item.serviceId) === String(link.serviceId))).filter(Boolean);
    const relatedAmenities = roomAmenities.map(link => amenities.find(item => String(item.amenityId) === String(link.amenityId))).filter(Boolean);

    content.innerHTML = `<div class="detail-titlebar">
      <div><span class="eyebrow">Thông tin phòng</span><h1>${escapeHtml(title)}</h1><p class="detail-address">⌖ ${escapeHtml(address)}</p></div>
      <div class="detail-actions"><button class="btn btn-secondary" type="button" data-favorite="${escapeHtml(room.roomId)}">${saved ? "♥ Đã yêu thích" : "♡ Yêu thích"}</button><a class="btn btn-secondary" href="./rooms.html">Quay lại danh sách</a></div>
    </div>
    <div class="detail-gallery" aria-label="Hình ảnh phòng">${renderGallery()}</div>
    <div class="detail-layout">
      <div class="detail-main">
        <div class="detail-summary">
          <div class="summary-item"><small>Giá thuê / tháng</small><strong class="room-price">${formatVnd(room.roomPrice)}</strong></div>
          <div class="summary-item"><small>Diện tích</small><strong>${room.roomArea ? `${escapeHtml(room.roomArea)} m²` : "Chưa cập nhật"}</strong></div>
          <div class="summary-item"><small>Tiền đặt cọc</small><strong>${room.roomDeposit == null ? "Chưa cập nhật" : formatVnd(room.roomDeposit)}</strong></div>
          <div class="summary-item"><small>Tình trạng</small><strong>${isAvailable(room) ? "Còn phòng" : escapeHtml(room.roomStatus || "Chưa cập nhật")}</strong></div>
        </div>
        <section class="detail-block"><h2>Mô tả phòng</h2><p>${escapeHtml(room.roomDescription || "Chưa có mô tả phòng.")}</p></section>
        <section class="detail-block"><h2>Dịch vụ</h2>${relatedServices.length ? `<div class="detail-tags">${relatedServices.map(item => `<span class="detail-tag">${escapeHtml(item.serviceName)}${item.servicePrice != null ? ` · ${formatVnd(item.servicePrice)}` : ""}</span>`).join("")}</div>` : '<p>Chưa có thông tin dịch vụ liên kết.</p>'}</section>
        <section class="detail-block"><h2>Tiện nghi</h2>${relatedAmenities.length ? `<div class="detail-tags">${relatedAmenities.map(item => `<span class="detail-tag">${escapeHtml(item.amenityName)}</span>`).join("")}</div>` : '<p>Chưa có thông tin tiện nghi liên kết.</p>'}</section>
        <section class="detail-block"><h2>Nhà trọ &amp; vị trí</h2><p><strong>${escapeHtml(motel?.motelName || "Chưa có tên nhà trọ")}</strong><br>${escapeHtml(motel?.motelAddress || address)}</p><div class="map-placeholder">Khu vực bản đồ<br>Chưa có tọa độ để hiển thị vị trí chính xác.</div>${motel?.universityIds?.length ? '<p class="muted">Nhà trọ có liên kết trường đại học, nhưng API hiện chưa trả mã trường trong danh sách trường để hiển thị tên.</p>' : ""}</section>
        <section class="detail-block"><h2>Chi phí khác</h2><p>Backend chưa cung cấp chi tiết chi phí điện, nước hoặc phí phát sinh cho phòng này.</p></section>
      </div>
      <aside class="contact-card"><h2>Liên hệ nhà trọ</h2><p>Thông tin liên hệ phụ thuộc dữ liệu do backend cung cấp.</p>
        <div class="contact-owner"><span class="owner-avatar">${escapeHtml((motel?.motelOwner || "Chủ").slice(0, 1))}</span><span><strong>${escapeHtml(motel?.motelOwner || "Chưa có tên chủ trọ")}</strong><small>${escapeHtml(motel?.motelName || "Chủ nhà trọ")}</small></span></div>
        <button class="btn btn-secondary" type="button" data-contact>Thông tin liên hệ</button>
        <button class="btn" type="button" data-rent>Gửi yêu cầu thuê</button>
        <p class="muted">Chưa có API liên hệ hoặc gửi yêu cầu thuê. Nút yêu cầu sẽ không tạo giao dịch.</p>
      </aside>
    </div>`;
}

function updateLightbox() {
    const image = lightbox.querySelector("img");
    image.src = safeHttpUrl(images[currentImage].imageUrl);
    image.alt = images[currentImage].imageName || `Ảnh phòng ${currentImage + 1}`;
    lightbox.querySelector(".lightbox-count").textContent = `${currentImage + 1} / ${images.length}`;
}

async function init() {
    if (!roomId || !/^\d+$/.test(roomId)) {
        content.innerHTML = '<div class="empty-state">Thiếu hoặc sai mã phòng. Hãy quay lại danh sách và chọn phòng cần xem.</div>';
        return;
    }

    try {
        const room = await apiRequest(`${API_ENDPOINTS.rooms}/${encodeURIComponent(roomId)}`);
        const [motelsResult, imagesResult, roomServicesResult, servicesResult, roomAmenitiesResult, amenitiesResult] = await Promise.allSettled([
            apiRequest(`${API_ENDPOINTS.motels}/${encodeURIComponent(room.motelId)}`),
            apiRequest(API_ENDPOINTS.roomImages(roomId)),
            apiRequest(API_ENDPOINTS.roomServices(roomId)),
            apiRequest("/services"),
            apiRequest(API_ENDPOINTS.roomAmenities(roomId)),
            apiRequest("/amenities")
        ]);
        const value = result => result.status === "fulfilled" ? result.value : [];
        const motel = motelsResult.status === "fulfilled" ? motelsResult.value : null;
        images = Array.isArray(value(imagesResult)) ? value(imagesResult).filter(image => safeHttpUrl(image.imageUrl)) : [];
        const roomServices = value(roomServicesResult);
        const services = value(servicesResult);
        const roomAmenities = value(roomAmenitiesResult);
        const amenities = value(amenitiesResult);
        renderDetail(room, motel, roomServices, services, roomAmenities, amenities);

        const failures = [motelsResult, imagesResult, roomServicesResult, servicesResult, roomAmenitiesResult, amenitiesResult]
            .filter(result => result.status === "rejected");
        if (failures.length) showNotice("Một số thông tin liên quan chưa tải được. Các nội dung có lỗi không được thay bằng dữ liệu giả.", true);
    } catch (error) {
        content.innerHTML = '<div class="empty-state">Không tải được chi tiết phòng. Phòng có thể không tồn tại hoặc API chưa sẵn sàng.</div>';
        showNotice(error.message, true);
    }
}

content.addEventListener("click", event => {
    const imageButton = event.target.closest("[data-gallery]");
    if (imageButton && images.length) {
        currentImage = Number(imageButton.dataset.gallery);
        updateLightbox();
        lightbox.hidden = false;
        return;
    }
    const favorite = event.target.closest("[data-favorite]");
    if (favorite) {
        const ids = new Set(readFavorites());
        ids.has(String(roomId)) ? ids.delete(String(roomId)) : ids.add(String(roomId));
        writeFavorites([...ids]);
        favorite.textContent = ids.has(String(roomId)) ? "♥ Đã yêu thích" : "♡ Yêu thích";
        showToast(ids.has(String(roomId)) ? "Đã lưu yêu thích trên thiết bị này." : "Đã bỏ yêu thích.");
        return;
    }
    if (event.target.closest("[data-contact]")) {
        showToast("Backend hiện chưa cung cấp số điện thoại hoặc API liên hệ chủ trọ.");
        return;
    }
    if (event.target.closest("[data-rent]") && requireSignIn()) {
        document.querySelector("#request-modal").hidden = false;
    }
});

document.querySelector("#request-modal").addEventListener("click", event => {
    if (event.target.matches("[data-close]") || event.target.id === "request-modal") {
        document.querySelector("#request-modal").hidden = true;
    }
});

lightbox.addEventListener("click", event => {
    if (event.target === lightbox || event.target.closest(".lightbox-close")) lightbox.hidden = true;
    if (event.target.closest(".lightbox-prev")) currentImage = (currentImage - 1 + images.length) % images.length;
    if (event.target.closest(".lightbox-next")) currentImage = (currentImage + 1) % images.length;
    if (event.target.closest(".lightbox-prev,.lightbox-next")) updateLightbox();
});

init();
