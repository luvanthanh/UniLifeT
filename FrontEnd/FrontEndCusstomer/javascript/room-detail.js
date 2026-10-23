import { escapeHtml, formatVnd, parseApiResponse, safeHttpUrl } from "./common.js";
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
    const address = room.roomAddress || motel?.motelAddress || "API không cung cấp địa chỉ";
    const relatedServices = roomServices.map(link => services.find(item => String(item.serviceId) === String(link.serviceId))).filter(Boolean);
    const relatedAmenities = roomAmenities.map(link => amenities.find(item => String(item.amenityId) === String(link.amenityId))).filter(Boolean);

    content.innerHTML = `<div class="detail-titlebar">
      <div><span class="eyebrow">Thông tin phòng</span><h1>${escapeHtml(title)}</h1><p class="detail-address">⌖ ${escapeHtml(address)}</p></div>
      <div class="detail-actions"><a class="btn btn-secondary" href="./rooms.html">Quay lại danh sách</a></div>
    </div>
    <div class="detail-gallery" aria-label="Hình ảnh phòng">${renderGallery()}</div>
    <div class="detail-layout">
      <div class="detail-main">
        <div class="detail-summary">
          <div class="summary-item"><small>Giá thuê / tháng</small><strong class="room-price">${formatVnd(room.roomPrice)}</strong></div>
          <div class="summary-item"><small>Diện tích</small><strong>${room.roomArea ? `${escapeHtml(room.roomArea)} m²` : "API không cung cấp"}</strong></div>
          <div class="summary-item"><small>Tiền đặt cọc</small><strong>${room.roomDeposit == null ? "API không cung cấp" : formatVnd(room.roomDeposit)}</strong></div>
          <div class="summary-item"><small>Tình trạng</small><strong>${isAvailable(room) ? "Còn phòng" : escapeHtml(room.roomStatus || "API không cung cấp")}</strong></div>
        </div>
        <section class="detail-block"><h2>Mô tả phòng</h2><p>${escapeHtml(room.roomDescription || "API không cung cấp mô tả phòng.")}</p></section>
        <section class="detail-block"><h2>Dịch vụ</h2>${relatedServices.length ? `<div class="detail-tags">${relatedServices.map(item => `<span class="detail-tag">${escapeHtml(item.serviceName)}${item.servicePrice != null ? ` · ${formatVnd(item.servicePrice)}` : ""}</span>`).join("")}</div>` : '<p>Chưa có thông tin dịch vụ liên kết.</p>'}</section>
        <section class="detail-block"><h2>Tiện nghi</h2>${relatedAmenities.length ? `<div class="detail-tags">${relatedAmenities.map(item => `<span class="detail-tag">${escapeHtml(item.amenityName)}</span>`).join("")}</div>` : '<p>Chưa có thông tin tiện nghi liên kết.</p>'}</section>
        <section class="detail-block"><h2>Nhà trọ &amp; vị trí</h2><p><strong>${escapeHtml(motel?.motelName || "API không cung cấp tên nhà trọ")}</strong><br>${escapeHtml(motel?.motelAddress || address)}</p>${motel?.universityIds?.length ? '<p class="muted">Nhà trọ có liên kết với trường đại học trong hệ thống.</p>' : ""}</section>
        <section class="detail-block"><h2>Chi phí khác</h2><p>Backend chưa cung cấp chi tiết chi phí điện, nước hoặc phí phát sinh cho phòng này.</p></section>
      </div>
      <aside class="contact-card"><h2>Liên hệ nhà trọ</h2><p>Thông tin liên hệ phụ thuộc dữ liệu do backend cung cấp.</p>
        ${motel?.motelOwner ? `<div class="contact-owner"><span class="owner-avatar">${escapeHtml(motel.motelOwner.slice(0, 1))}</span><span><strong>${escapeHtml(motel.motelOwner)}</strong>${motel.motelName ? `<small>${escapeHtml(motel.motelName)}</small>` : ""}</span></div>` : '<p class="muted">API không cung cấp thông tin chủ trọ.</p>'}
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
        const roomResponse = await fetch(`http://localhost:8080/roms/${encodeURIComponent(roomId)}`);
        const room = await parseApiResponse(roomResponse);
        const [motelsResult, imagesResult, roomServicesResult, servicesResult, roomAmenitiesResult, amenitiesResult] = await Promise.allSettled([
            fetch(`http://localhost:8080/motels/${encodeURIComponent(room.motelId)}`).then(parseApiResponse),
            fetch(`http://localhost:8080/room-images/get-room-image/${encodeURIComponent(roomId)}`).then(parseApiResponse),
            fetch(`http://localhost:8080/room-service/get-room-service/${encodeURIComponent(roomId)}`).then(parseApiResponse),
            fetch("http://localhost:8080/services").then(parseApiResponse),
            fetch(`http://localhost:8080/room-amenity/get-room-amenity/${encodeURIComponent(roomId)}`).then(parseApiResponse),
            fetch("http://localhost:8080/amenities").then(parseApiResponse)
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
