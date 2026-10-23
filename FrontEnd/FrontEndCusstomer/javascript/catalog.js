import { API_ENDPOINTS } from "./config.js";
import { apiRequest, escapeHtml, formatVnd, readFavorites, safeHttpUrl } from "./api.js";

export async function loadRooms() {
    const [rooms, motels, images] = await Promise.all([
        apiRequest(API_ENDPOINTS.rooms),
        apiRequest(API_ENDPOINTS.motels),
        apiRequest("/room-images")
    ]);
    return {
        rooms: Array.isArray(rooms) ? rooms : [],
        motels: Array.isArray(motels) ? motels : [],
        images: Array.isArray(images) ? images : []
    };
}

export async function loadRoomDirectory() {
    const [listingData, universities, services, amenities, roomAmenities] = await Promise.all([
        loadRooms(),
        apiRequest(API_ENDPOINTS.universities),
        apiRequest("/services"),
        apiRequest("/amenities"),
        apiRequest("/room-amenity")
    ]);
    return {
        ...listingData,
        universities: Array.isArray(universities) ? universities : [],
        services: Array.isArray(services) ? services : [],
        amenities: Array.isArray(amenities) ? amenities : [],
        roomAmenities: Array.isArray(roomAmenities) ? roomAmenities : []
    };
}

export function motelFor(room, motels) {
    return motels.find(motel => String(motel.motelId) === String(room.motelId));
}

export function roomImage(room, images) {
    return images.find(image => String(image.roomId) === String(room.roomId))?.imageUrl
        || room.imageUrl
        || "";
}

export function isAvailable(room) {
    const status = String(room.roomStatus || "").toLocaleLowerCase("vi");
    if (isUnavailable(room)) return false;
    return /available|vacant|còn phòng|phòng trống|đang trống/.test(status);
}

export function isUnavailable(room) {
    const status = String(room.roomStatus || "").toLocaleLowerCase("vi");
    return /unavailable|not available|rented|occupied|đã thuê|đã cho thuê|hết phòng|không còn|không trống/.test(status);
}

export function roomTitle(room) {
    return room.roomType || room.roomDescription || `Phòng #${room.roomId}`;
}

export function filterRooms(rooms, motels, filters = {}) {
    const query = (filters.q || "").trim().toLocaleLowerCase("vi");
    const minPrice = Number(filters.minPrice) || 0;
    const maxPrice = Number(filters.maxPrice) || Infinity;
    const minArea = Number(filters.minArea) || 0;
    const maxArea = Number(filters.maxArea) || Infinity;
    const serviceIds = filters.serviceIds || (filters.serviceId ? [filters.serviceId] : []);
    const amenityIds = filters.amenityIds || (filters.amenityId ? [filters.amenityId] : []);

    return rooms.filter(room => {
        const motel = motelFor(room, motels);
        const searchable = [
            room.roomType, room.roomDescription, room.roomAddress,
            motel?.motelName, motel?.motelAddress
        ].filter(Boolean).join(" ").toLocaleLowerCase("vi");
        const price = Number(room.roomPrice);
        const area = Number(room.roomArea);
        return searchable.includes(query)
            && price >= minPrice && price <= maxPrice
            && area >= minArea && area <= maxArea
            && (!filters.roomType || room.roomType === filters.roomType)
            && (!filters.status || (filters.status === "available" ? isAvailable(room) : isUnavailable(room)))
            && serviceIds.every(serviceId => (room.serviceIds || []).some(id => String(id) === String(serviceId)))
            && amenityIds.every(amenityId => filters.roomAmenities.some(item =>
                String(item.roomId) === String(room.roomId) && String(item.amenityId) === String(amenityId)));
    });
}

export function sortRooms(rooms, sort) {
    const sorted = [...rooms];
    if (sort === "price-asc") sorted.sort((a, b) => Number(a.roomPrice) - Number(b.roomPrice));
    if (sort === "price-desc") sorted.sort((a, b) => Number(b.roomPrice) - Number(a.roomPrice));
    if (sort === "area-desc") sorted.sort((a, b) => Number(b.roomArea) - Number(a.roomArea));
    return sorted;
}

export function renderRoomCards(rooms, motels, images, options = {}) {
    const favorites = new Set(readFavorites());
    if (!rooms.length) {
        return `<div class="empty-state"><strong>Không tìm thấy phòng trọ phù hợp.</strong><br>Hãy thử thay đổi hoặc xóa bớt bộ lọc.</div>`;
    }

    return rooms.map(room => {
        const motel = motelFor(room, motels);
        const id = String(room.roomId);
        const title = roomTitle(room);
        const image = safeHttpUrl(roomImage(room, images));
        const address = room.roomAddress || motel?.motelAddress || "Chưa có địa chỉ";
        const favorite = favorites.has(id);
        const detailHref = `${options.detailHrefPrefix || "./pages/room-detail.html"}?id=${encodeURIComponent(id)}`;
        const serviceNames = (room.serviceIds || [])
            .map(serviceId => options.services?.find(service => String(service.serviceId) === String(serviceId))?.serviceName)
            .filter(Boolean);
        const amenityNames = (options.roomAmenities || [])
            .filter(link => String(link.roomId) === id)
            .map(link => options.amenities?.find(amenity => String(amenity.amenityId) === String(link.amenityId))?.amenityName)
            .filter(Boolean);
        const highlights = [...new Set([...serviceNames, ...amenityNames])].slice(0, 3);
        return `<article class="room-card">
          <a class="room-photo" href="${detailHref}" aria-label="Xem ${escapeHtml(title)}">
            ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy">` : `<span class="no-image">Chưa có hình ảnh</span>`}
            <span class="room-badge ${isAvailable(room) ? "" : "unavailable"}">${isAvailable(room) ? "Còn phòng" : escapeHtml(room.roomStatus || "Trạng thái chưa rõ")}</span>
          </a>
          <button class="favorite-btn ${favorite ? "saved" : ""}" type="button" data-favorite="${escapeHtml(id)}" aria-label="${favorite ? "Bỏ yêu thích" : "Thêm yêu thích"}">${favorite ? "♥" : "♡"}</button>
          <div class="room-content">
            <h3 class="room-title"><a href="${detailHref}">${escapeHtml(title)}</a></h3>
            <p class="room-location">⌖ ${escapeHtml(address)}</p>
            <div class="room-meta"><span>${room.roomArea ? `${escapeHtml(room.roomArea)} m²` : "Chưa có diện tích"}</span><span>${escapeHtml(motel?.motelName || "Nhà trọ")}</span></div>
            ${highlights.length ? `<div class="room-highlights">${highlights.map(name => `<span>${escapeHtml(name)}</span>`).join("")}</div>` : ""}
            <div class="room-price-line"><span class="room-price">${formatVnd(room.roomPrice)} <small>/ tháng</small></span><a class="room-detail" href="${detailHref}">Chi tiết →</a></div>
          </div>
        </article>`;
    }).join("");
}

export function filterFromSearchParams(params) {
    return {
        q: params.get("q") || "",
        minPrice: params.get("minPrice") || "",
        maxPrice: params.get("maxPrice") || "",
        minArea: params.get("minArea") || "",
        maxArea: params.get("maxArea") || "",
        roomType: params.get("roomType") || "",
        status: params.get("status") || "",
        serviceIds: params.getAll("serviceId"),
        amenityIds: params.getAll("amenityId")
    };
}
