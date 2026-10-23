import { escapeHtml, parseApiResponse, safeHttpUrl } from "./common.js";

const list = document.querySelector("#university-list");
const notice = document.querySelector("#university-notice");

function renderUniversities(universities) {
    if (!universities.length) {
        list.innerHTML = '<p class="empty-state">API hiện chưa có trường đại học.</p>';
        return;
    }

    list.innerHTML = universities.map(university => {
        const logoUrl = safeHttpUrl(university.universityLogo);
        const location = [university.universityDistrict, university.universityCity]
            .filter(Boolean)
            .join(", ") || university.universityAddress;
        const logo = logoUrl
            ? `<img class="university-logo" src="${escapeHtml(logoUrl)}" alt="" loading="lazy">`
            : "";
        const universityId = university.universityId;
        const content = `<div>${logo}<h2>${escapeHtml(university.universityName || "API không cung cấp tên trường")}</h2>
          ${location ? `<p>${escapeHtml(location)}</p>` : ""}</div>
          <span class="university-link">Xem nhà trọ liên kết →</span>`;
        return universityId === null || universityId === undefined
            ? `<article class="university-card">${content}</article>`
            : `<a class="university-card" href="./motel.html?universityId=${encodeURIComponent(universityId)}">${content}</a>`;
    }).join("");

    if (universities.some(university => university.universityId === null || university.universityId === undefined)) {
        notice.textContent = "Một số trường chưa có mã trường từ API nên chưa thể mở danh sách nhà trọ liên kết.";
        notice.hidden = false;
    }
}

async function loadUniversities() {
    try {
        const response = await fetch("http://localhost:8080/universities");
        const universities = await parseApiResponse(response);
        if (!Array.isArray(universities)) {
            throw new Error("API trường đại học trả về dữ liệu không đúng định dạng.");
        }
        renderUniversities(universities);
    } catch (error) {
        list.innerHTML = '<p class="empty-state">Không tải được danh sách trường đại học.</p>';
        notice.textContent = error.message;
        notice.classList.add("error");
        notice.hidden = false;
    }
}

loadUniversities();
