import { apiRequest, escapeHtml, formatVnd, getSession } from "./api.js";
import { API_ENDPOINTS } from "./config.js";
import { requireSignIn } from "./common.js";
import { roomTitle } from "./catalog.js";

const list = document.querySelector("#rentals-list");
const notice = document.querySelector("#rentals-notice");
const session = getSession();

async function loadRentals() {
    if (!requireSignIn()) return;
    if (!session.userId) {
        list.innerHTML = '<div class="empty-state">Phiên đăng nhập thiếu mã người dùng.</div>';
        return;
    }
    try {
        const [records, rooms] = await Promise.all([
            apiRequest(API_ENDPOINTS.userRooms(session.userId)),
            apiRequest(API_ENDPOINTS.rooms)
        ]);
        const roomList = Array.isArray(rooms) ? rooms : [];
        const rentals = Array.isArray(records)
            ? records.filter(record => String(record.userId) === String(session.userId))
            : [];
        if (!rentals.length) {
            list.innerHTML = '<div class="empty-state">API chưa có bản ghi thuê phòng cho tài khoản này.</div>';
            return;
        }
        list.innerHTML = rentals.map(record => {
            const room = roomList.find(item => String(item.roomId) === String(record.roomId));
            return `<article class="rental-card">
              <div><h2>${room ? escapeHtml(roomTitle(room)) : `Phòng #${escapeHtml(record.roomId)}`}</h2>
                <p>Mã bản ghi: ${escapeHtml(record.userRoomId)}</p>
                <p>Thời gian: ${escapeHtml(record.startDate || "Chưa cập nhật")} – ${escapeHtml(record.endDate || "Chưa cập nhật")}</p>
                <p>Tiền thuê theo bản ghi: ${formatVnd(record.monthlyRent)}</p>
                <a class="text-link" href="./room-detail.html?id=${encodeURIComponent(record.roomId)}">Xem thông tin phòng →</a>
              </div>
              <span class="rental-status">${escapeHtml(record.contractStatus || "Chưa có trạng thái")}</span>
            </article>`;
        }).join("");
    } catch (error) {
        list.innerHTML = '<div class="empty-state">Không tải được lịch sử thuê.</div>';
        notice.textContent = error.status === 403
            ? "Backend từ chối quyền xem dữ liệu này."
            : error.message;
        notice.classList.add("error");
        notice.hidden = false;
    }
}

loadRentals();
