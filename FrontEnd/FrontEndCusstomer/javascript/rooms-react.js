import {
    filterFromSearchParams,
    filterRooms,
    loadRoomDirectory,
    renderRoomCards,
    sortRooms
} from "./catalog.js";

const { createElement, useEffect, useMemo, useState } = React;
const root = document.querySelector("#root");
const initialParams = new URLSearchParams(window.location.search);

function syncUrl(filters, sortValue) {
    const next = new URLSearchParams();
    ["q", "minPrice", "maxPrice", "minArea", "maxArea", "roomType", "status"].forEach(name => {
        const value = filters[name];
        if (value) next.set(name, value);
    });
    (filters.serviceIds || []).forEach(serviceId => next.append("serviceId", serviceId));
    (filters.amenityIds || []).forEach(amenityId => next.append("amenityId", amenityId));
    if (sortValue && sortValue !== "recommended") next.set("sort", sortValue);

    const query = next.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
}

function RoomsPage() {
    const [directory, setDirectory] = useState(null);
    const [filters, setFilters] = useState(filterFromSearchParams(initialParams));
    const [sort, setSort] = useState(initialParams.get("sort") || "recommended");
    const [visibleLimit, setVisibleLimit] = useState(6);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        let active = true;
        async function loadData() {
            try {
                const nextDirectory = await loadRoomDirectory();
                if (!active) return;
                setDirectory(nextDirectory);
                const nextFilters = filterFromSearchParams(new URLSearchParams(window.location.search));
                setFilters(nextFilters);
                setNotice("");
                setError(false);
            } catch (loadError) {
                if (!active) return;
                setDirectory(null);
                setNotice(loadError.message || "Không thể tải dữ liệu phòng.");
                setError(true);
            }
        }
        loadData();
        return () => {
            active = false;
        };
    }, []);

    const roomTypeOptions = useMemo(() => {
        if (!directory) return [];
        return [...new Set((directory.rooms || []).map(room => room.roomType).filter(Boolean))];
    }, [directory]);

    const filteredRooms = useMemo(() => {
        if (!directory) return [];
        return filterRooms(directory.rooms || [], directory.motels || [], {
            ...filters,
            roomAmenities: directory.roomAmenities || []
        });
    }, [directory, filters]);

    const sortedRooms = useMemo(() => {
        return sortRooms(filteredRooms, sort);
    }, [filteredRooms, sort]);

    const visibleRooms = useMemo(() => {
        return sortedRooms.slice(0, visibleLimit);
    }, [sortedRooms, visibleLimit]);

    const resultHtml = useMemo(() => {
        if (!directory) {
            return '<div class="loading-card">Đang tải phòng trọ…</div>';
        }

        if (!visibleRooms.length) {
            return '<div class="empty-state"><strong>Không tìm thấy phòng trọ phù hợp.</strong><br>Hãy thử thay đổi hoặc xóa bớt bộ lọc.</div>';
        }

        return renderRoomCards(visibleRooms, directory.motels || [], directory.images || [], {
            detailHrefPrefix: "./room-detail.html",
            services: directory.services || [],
            amenities: directory.amenities || [],
            roomAmenities: directory.roomAmenities || []
        });
    }, [directory, visibleRooms]);

    function updateFilter(name, value) {
        setFilters(current => ({ ...current, [name]: value }));
    }

    function toggleCheckedList(listName, value) {
        setFilters(current => {
            const selected = new Set(current[listName] || []);
            if (selected.has(value)) {
                selected.delete(value);
            } else {
                selected.add(value);
            }
            return { ...current, [listName]: [...selected] };
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const nextFilters = {
            q: String(formData.get("q") || "").trim(),
            minPrice: String(formData.get("minPrice") || "").trim(),
            maxPrice: String(formData.get("maxPrice") || "").trim(),
            minArea: String(formData.get("minArea") || "").trim(),
            maxArea: String(formData.get("maxArea") || "").trim(),
            roomType: String(formData.get("roomType") || "").trim(),
            status: String(formData.get("status") || "").trim(),
            serviceIds: Array.from(form.querySelectorAll('input[name="serviceId"]:checked')).map(input => input.value),
            amenityIds: Array.from(form.querySelectorAll('input[name="amenityId"]:checked')).map(input => input.value),
            roomAmenities: directory ? directory.roomAmenities || [] : []
        };
        setFilters(nextFilters);
        setVisibleLimit(6);
        syncUrl(nextFilters, sort);
        setDrawerOpen(false);
    }

    function handleReset() {
        const nextFilters = {
            q: "",
            minPrice: "",
            maxPrice: "",
            minArea: "",
            maxArea: "",
            roomType: "",
            status: "",
            serviceIds: [],
            amenityIds: [],
            roomAmenities: directory ? directory.roomAmenities || [] : []
        };
        setFilters(nextFilters);
        setSort("recommended");
        setVisibleLimit(6);
        syncUrl(nextFilters, "recommended");
    }

    function handleSortChange(event) {
        const nextSort = event.target.value;
        setSort(nextSort);
        setVisibleLimit(6);
        syncUrl(filters, nextSort);
    }

    function handleLoadMore() {
        setVisibleLimit(current => current + 6);
    }

    return createElement(
        "main",
        { className: "container page-main" },
        createElement(
            "nav",
            { className: "breadcrumb", "aria-label": "Breadcrumb" },
            createElement("a", { href: "../index.html" }, "Trang chủ"),
            createElement("span", null, "›"),
            createElement("span", null, "Tìm phòng")
        ),
        createElement(
            "div",
            { className: "listing-heading" },
            createElement(
                "div",
                null,
                createElement("span", { className: "eyebrow" }, "Tìm kiếm phòng"),
                createElement("h1", null, "Phòng trọ phù hợp với bạn"),
                createElement(
                    "p",
                    { id: "listing-summary" },
                    filteredRooms.length
                        ? `Tìm thấy ${filteredRooms.length} phòng theo điều kiện hiện tại.`
                        : "Dữ liệu được lấy trực tiếp từ backend UniLifeT."
                )
            ),
            createElement(
                "button",
                { type: "button", className: "btn btn-secondary mobile-filter-toggle", id: "filter-open", onClick: () => setDrawerOpen(true) },
                "☷ Bộ lọc"
            )
        ),
        createElement(
            "div",
            { id: "listing-notice", className: `notice${error ? " error" : ""}` , role: "status", hidden: !notice },
            notice
        ),
        createElement(
            "div",
            { className: "listing-layout" },
            createElement(
                "aside",
                { className: `filter-panel${drawerOpen ? " open" : ""}`, id: "filter-panel", "aria-label": "Bộ lọc phòng" },
                createElement(
                    "div",
                    { className: "filter-panel-head" },
                    createElement("h2", null, "Bộ lọc"),
                    createElement(
                        "button",
                        { type: "button", className: "icon-btn filter-close", id: "filter-close", "aria-label": "Đóng bộ lọc", onClick: () => setDrawerOpen(false) },
                        "×"
                    )
                ),
                createElement(
                    "form",
                    { id: "room-filters", onSubmit: handleSubmit, onReset: handleReset },
                    createElement(
                        "label",
                        { className: "field" },
                        "Từ khóa / tỉnh thành / khu vực",
                        createElement("input", {
                            name: "q",
                            type: "search",
                            placeholder: "Nhập khu vực hoặc địa chỉ",
                            value: filters.q || "",
                            onChange: event => updateFilter("q", event.target.value)
                        })
                    ),
                    createElement(
                        "a",
                        { className: "text-link", href: "./university.html" },
                        "Tìm nhà trọ theo trường đại học →"
                    ),
                    createElement(
                        "div",
                        { className: "filter-pair" },
                        createElement(
                            "label",
                            { className: "field" },
                            "Giá từ",
                            createElement("input", {
                                name: "minPrice",
                                type: "number",
                                min: "0",
                                step: "100000",
                                placeholder: "0",
                                value: filters.minPrice || "",
                                onChange: event => updateFilter("minPrice", event.target.value)
                            })
                        ),
                        createElement(
                            "label",
                            { className: "field" },
                            "Đến",
                            createElement("input", {
                                name: "maxPrice",
                                type: "number",
                                min: "0",
                                step: "100000",
                                placeholder: "Không giới hạn",
                                value: filters.maxPrice || "",
                                onChange: event => updateFilter("maxPrice", event.target.value)
                            })
                        )
                    ),
                    createElement(
                        "div",
                        { className: "filter-pair" },
                        createElement(
                            "label",
                            { className: "field" },
                            "Diện tích từ (m²)",
                            createElement("input", {
                                name: "minArea",
                                type: "number",
                                min: "0",
                                step: "1",
                                placeholder: "0",
                                value: filters.minArea || "",
                                onChange: event => updateFilter("minArea", event.target.value)
                            })
                        ),
                        createElement(
                            "label",
                            { className: "field" },
                            "Đến (m²)",
                            createElement("input", {
                                name: "maxArea",
                                type: "number",
                                min: "0",
                                step: "1",
                                placeholder: "Không giới hạn",
                                value: filters.maxArea || "",
                                onChange: event => updateFilter("maxArea", event.target.value)
                            })
                        )
                    ),
                    createElement(
                        "label",
                        { className: "field" },
                        "Loại phòng",
                        createElement(
                            "select",
                            { name: "roomType", value: filters.roomType || "", onChange: event => updateFilter("roomType", event.target.value) },
                            createElement("option", { value: "" }, "Tất cả loại phòng"),
                            roomTypeOptions.map(roomType => createElement("option", { key: roomType, value: roomType }, roomType))
                        )
                    ),
                    createElement(
                        "label",
                        { className: "field" },
                        "Tình trạng",
                        createElement(
                            "select",
                            { name: "status", value: filters.status || "", onChange: event => updateFilter("status", event.target.value) },
                            createElement("option", { value: "" }, "Tất cả tình trạng"),
                            createElement("option", { value: "available" }, "Còn phòng"),
                            createElement("option", { value: "unavailable" }, "Không còn trống")
                        )
                    ),
                    createElement(
                        "fieldset",
                        { className: "check-group" },
                        createElement("legend", null, "Dịch vụ"),
                        createElement(
                            "div",
                            { className: "check-list" },
                            (directory && directory.services && directory.services.length)
                                ? directory.services.map(service =>
                                    createElement(
                                        "label",
                                        { key: service.serviceId, className: "check-option" },
                                        createElement("input", {
                                            type: "checkbox",
                                            name: "serviceId",
                                            value: String(service.serviceId),
                                            checked: (filters.serviceIds || []).includes(String(service.serviceId)),
                                            onChange: () => toggleCheckedList("serviceIds", String(service.serviceId))
                                        }),
                                        createElement("span", null, service.serviceName)
                                    )
                                )
                                : createElement("span", { className: "muted" }, "Đang tải…")
                        )
                    ),
                    createElement(
                        "fieldset",
                        { className: "check-group" },
                        createElement("legend", null, "Tiện nghi"),
                        createElement(
                            "div",
                            { className: "check-list" },
                            (directory && directory.amenities && directory.amenities.length)
                                ? directory.amenities.map(amenity =>
                                    createElement(
                                        "label",
                                        { key: amenity.amenityId, className: "check-option" },
                                        createElement("input", {
                                            type: "checkbox",
                                            name: "amenityId",
                                            value: String(amenity.amenityId),
                                            checked: (filters.amenityIds || []).includes(String(amenity.amenityId)),
                                            onChange: () => toggleCheckedList("amenityIds", String(amenity.amenityId))
                                        }),
                                        createElement("span", null, amenity.amenityName)
                                    )
                                )
                                : createElement("span", { className: "muted" }, "Đang tải…")
                        )
                    ),
                    createElement(
                        "div",
                        { className: "filter-actions" },
                        createElement("button", { className: "btn", type: "submit" }, "Áp dụng bộ lọc"),
                        createElement(
                            "button",
                            { className: "btn btn-secondary", type: "reset", id: "filter-reset" },
                            "Xóa bộ lọc"
                        )
                    )
                )
            ),
            createElement("div", { className: `filter-shade${drawerOpen ? " open" : ""}`, id: "filter-shade", onClick: () => setDrawerOpen(false) }),
            createElement(
                "section",
                { className: "listing-results", "aria-label": "Kết quả phòng trọ" },
                createElement(
                    "div",
                    { className: "results-toolbar" },
                    createElement("span", { id: "result-count", className: "result-count" }, `${filteredRooms.length} phòng phù hợp`),
                    createElement(
                        "label",
                        { className: "sort-control" },
                        "Sắp xếp",
                        createElement(
                            "select",
                            { id: "room-sort", value: sort, onChange: handleSortChange },
                            createElement("option", { value: "recommended" }, "Theo thứ tự dữ liệu"),
                            createElement("option", { value: "price-asc" }, "Giá thấp đến cao"),
                            createElement("option", { value: "price-desc" }, "Giá cao đến thấp"),
                            createElement("option", { value: "area-desc" }, "Diện tích lớn đến nhỏ"),
                            createElement("option", { value: "newest", disabled: true }, "Mới đăng (API chưa có ngày đăng)")
                        )
                    )
                ),
                createElement("div", {
                    className: "room-grid",
                    id: "room-grid",
                    "aria-live": "polite",
                    dangerouslySetInnerHTML: { __html: resultHtml }
                }),
                createElement(
                    "button",
                    { type: "button", className: "btn btn-secondary load-more", id: "load-more", hidden: visibleLimit >= sortedRooms.length || !sortedRooms.length, onClick: handleLoadMore },
                    "Xem thêm phòng"
                )
            )
        )
    );
}

if (root) {
    ReactDOM.createRoot(root).render(createElement(RoomsPage));
}
