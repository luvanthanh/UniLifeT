import { loadRoomDirectory, renderRoomCards } from "./catalog.js";

const { createElement, useEffect, useMemo, useState } = React;
const root = document.querySelector("#root");

function HomePage() {
    const [rooms, setRooms] = useState([]);
    const [motels, setMotels] = useState([]);
    const [images, setImages] = useState([]);
    const [services, setServices] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [roomAmenities, setRoomAmenities] = useState([]);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        async function loadFeaturedRooms() {
            try {
                const directory = await loadRoomDirectory();
                if (!active) return;
                setRooms(directory.rooms || []);
                setMotels(directory.motels || []);
                setImages(directory.images || []);
                setServices(directory.services || []);
                setAmenities(directory.amenities || []);
                setRoomAmenities(directory.roomAmenities || []);
                setNotice("");
                setError("");
            } catch (loadError) {
                if (!active) return;
                setRooms([]);
                setNotice(loadError.message || "Không thể tải dữ liệu phòng.");
                setError("error");
            }
        }
        loadFeaturedRooms();
        return () => {
            active = false;
        };
    }, []);

    const featuredHtml = useMemo(() => {
        if (!rooms.length) {
            return '<div class="loading-card">Đang tải danh sách phòng…</div>';
        }
        return renderRoomCards(rooms.slice(0, 6), motels, images, {
            services,
            amenities,
            roomAmenities,
            detailHrefPrefix: "./pages/room-detail.html"
        });
    }, [rooms, motels, images, services, amenities, roomAmenities]);

    function handleSearch(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        const q = String(form.get("q") || "").trim();
        const maxPrice = String(form.get("maxPrice") || "").trim();
        if (q) params.set("q", q);
        if (maxPrice) params.set("maxPrice", maxPrice);
        const query = params.toString();
        window.location.href = `./pages/rooms.html${query ? `?${query}` : ""}`;
    }

    return createElement(
        "main",
        null,
        createElement(
            "section",
            { className: "hero" },
            createElement(
                "div",
                { className: "container hero-grid" },
                createElement(
                    "div",
                    { className: "hero-copy" },
                    createElement("span", { className: "eyebrow" }, "Tìm chỗ ở dễ dàng hơn"),
                    createElement(
                        "h1",
                        null,
                        "Tìm phòng trọ",
                        createElement("br", null),
                        "phù hợp với ",
                        createElement("em", null, "bạn.")
                    ),
                    createElement("p", null, "Gần trường – Đúng ngân sách – Đủ tiện nghi"),
                    createElement(
                        "form",
                        { className: "search-panel", id: "home-search", onSubmit: handleSearch },
                        createElement(
                            "label",
                            { className: "search-field" },
                            createElement("span", { "aria-hidden": "true" }, "⌕"),
                            createElement(
                                "span",
                                null,
                                createElement("small", null, "Tên phòng, khu vực"),
                                createElement("input", {
                                    name: "q",
                                    type: "search",
                                    placeholder: "Nhập tên trường, quận hoặc địa chỉ"
                                })
                            )
                        ),
                        createElement(
                            "a",
                            { className: "search-field", href: "./pages/university.html" },
                            createElement("span", { "aria-hidden": "true" }, "⌂"),
                            createElement(
                                "span",
                                null,
                                createElement("small", null, "Trường đại học"),
                                createElement("strong", null, "Xem danh sách trường")
                            )
                        ),
                        createElement(
                            "label",
                            { className: "search-field" },
                            createElement("span", { "aria-hidden": "true" }, "₫"),
                            createElement(
                                "span",
                                null,
                                createElement("small", null, "Giá tối đa / tháng"),
                                createElement("input", {
                                    name: "maxPrice",
                                    type: "number",
                                    min: "0",
                                    step: "100000",
                                    placeholder: "Không giới hạn"
                                })
                            )
                        ),
                        createElement(
                            "button",
                            { className: "btn search-submit", type: "submit" },
                            "Tìm phòng"
                        )
                    ),
                    createElement(
                        "p",
                        { className: "source-note" },
                        "Thông tin phòng được tải từ UniLifeT. Mở danh sách trường để khám phá nhà trọ liên kết."
                    )
                )
            )
        ),
        createElement(
            "section",
            { className: "container section-pad", id: "featured-rooms" },
            createElement(
                "div",
                { className: "section-heading" },
                createElement(
                    "div",
                    null,
                    createElement("span", { className: "eyebrow" }, "Khám phá lựa chọn"),
                    createElement("h2", null, "Phòng trọ dành cho bạn"),
                    createElement("p", null, "Danh sách lấy từ dữ liệu hiện có của hệ thống.")
                ),
                createElement(
                    "a",
                    { className: "text-link", href: "./pages/rooms.html" },
                    "Xem tất cả phòng ",
                    createElement("span", { "aria-hidden": "true" }, "→")
                )
            ),
            createElement(
                "div",
                { id: "home-notice", className: `notice${error ? " error" : ""}` , role: "status", hidden: !notice },
                notice
            ),
            createElement("div", {
                className: "room-grid",
                id: "home-room-grid",
                "aria-live": "polite",
                dangerouslySetInnerHTML: { __html: featuredHtml }
            })
        ),
        createElement(
            "section",
            { className: "container help-band" },
            createElement(
                "div",
                { className: "help-copy" },
                createElement("span", { className: "eyebrow" }, "Tìm chỗ ở gần trường"),
                createElement("h2", null, "Khám phá nhà trọ quanh trường đại học"),
                createElement("p", null, "Chọn trường để xem các nhà trọ và phòng liên kết trong hệ thống.")
            ),
            createElement(
                "a",
                { className: "btn", href: "./pages/university.html" },
                "Xem các trường ",
                createElement("span", { "aria-hidden": "true" }, "→")
            )
        ),
        createElement(
            "section",
            { className: "container help-band" },
            createElement(
                "div",
                null,
                createElement("span", { className: "eyebrow" }, "Bắt đầu tìm kiếm"),
                createElement("h2", null, "Thu hẹp lựa chọn theo nhu cầu của bạn."),
                createElement("p", null, "Lọc theo mức giá, diện tích và khu vực trên trang danh sách.")
            ),
            createElement(
                "a",
                { className: "btn", href: "./pages/rooms.html" },
                "Mở bộ lọc phòng ",
                createElement("span", { "aria-hidden": "true" }, "→")
            )
        )
    );
}

if (root) {
    ReactDOM.createRoot(root).render(createElement(HomePage));
}
