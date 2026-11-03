const navItems = [
  { id: "dashboard", label: "Tổng quan", icon: "⌂", href: "dashboard.html" },
  { id: "users", label: "Quản lý người dùng", icon: "👥", href: "users.html" },
  { id: "owners", label: "Quản lý chủ trọ", icon: "🏠", href: "owners.html" },
  { id: "motels", label: "Quản lý nhà trọ", icon: "📍", href: "motels.html" },
  { id: "rooms", label: "Quản lý phòng trọ", icon: "🛏️", href: "rooms.html" },
  { id: "posts", label: "Quản lý tin đăng", icon: "📰", href: "posts.html" },
  { id: "universities", label: "Quản lý trường đại học", icon: "🎓", href: "universities.html" },
  { id: "services", label: "Quản lý dịch vụ", icon: "⚙️", href: "services.html" },
  { id: "amenities", label: "Quản lý tiện nghi", icon: "✨", href: "amenities.html" },
  { id: "rental-requests", label: "Quản lý yêu cầu thuê", icon: "📝", href: "rental-requests.html" },
  { id: "reports", label: "Thống kê & báo cáo", icon: "📊", href: "reports.html" },
  { id: "profile", label: "Hồ sơ quản trị", icon: "👤", href: "profile.html" },
];

const pageConfig = {
  dashboard: { title: "Tổng quan", subtitle: "Theo dõi hệ thống phòng trọ và hoạt động quản trị." },
  users: { title: "Người dùng", subtitle: "Danh sách tài khoản và quyền truy cập trong hệ thống." },
  owners: { title: "Chủ trọ", subtitle: "Theo dõi chủ nhà, nhà trọ và hoạt động đối tác." },
  motels: { title: "Nhà trọ", subtitle: "Quản lý danh sách nhà trọ theo khu vực và trường đại học." },
  rooms: { title: "Phòng trọ", subtitle: "Theo dõi trạng thái thuê, giá, diện tích và tiện nghi." },
  posts: { title: "Tin đăng", subtitle: "Kiểm duyệt, duyệt và từ chối tin đăng mới." },
  universities: { title: "Trường đại học", subtitle: "Quản lý thông tin trường và mối liên kết với nhà trọ." },
  services: { title: "Dịch vụ", subtitle: "Cập nhật gói dịch vụ và phụ phí đi kèm." },
  amenities: { title: "Tiện nghi", subtitle: "Quản lý tiện ích trong từng phòng tại các nhà trọ." },
  "rental-requests": { title: "Yêu cầu thuê", subtitle: "Theo dõi tiến độ xử lý yêu cầu từ sinh viên." },
  reports: { title: "Thống kê & báo cáo", subtitle: "Macro report tổng hợp theo thời gian và khu vực." },
  profile: { title: "Hồ sơ quản trị", subtitle: "Thông tin cá nhân, cập nhật và bảo mật tài khoản." },
};

const statusMap = {
  active: "success",
  approved: "success",
  pending: "warning",
  rejected: "danger",
  inactive: "neutral",
  available: "success",
  rented: "info",
  maintenance: "warning",
  draft: "neutral"
};

function makeInitials(name) {
  return (name || "Admin").trim().split(/\s+/).slice(0, 2).map(part => part[0].toUpperCase()).join("") || "A";
}

function showToast(message, type = "success") {
  const region = document.getElementById("toast-region");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  region.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 200);
  }, 2600);
}

function filterRows(rows, search, typeFilter, statusFilter) {
  const query = (search || "").toLowerCase();
  return rows.filter(row => {
    const matchesSearch = !query || JSON.stringify(Object.values(row)).join(" ").toLowerCase().includes(query);
    const matchesType = !typeFilter || String(row.role || row.type || row.category || row.status || "").toLowerCase() === String(typeFilter).toLowerCase();
    const matchesStatus = !statusFilter || String(row.status || row.state || row.approvalStatus || "").toLowerCase() === String(statusFilter).toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });
}

function renderDashboardPage() {
  const stats = [
    { label: "Tổng số người dùng", value: "18.420", trend: "+12.5%", dir: "up", icon: "👥", color: "#176B52", bg: "#eaf6f3" },
    { label: "Sinh viên", value: "14.860", trend: "+8.1%", dir: "up", icon: "🎓", color: "#2563eb", bg: "#edf4ff" },
    { label: "Chủ trọ", value: "3.560", trend: "+6.3%", dir: "up", icon: "🏠", color: "#f59e0b", bg: "#fff7e8" },
    { label: "Nhà trọ", value: "1.240", trend: "+3.9%", dir: "up", icon: "📍", color: "#8b5cf6", bg: "#f3ebff" },
    { label: "Phòng trọ", value: "9.680", trend: "+11.2%", dir: "up", icon: "🛏️", color: "#0ea5e9", bg: "#ecfeff" },
    { label: "Tin đăng", value: "5.430", trend: "+15.4%", dir: "up", icon: "📰", color: "#ef4444", bg: "#fff1f2" },
    { label: "Chờ duyệt", value: "364", trend: "-2.1%", dir: "down", icon: "⏳", color: "#f59e0b", bg: "#fff7e8" },
    { label: "Phòng còn trống", value: "2.940", trend: "+5.7%", dir: "up", icon: "✅", color: "#16a34a", bg: "#ecfdf5" },
    { label: "Phòng đã thuê", value: "6.740", trend: "+9.8%", dir: "up", icon: "🔒", color: "#1d4ed8", bg: "#eff6ff" },
  ];

  const usersChart = {
    labels: ["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"],
    datasets: [
      { label: "Sinh viên", data: [820, 910, 980, 1020, 1160, 1225, 1340, 1480, 1560, 1670, 1820, 1945], borderColor: "#176B52", backgroundColor: "rgba(23,107,82,0.14)", fill: true, tension: 0.35 },
      { label: "Chủ trọ", data: [180, 195, 220, 240, 290, 310, 350, 365, 390, 420, 465, 500], borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.12)", fill: true, tension: 0.35 },
    ]
  };

  const roomChart = {
    labels: ["Còn trống","Đã thuê","Bảo trì"],
    datasets: [{ data: [42, 54, 4], backgroundColor: ["#176B52", "#1d4ed8", "#f59e0b"] }],
  };

  const postsChart = {
    labels: ["Chờ duyệt","Đã duyệt","Bị từ chối"],
    datasets: [{ data: [18, 72, 10], backgroundColor: ["#f59e0b", "#16a34a", "#dc2626"] }],
  };

  const activities = [
    { icon: "✨", title: "Sinh viên Nguyễn Hoàng Long đăng ký mới", time: "2 phút trước", badge: "Mới" },
    { icon: "🏠", title: "Chủ trọ Minh Anh thêm nhà trọ mới tại Q.7", time: "15 phút trước", badge: "Phê duyệt" },
    { icon: "🛏️", title: "Phòng 401A vừa có lượt thuê mới", time: "1 giờ trước", badge: "Phòng" },
    { icon: "📝", title: "Tin đăng tại KTX Nam Sài Gòn đang chờ duyệt", time: "3 giờ trước", badge: "Kiểm duyệt" },
  ];

  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Dashboard</p>
        <p>Hệ thống quản trị UniLifeT</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" type="button">Xuất báo cáo</button>
        <button class="btn" type="button" data-action="refresh-dashboard">Làm mới</button>
      </div>
    </div>

    <div class="stats-grid">
      ${stats.map(stat => `
        <article class="stat-card" style="--stat-color:${stat.color}; --stat-bg:${stat.bg};">
          <div class="stat-content">
            <span class="stat-label">${stat.label}</span>
            <div class="stat-value">${stat.value}</div>
            <span class="stat-trend ${stat.dir}">${stat.dir === "up" ? "↗" : "↘"} ${stat.trend}</span>
          </div>
          <span class="stat-icon" aria-hidden="true">${stat.icon}</span>
        </article>
      `).join("")}
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <header class="panel-header">
          <div>
            <h2>Người dùng đăng ký theo tháng</h2>
            <p>Số lượng sinh viên và chủ trọ gia tăng liên tục.</p>
          </div>
        </header>
        <div class="chart-wrap">
          <div class="chart-box"><canvas id="userChart"></canvas></div>
          <div class="legend">
            <span class="legend-item"><span class="legend-swatch" style="background:#176B52"></span> Sinh viên</span>
            <span class="legend-item"><span class="legend-swatch" style="background:#f59e0b"></span> Chủ trọ</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <header class="panel-header">
          <div>
            <h2>Phòng trọ</h2>
            <p>Tỷ lệ thuê phòng hiện tại</p>
          </div>
        </header>
        <div class="chart-wrap">
          <div class="chart-box" style="height: 220px;"><canvas id="roomChart"></canvas></div>
        </div>
      </section>
    </div>

    <div class="dashboard-grid" style="margin-top:18px;">
      <section class="panel">
        <header class="panel-header">
          <div>
            <h2>Tin đăng</h2>
            <p>Phân loại theo trạng thái kiểm duyệt</p>
          </div>
        </header>
        <div class="chart-wrap">
          <div class="chart-box" style="height:220px;"><canvas id="postsChart"></canvas></div>
        </div>
      </section>

      <section class="panel">
        <header class="panel-header">
          <div>
            <h2>Hoạt động gần đây</h2>
            <p>Các sự kiện mới nhất trên hệ thống</p>
          </div>
        </header>
        <div class="activity-list">
          ${activities.map(item => `
            <article class="activity-item">
              <span class="activity-icon">${item.icon}</span>
              <div class="activity-copy">
                <strong>${item.title}</strong>
                <small>${item.time}</small>
              </div>
              <span class="status-badge ${statusMap.pending}">${item.badge}</span>
            </article>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderTablePage(pageId, rows, columns, filters = []) {
  const filterMarkup = filters.length ? `
    <div class="page-controls">
      <div class="filter-row">
        ${filters.map(filter => `
          <div class="field">
            <label>${filter.label}</label>
            <select data-filter-field="${filter.key}">
              <option value="">Tất cả</option>
              ${filter.options.map(option => `<option value="${option.value}">${option.label}</option>`).join("")}
            </select>
          </div>
        `).join("")}
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" type="button" data-action="export-${pageId}">Xuất Excel</button>
        <button class="btn" type="button" data-action="add-${pageId}">+ Thêm mới</button>
      </div>
    </div>
  ` : "";

  const tableMarkup = `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.label}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              ${columns.map(col => {
                if (col.key === "actions") {
                  return `<td>${renderActions(row)}</td>`;
                }
                if (col.key === "status") {
                  return `<td><span class="status-badge ${statusMap[row.status] || "neutral"}">${row.statusLabel || row.status}</span></td>`;
                }
                if (col.key === "role") {
                  return `<td><span class="status-badge ${statusMap[row.role] || "neutral"}">${row.roleLabel || row.role}</span></td>`;
                }
                if (col.key === "user") {
                  return `<td><div class="table-user"><span class="avatar">${makeInitials(row.name)}</span><div><strong>${row.name}</strong><div class="muted">${row.email || row.phone || ""}</div></div></div></td>`;
                }
                if (col.key === "detail") {
                  return `<td>${row.detail || "—"}</td>`;
                }
                if (col.key === "name") {
                  return `<td><strong>${row.name}</strong></td>`;
                }
                return `<td>${row[col.key] ?? "—"}</td>`;
              }).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  return `${filterMarkup}${tableMarkup}`;
}

function renderActions(row) {
  const actions = ['<button class="action-button primary" type="button">Xem</button>', '<button class="action-button" type="button">Sửa</button>'];
  if (row.status === 'rejected' || row.status === 'pending') actions.push('<button class="action-button danger" type="button">Khóa</button>');
  return `<div class="table-actions">${actions.join("")}</div>`;
}

function renderUsersPage() {
  const rows = [
    { id: 1, name: "Nguyễn Thảo My", email: "thao.my@gmail.com", phone: "0912 456 789", role: "student", roleLabel: "Sinh viên", status: "active", statusLabel: "Hoạt động", createdAt: "15/08/2024" },
    { id: 2, name: "Lê Minh Anh", email: "minhanh@gmail.com", phone: "0905 220 112", role: "owner", roleLabel: "Chủ trọ", status: "active", statusLabel: "Hoạt động", createdAt: "09/06/2024" },
    { id: 3, name: "Phạm Quốc Huy", email: "huy.pham@gmail.com", phone: "0987 331 224", role: "student", roleLabel: "Sinh viên", status: "inactive", statusLabel: "Khóa", createdAt: "02/02/2024" },
    { id: 4, name: "Trần Hải Đăng", email: "hai.dang@gmail.com", phone: "0938 991 887", role: "owner", roleLabel: "Chủ trọ", status: "pending", statusLabel: "Chờ xác thực", createdAt: "12/09/2024" },
  ];

  return renderTablePage("users", rows, [
    { key: "id", label: "ID" },
    { key: "user", label: "Họ tên" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Số điện thoại" },
    { key: "role", label: "Vai trò" },
    { key: "status", label: "Trạng thái" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "actions", label: "Thao tác" },
  ], [{ label: "Vai trò", key: "role", options: [{ value: "student", label: "Sinh viên" }, { value: "owner", label: "Chủ trọ" }] }, { label: "Trạng thái", key: "status", options: [{ value: "active", label: "Hoạt động" }, { value: "inactive", label: "Khóa" }, { value: "pending", label: "Chờ xác thực" }] }]);
}

function renderOwnersPage() {
  const rows = [
    { id: 101, name: "Lê Minh Anh", email: "minhanh@gmail.com", phone: "0905 220 112", motels: 3, status: "active", statusLabel: "Hoạt động" },
    { id: 102, name: "Nguyễn Văn Cường", email: "cuong.nguyen@gmail.com", phone: "028 3820 9921", motels: 2, status: "pending", statusLabel: "Chờ xác thực" },
    { id: 103, name: "Đỗ Hồng Vân", email: "hongvan@gmail.com", phone: "0389 212 771", motels: 4, status: "active", statusLabel: "Hoạt động" },
  ];
  return renderTablePage("owners", rows, [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên chủ trọ" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Số điện thoại" },
    { key: "motels", label: "Nhà trọ" },
    { key: "status", label: "Trạng thái" },
    { key: "actions", label: "Thao tác" },
  ], [{ label: "Trạng thái", key: "status", options: [{ value: "active", label: "Hoạt động" }, { value: "pending", label: "Chờ xác thực" }] }]);
}

function renderMotelsPage() {
  const rows = [
    { id: 321, name: "Nha Trang Residency", address: "Q.7, TP.HCM", owner: "Lê Minh Anh", rooms: 24, status: "active", statusLabel: "Hoạt động" },
    { id: 447, name: "Dream Dorm", address: "Q.3, TP.HCM", owner: "Nguyễn Văn Cường", rooms: 18, status: "pending", statusLabel: "Chờ duyệt" },
    { id: 512, name: "Green Hostel", address: "Q.10, TP.HCM", owner: "Đỗ Hồng Vân", rooms: 31, status: "maintenance", statusLabel: "Bảo trì" },
  ];
  return renderTablePage("motels", rows, [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên nhà trọ" },
    { key: "address", label: "Địa chỉ" },
    { key: "owner", label: "Chủ trọ" },
    { key: "rooms", label: "Phòng" },
    { key: "status", label: "Trạng thái" },
    { key: "actions", label: "Thao tác" },
  ], [{ label: "Khu vực", key: "address", options: [{ value: "Q.7", label: "Q.7" }, { value: "Q.3", label: "Q.3" }, { value: "Q.10", label: "Q.10" }] }]);
}

function renderRoomsPage() {
  const rows = [
    { id: "R101", name: "Phòng 201A", motel: "Nha Trang Residency", rent: "4.8 triệu", area: "22m²", type: "Phòng đơn", status: "available", statusLabel: "Còn trống", views: 412 },
    { id: "R204", name: "Phòng 204B", motel: "Green Hostel", rent: "5.6 triệu", area: "26m²", type: "Phòng đôi", status: "rented", statusLabel: "Đã thuê", views: 824 },
    { id: "R405", name: "Phòng 405C", motel: "Dream Dorm", rent: "3.9 triệu", area: "18m²", type: "Phòng nữ", status: "maintenance", statusLabel: "Bảo trì", views: 187 },
  ];
  return renderTablePage("rooms", rows, [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên phòng" },
    { key: "motel", label: "Nhà trọ" },
    { key: "rent", label: "Giá thuê" },
    { key: "area", label: "Diện tích" },
    { key: "status", label: "Trạng thái" },
    { key: "views", label: "Lượt xem" },
    { key: "actions", label: "Thao tác" },
  ], [{ label: "Trạng thái", key: "status", options: [{ value: "available", label: "Còn trống" }, { value: "rented", label: "Đã thuê" }, { value: "maintenance", label: "Bảo trì" }] }]);
}

function renderPostsPage() {
  const rows = [
    { id: 901, title: "Phòng trọ gần Đại học Kinh tế TP.HCM", owner: "Lê Minh Anh", motel: "Nha Trang Residency", createdAt: "12/11/2024", status: "pending", statusLabel: "Chờ duyệt" },
    { id: 902, title: "Phòng cho sinh viên nữ Q.7", owner: "Đỗ Hồng Vân", motel: "Green Hostel", createdAt: "11/11/2024", status: "approved", statusLabel: "Đã duyệt" },
    { id: 903, title: "Phòng tiện nghi đầy đủ gần trường", owner: "Nguyễn Văn Cường", motel: "Dream Dorm", createdAt: "10/11/2024", status: "rejected", statusLabel: "Từ chối" },
  ];
  return renderTablePage("posts", rows, [
    { key: "id", label: "ID" },
    { key: "title", label: "Tiêu đề" },
    { key: "owner", label: "Chủ trọ" },
    { key: "motel", label: "Nhà trọ" },
    { key: "createdAt", label: "Ngày đăng" },
    { key: "status", label: "Trạng thái" },
    { key: "actions", label: "Thao tác" },
  ], [{ label: "Trạng thái", key: "status", options: [{ value: "pending", label: "Chờ duyệt" }, { value: "approved", label: "Đã duyệt" }, { value: "rejected", label: "Từ chối" }] }]);
}

function renderUniversitiesPage() {
  const rows = [
    { id: 1, code: "UIT", name: "ĐH Công nghệ Thông tin", region: "Q.7", totalMotels: 24 },
    { id: 2, code: "UEH", name: "ĐH Kinh tế TP.HCM", region: "Q.1", totalMotels: 31 },
    { id: 3, code: "FTU", name: "ĐH Ngoại thương", region: "Q.1", totalMotels: 19 },
  ];
  return renderTablePage("universities", rows, [
    { key: "id", label: "ID" },
    { key: "code", label: "Mã trường" },
    { key: "name", label: "Tên trường" },
    { key: "region", label: "Khu vực" },
    { key: "totalMotels", label: "Nhà trọ" },
    { key: "actions", label: "Thao tác" },
  ], [{ label: "Khu vực", key: "region", options: [{ value: "Q.7", label: "Q.7" }, { value: "Q.1", label: "Q.1" }] }]);
}

function renderServicesPage() {
  const rows = [
    { id: 1, name: "Điện", description: "Phí theo công suất tiêu thụ" },
    { id: 2, name: "Nước", description: "Theo số người / hộ" },
    { id: 3, name: "Internet", description: "Wifi tốc độ cao" },
    { id: 4, name: "Gửi xe", description: "Xe máy hoặc xe đạp" },
  ];
  return renderTablePage("services", rows, [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên dịch vụ" },
    { key: "description", label: "Mô tả" },
    { key: "actions", label: "Thao tác" },
  ]);
}

function renderAmenitiesPage() {
  const rows = [
    { id: 1, name: "Máy lạnh", description: "Điều hòa 1 chiều" },
    { id: 2, name: "Tủ lạnh", description: "Tủ lạnh 2 cánh" },
    { id: 3, name: "Máy giặt", description: "Máy giặt chung" },
    { id: 4, name: "Ban công", description: "Ban công view rộng" },
  ];
  return renderTablePage("amenities", rows, [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên tiện nghi" },
    { key: "description", label: "Mô tả" },
    { key: "actions", label: "Thao tác" },
  ]);
}

function renderRentalRequestsPage() {
  const rows = [
    { id: 5001, tenant: "Nguyễn Hoàng Long", room: "Phòng 201A", owner: "Lê Minh Anh", date: "12/11/2024", status: "pending", statusLabel: "Chờ xử lý" },
    { id: 5002, tenant: "Trần Gia Hân", room: "Phòng 204B", owner: "Đỗ Hồng Vân", date: "11/11/2024", status: "approved", statusLabel: "Đồng ý" },
    { id: 5003, tenant: "Phan Anh Tú", room: "Phòng 405C", owner: "Nguyễn Văn Cường", date: "10/11/2024", status: "rejected", statusLabel: "Từ chối" },
  ];
  return renderTablePage("rental-requests", rows, [
    { key: "id", label: "ID" },
    { key: "tenant", label: "Người thuê" },
    { key: "room", label: "Phòng" },
    { key: "owner", label: "Chủ trọ" },
    { key: "date", label: "Ngày yêu cầu" },
    { key: "status", label: "Trạng thái" },
    { key: "actions", label: "Thao tác" },
  ], [{ label: "Trạng thái", key: "status", options: [{ value: "pending", label: "Chờ xử lý" }, { value: "approved", label: "Đồng ý" }, { value: "rejected", label: "Từ chối" }] }]);
}

function renderReportsPage() {
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Báo cáo</p>
        <p>Thống kê hệ thống theo tháng, trường đại học và tình trạng phòng trọ.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" type="button">Theo tháng</button>
        <button class="btn" type="button">Xuất PDF</button>
      </div>
    </div>

    <div class="kpi-row">
      <article class="kpi-card"><h3>Người dùng</h3><strong>18.420</strong><small>+12.5% so với tháng trước</small></article>
      <article class="kpi-card"><h3>Chủ trọ</h3><strong>3.560</strong><small>+6.3% so với tháng trước</small></article>
      <article class="kpi-card"><h3>Nhà trọ</h3><strong>1.240</strong><small>+3.9% so với tháng trước</small></article>
    </div>

    <div class="dashboard-grid" style="margin-top:20px;">
      <section class="panel">
        <header class="panel-header"><div><h2>Xu hướng đăng ký</h2><p>Biến động số lượng người dùng theo tháng</p></div></header>
        <div class="chart-wrap"><div class="chart-box"><canvas id="reportsLineChart"></canvas></div></div>
      </section>
      <section class="panel">
        <header class="panel-header"><div><h2>Phân bố phòng</h2><p>Khoảng cách theo trạng thái cho thuê</p></div></header>
        <div class="chart-wrap"><div class="chart-box" style="height:220px;"><canvas id="reportsDoughnut"></canvas></div></div>
      </section>
    </div>
  `;
}

function renderProfilePage() {
  const profile = {
    name: "Nguyễn Minh Khang",
    email: "admin@unilife.com",
    phone: "0909 123 456",
    role: "Admin",
    branch: "Hệ thống UniLifeT",
    lastLogin: "09:42, 03/11/2026"
  };

  return `
    <div class="profile-layout">
      <aside class="profile-card">
        <div class="profile-head">
          <span class="avatar" style="width:82px;height:82px;font-size:30px;">NM</span>
          <h2>${profile.name}</h2>
          <p>${profile.role}</p>
        </div>
        <div class="profile-meta">
          <div class="meta-row"><span>Email</span><strong>${profile.email}</strong></div>
          <div class="meta-row"><span>Điện thoại</span><strong>${profile.phone}</strong></div>
          <div class="meta-row"><span>Chi nhánh</span><strong>${profile.branch}</strong></div>
          <div class="meta-row"><span>Đăng nhập gần nhất</span><strong>${profile.lastLogin}</strong></div>
        </div>
      </aside>

      <section class="form-card">
        <header class="panel-header">
          <div><h2>Chỉnh sửa hồ sơ</h2><p>Cập nhật thông tin cá nhân và đổi mật khẩu.</p></div>
        </header>
        <form class="form-grid">
          <div class="field full"><label>Họ và tên</label><input value="${profile.name}" /></div>
          <div class="field"><label>Email</label><input value="${profile.email}" /></div>
          <div class="field"><label>Số điện thoại</label><input value="${profile.phone}" /></div>
          <div class="field full"><label>Mật khẩu mới</label><input type="password" placeholder="Nhập mật khẩu mới" /></div>
          <div class="field full"><label>Xác nhận mật khẩu</label><input type="password" placeholder="Xác nhận mật khẩu mới" /></div>
        </form>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary">Hủy</button>
          <button type="button" class="btn">Lưu thay đổi</button>
        </div>
      </section>
    </div>
  `;
}

function main() {
  const body = document.body;
  const pageId = body.dataset.page || "dashboard";
  const config = pageConfig[pageId] || pageConfig.dashboard;

  const shell = `
    <div class="admin-shell">
      <aside class="admin-sidebar" id="adminSidebar">
        <a class="brand" href="dashboard.html" aria-label="UniLifeT Admin">
          <span class="brand-mark">U</span>
          <span class="brand-text">UniLifeT <small>Admin Panel</small></span>
        </a>

        <div class="sidebar-section">Menu chính</div>
        <nav class="side-nav" aria-label="Admin navigation">
          ${navItems.map(item => `
            <a class="nav-item ${pageId === item.id ? "active" : ""}" href="${item.href}">
              <span class="nav-icon" aria-hidden="true">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `).join("")}
        </nav>

        <div class="sidebar-footer">
          <a class="nav-item logout-item" href="dashboard.html" data-action="logout">
            <span class="nav-icon" aria-hidden="true">↩</span>
            <span>Đăng xuất</span>
          </a>
        </div>
      </aside>

      <main class="admin-main">
        <header class="topbar">
          <div class="topbar-left">
            <button class="menu-button" id="menuToggle" type="button" aria-label="Toggle menu">☰</button>
            <div>
              <p class="eyebrow">Quản trị hệ thống</p>
              <h1>${config.title}</h1>
            </div>
          </div>

          <div class="topbar-right">
            <div class="search-box">
              <span aria-hidden="true">⌕</span>
              <input type="search" placeholder="Tìm kiếm nhanh..." aria-label="Tìm kiếm nhanh" />
            </div>
            <button class="icon-pill" type="button" aria-label="Thông báo">🔔</button>
            <div class="user-chip">
              <span class="avatar">NM</span>
              <div class="user-meta">
                <strong>Nguyễn Minh Khang</strong>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div class="page-main">
          <div id="pageContent"></div>
        </div>
      </main>
    </div>
    <div class="toast-region" id="toast-region" aria-live="polite"></div>
  `;

  body.innerHTML = shell;

  const content = document.getElementById("pageContent");
  let renderedContent = "";
  switch (pageId) {
    case "users": renderedContent = renderUsersPage(); break;
    case "owners": renderedContent = renderOwnersPage(); break;
    case "motels": renderedContent = renderMotelsPage(); break;
    case "rooms": renderedContent = renderRoomsPage(); break;
    case "posts": renderedContent = renderPostsPage(); break;
    case "universities": renderedContent = renderUniversitiesPage(); break;
    case "services": renderedContent = renderServicesPage(); break;
    case "amenities": renderedContent = renderAmenitiesPage(); break;
    case "rental-requests": renderedContent = renderRentalRequestsPage(); break;
    case "reports": renderedContent = renderReportsPage(); break;
    case "profile": renderedContent = renderProfilePage(); break;
    default: renderedContent = renderDashboardPage();
  }
  content.innerHTML = renderedContent;

  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("adminSidebar");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  if (pageId === "dashboard") {
    const userCtx = document.getElementById("userChart");
    if (window.Chart && userCtx) {
      new Chart(userCtx, { type: "line", data: { labels: ["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"], datasets: [{ label: "Sinh viên", data: [820, 910, 980, 1020, 1160, 1225, 1340, 1480, 1560, 1670, 1820, 1945], borderColor: "#176B52", backgroundColor: "rgba(23,107,82,0.14)", borderWidth: 3, fill: true, tension: 0.35, pointRadius: 0 }, { label: "Chủ trọ", data: [180, 195, 220, 240, 290, 310, 350, 365, 390, 420, 465, 500], borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.12)", borderWidth: 3, fill: true, tension: 0.35, pointRadius: 0 }] }, options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: "rgba(148,163,184,0.14)" } } } } });
    }

    const roomCtx = document.getElementById("roomChart");
    if (window.Chart && roomCtx) {
      new Chart(roomCtx, { type: "doughnut", data: { labels: ["Còn trống", "Đã thuê", "Bảo trì"], datasets: [{ data: [42, 54, 4], backgroundColor: ["#176B52", "#1d4ed8", "#f59e0b"] }] }, options: { cutout: "60%", plugins: { legend: { display: false } } } });
    }

    const postsCtx = document.getElementById("postsChart");
    if (window.Chart && postsCtx) {
      new Chart(postsCtx, { type: "doughnut", data: { labels: ["Chờ duyệt", "Đã duyệt", "Bị từ chối"], datasets: [{ data: [18, 72, 10], backgroundColor: ["#f59e0b", "#16a34a", "#dc2626"] }] }, options: { cutout: "60%", plugins: { legend: { display: false } } } });
    }
  }

  if (pageId === "reports") {
    const lineCtx = document.getElementById("reportsLineChart");
    const doughnutCtx = document.getElementById("reportsDoughnut");
    if (window.Chart && lineCtx) {
      new Chart(lineCtx, { type: "line", data: { labels: ["T1","T2","T3","T4","T5","T6"], datasets: [{ label: "Phòng mới", data: [250, 280, 300, 420, 500, 520], borderColor: "#176B52", backgroundColor: "rgba(23,107,82,0.15)", fill: true, tension: 0.35 }] }, options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: "rgba(148,163,184,0.14)" } } } } });
    }
    if (window.Chart && doughnutCtx) {
      new Chart(doughnutCtx, { type: "doughnut", data: { labels: ["Còn trống", "Đã thuê", "Chờ kiểm duyệt"], datasets: [{ data: [40, 50, 10], backgroundColor: ["#176B52", "#1d4ed8", "#f59e0b"] }] }, options: { cutout: "60%", plugins: { legend: { display: false } } } });
    }
  }

  document.querySelectorAll("[data-action='logout']").forEach(el => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Đăng xuất thành công", "success");
    });
  });

  document.querySelectorAll("[data-action='refresh-dashboard']").forEach(el => {
    el.addEventListener("click", () => showToast("Dữ liệu dashboard đã được cập nhật", "success"));
  });

  document.querySelectorAll("[data-action^='add-']").forEach(button => {
    button.addEventListener("click", () => showToast("Mở form thêm mới", "success"));
  });

  document.querySelectorAll("[data-filter-field]").forEach(select => {
    select.addEventListener("change", () => {
      const table = select.closest(".table-wrap");
      const rows = Array.from(table?.querySelectorAll("tbody tr") || []);
      const filters = Array.from(document.querySelectorAll("[data-filter-field]"));
      rows.forEach(row => row.hidden = false);
      filters.forEach(filter => {
        const value = filter.value;
        if (!value) return;
        rows.forEach(row => {
          const cellText = row.cells[Array.from(filters).indexOf(filter)]?.textContent?.trim() || "";
          if (!cellText.toLowerCase().includes(value.toLowerCase()) && !cellText.includes(value)) {
            row.hidden = true;
          }
        });
      });
    });
  });

  const searchInput = document.querySelector(".search-box input");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value.trim().toLowerCase();
      document.querySelectorAll(".data-table tbody tr").forEach(row => {
        const text = row.textContent.toLowerCase();
        row.hidden = query && !text.includes(query);
      });
    });
  }
}

main();
