import { apiRequest, escapeHtml, readFavorites, writeFavorites } from "./api.js";
import { API_ENDPOINTS } from "./config.js";
import { filterFromSearchParams, filterRooms, loadRoomDirectory, renderRoomCards, sortRooms } from "./catalog.js";
import { showToast } from "./common.js";

const form = document.querySelector("#room-filters");
const grid = document.querySelector("#room-grid");
const count = document.querySelector("#result-count");
const notice = document.querySelector("#listing-notice");
const params = new URLSearchParams(window.location.search);
const filters = filterFromSearchParams(params);
let directory;
let sort = params.get("sort") || "recommended";
let visibleLimit = 6;

function setFormValues() {
    for (const name of ["q", "minPrice", "maxPrice", "minArea", "maxArea", "roomType", "status"]) {
        if (form.elements[name]) form.elements[name].value = filters[name] || "";
    }
    document.querySelector("#room-sort").value = sort;
}

function setFiltersDisabled(disabled) {
    form.querySelectorAll("input, select, button").forEach(control => { control.disabled = disabled; });
    document.querySelector("#room-sort").disabled = disabled;
}

function selectedValues(name) {
    return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

function readFilters() {
    return {
        q: form.elements.q.value.trim(),
        minPrice: form.elements.minPrice.value,
        maxPrice: form.elements.maxPrice.value,
        minArea: form.elements.minArea.value,
        maxArea: form.elements.maxArea.value,
        roomType: form.elements.roomType.value,
        status: form.elements.status.value,
        serviceIds: selectedValues("serviceId"),
        amenityIds: selectedValues("amenityId"),
        roomAmenities: directory.roomAmenities
    };
}

function render() {
    const matched = filterRooms(directory.rooms, directory.motels, readFilters());
    const sorted = sortRooms(matched, sort);
    const visible = sorted.slice(0, visibleLimit);
    count.textContent = `${matched.length} phòng phù hợp`;
    grid.innerHTML = renderRoomCards(visible, directory.motels, directory.images, { detailHrefPrefix: "./room-detail.html" });
    document.querySelector("#load-more").hidden = visibleLimit >= sorted.length;
    document.querySelector("#listing-summary").textContent = matched.length
        ? `Tìm thấy ${matched.length} phòng theo điều kiện hiện tại.`
        : "Hãy thử xóa bớt bộ lọc để mở rộng kết quả.";
}

function syncUrl() {
    const current = readFilters();
    const next = new URLSearchParams();
    for (const name of ["q", "minPrice", "maxPrice", "minArea", "maxArea", "roomType", "status"]) {
        if (current[name]) next.set(name, current[name]);
    }
    current.serviceIds.forEach(id => next.append("serviceId", id));
    current.amenityIds.forEach(id => next.append("amenityId", id));
    if (sort !== "recommended") next.set("sort", sort);
    const query = next.toString();
    history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}`);
}

function addCheckboxes(target, values, idKey, nameKey, inputName, selected) {
    if (!values.length) {
        target.innerHTML = '<span class="muted">API chưa có dữ liệu.</span>';
        return;
    }
    target.innerHTML = values.map(value => {
        const id = String(value[idKey]);
        const checked = selected.includes(id) ? "checked" : "";
        return `<label class="check-option"><input type="checkbox" name="${inputName}" value="${escapeHtml(id)}" ${checked}><span>${escapeHtml(value[nameKey] || `#${id}`)}</span></label>`;
    }).join("");
}

function fillOptionList(select, values, selected) {
    const types = [...new Set(values.map(room => room.roomType).filter(Boolean))];
    select.innerHTML = '<option value="">Tất cả loại phòng</option>' + types
        .map(type => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("");
    select.value = selected || "";
}

function applyFromLocation() {
    const current = filterFromSearchParams(new URLSearchParams(location.search));
    Object.assign(filters, current);
    sort = new URLSearchParams(location.search).get("sort") || "recommended";
    setFormValues();
    document.querySelectorAll('input[name="serviceId"]').forEach(input => {
        input.checked = current.serviceIds.includes(input.value);
    });
    document.querySelectorAll('input[name="amenityId"]').forEach(input => {
        input.checked = current.amenityIds.includes(input.value);
    });
}

async function init() {
    setFormValues();
    try {
        directory = await loadRoomDirectory();
        fillOptionList(form.elements.roomType, directory.rooms, filters.roomType);
        addCheckboxes(document.querySelector("#service-filters"), directory.services, "serviceId", "serviceName", "serviceId", filters.serviceIds || []);
        addCheckboxes(document.querySelector("#amenity-filters"), directory.amenities, "amenityId", "amenityName", "amenityId", filters.amenityIds || []);
        applyFromLocation();
        setFiltersDisabled(false);
        render();
        notice.hidden = true;
    } catch (error) {
        setFiltersDisabled(true);
        document.querySelector("#service-filters").innerHTML = '<span class="muted">Không tải được bộ lọc dịch vụ.</span>';
        document.querySelector("#amenity-filters").innerHTML = '<span class="muted">Không tải được bộ lọc tiện nghi.</span>';
        grid.innerHTML = '<div class="empty-state">Không tải được dữ liệu phòng. Kiểm tra API rồi thử tải lại trang.</div>';
        count.textContent = "Không thể tải kết quả";
        notice.textContent = error.message;
        notice.classList.add("error");
        notice.hidden = false;
    }
}

form.addEventListener("submit", event => {
    event.preventDefault();
    visibleLimit = 6;
    syncUrl();
    render();
    closeFilterDrawer();
});

form.addEventListener("reset", () => {
    setTimeout(() => {
        document.querySelectorAll("#service-filters input, #amenity-filters input").forEach(input => { input.checked = false; });
        sort = "recommended";
        document.querySelector("#room-sort").value = sort;
        visibleLimit = 6;
        syncUrl();
        render();
    });
});

document.querySelector("#room-sort").addEventListener("change", event => {
    sort = event.target.value;
    visibleLimit = 6;
    syncUrl();
    render();
});

document.querySelector("#load-more").addEventListener("click", () => {
    visibleLimit += 6;
    render();
});

grid.addEventListener("click", event => {
    const button = event.target.closest("[data-favorite]");
    if (!button) return;
    const favorites = new Set(readFavorites());
    const id = button.dataset.favorite;
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    writeFavorites([...favorites]);
    render();
    showToast(favorites.has(id) ? "Đã lưu vào yêu thích trên thiết bị này." : "Đã bỏ khỏi yêu thích.");
});

function closeFilterDrawer() {
    document.querySelector("#filter-panel").classList.remove("open");
    document.querySelector("#filter-shade").classList.remove("open");
}

document.querySelector("#filter-open").addEventListener("click", () => {
    document.querySelector("#filter-panel").classList.add("open");
    document.querySelector("#filter-shade").classList.add("open");
});
document.querySelector("#filter-close").addEventListener("click", closeFilterDrawer);
document.querySelector("#filter-shade").addEventListener("click", closeFilterDrawer);

init();
