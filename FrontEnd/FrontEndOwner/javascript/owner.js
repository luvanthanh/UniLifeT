const OWNER_NAV = [
  { key: 'dashboard', label: 'Tổng quan', icon: 'bi bi-grid-1x2-fill' },
  { key: 'motels', label: 'Quản lý nhà trọ', icon: 'bi bi-building' },
  { key: 'rooms', label: 'Quản lý phòng trọ', icon: 'bi bi-door-open' },
  { key: 'room-services', label: 'Quản lý dịch vụ phòng', icon: 'bi bi-tools' },
  { key: 'room-amenities', label: 'Quản lý tiện nghi phòng', icon: 'bi bi-stars' },
  { key: 'images', label: 'Quản lý hình ảnh', icon: 'bi bi-image' },
  { key: 'posts', label: 'Quản lý tin đăng', icon: 'bi bi-file-earmark-text' },
  { key: 'rental-requests', label: 'Yêu cầu thuê phòng', icon: 'bi bi-clipboard-check' },
  { key: 'tenants', label: 'Quản lý người thuê', icon: 'bi bi-people' },
  { key: 'statistics', label: 'Thống kê', icon: 'bi bi-bar-chart' },
  { key: 'profile', label: 'Hồ sơ cá nhân', icon: 'bi bi-person-circle' }
];

const OWNER_PAGE_META = {
  dashboard: { title: 'Tổng quan', subtitle: 'Theo dõi hoạt động và hiệu suất nhà trọ của bạn.' },
  motels: { title: 'Quản lý nhà trọ', subtitle: 'Danh sách và thông tin các nhà trọ đang quản lý.' },
  rooms: { title: 'Quản lý phòng trọ', subtitle: 'Theo dõi giá, trạng thái và tình trạng phòng hiện có.' },
  'room-services': { title: 'Quản lý dịch vụ phòng', subtitle: 'Quản lý các gói dịch vụ áp dụng cho từng phòng.' },
  'room-amenities': { title: 'Quản lý tiện nghi phòng', subtitle: 'Theo dõi tiện ích đi kèm trong từng phòng.' },
  images: { title: 'Quản lý hình ảnh', subtitle: 'Quản lý ảnh đại diện và ảnh phòng nhà trọ.' },
  posts: { title: 'Quản lý tin đăng', subtitle: 'Tổ chức và duyệt tin đăng cho các phòng cho thuê.' },
  'rental-requests': { title: 'Yêu cầu thuê phòng', subtitle: 'Xem và xử lý các yêu cầu thuê từ sinh viên.' },
  tenants: { title: 'Quản lý người thuê', subtitle: 'Danh sách người thuê và trạng thái hợp đồng.' },
  statistics: { title: 'Thống kê', subtitle: 'Tập hợp dữ liệu hiển thị theo hiệu suất kinh doanh và phòng trọ.' },
  profile: { title: 'Hồ sơ cá nhân', subtitle: 'Thông tin tài khoản và tùy chọn cá nhân.' }
};

const API_BASE_URL = 'http://localhost:8080';
const OWNER_TOKEN_KEY = 'unilife_owner_token';
const OWNER_USER_KEY = 'unilife_owner_user';

const ownerData = {
  stats: [],
  motels: [],
  rooms: [],
  roomServices: [],
  roomAmenities: [],
  images: [],
  posts: [],
  requests: [],
  tenants: [],
  activities: []
};

const ownerUser = {
  name: 'Owner',
  role: 'Owner',
  email: 'owner@unilife.vn'
};

function getStoredOwnerToken() {
  return localStorage.getItem(OWNER_TOKEN_KEY) || '';
}

function safeJsonParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function extractApiResult(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && typeof payload.data === 'object') return [payload.data];
  return [];
}

async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getStoredOwnerToken();
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  const response = await fetch(`${API_BASE_URL}/${String(path).replace(/^\/+/, '')}`, {
    ...options,
    headers
  });

  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch (error) {
    payload = { message: text || 'Không thể đọc phản hồi từ API.' };
  }

  if (!response.ok) {
    throw new Error((payload && payload.message) || `Yêu cầu thất bại (${response.status})`);
  }

  return payload && payload.data !== undefined ? payload.data : payload;
}

function normalizeOwnerStatus(value) {
  const status = String(value || '').toUpperCase();
  if (['AVAILABLE', 'CÒN TRỐNG', 'OPEN'].includes(status)) return 'AVAILABLE';
  if (['RENTED', 'ĐÃ THUÊ', 'BOOKED'].includes(status)) return 'RENTED';
  if (['PENDING', 'CHỜ DUYỆT', 'WAITING'].includes(status)) return 'PENDING';
  if (['APPROVED', 'ĐÃ DUYỆT', 'ACTIVE'].includes(status)) return 'APPROVED';
  if (['REJECTED', 'TỪ CHỐI', 'DENIED'].includes(status)) return 'REJECTED';
  if (['MAINTENANCE', 'BẢO TRÌ'].includes(status)) return 'MAINTENANCE';
  if (status === 'INACTIVE') return 'INACTIVE';
  return 'PENDING';
}

function formatCurrency(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return value ?? '0';
  return `${number.toLocaleString('vi-VN')} VND`;
}

function mapMotelData(item) {
  const id = item.motelId ?? item.id ?? 'N/A';
  return {
    id: String(id),
    name: item.motelName || item.name || 'Nhà trọ',
    address: item.motelAddress || item.address || 'Chưa có địa chỉ',
    image: item.motelImage || item.image || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    rooms: item.roomCount || item.rooms || 0,
    description: item.motelDescription || item.description || 'Chưa cập nhật mô tả',
    status: normalizeOwnerStatus(item.motelStatus || item.status || 'ACTIVE')
  };
}

function mapRoomData(item) {
  const id = item.roomId ?? item.id ?? 'N/A';
  return {
    id: String(id),
    motel: item.motelName || item.motel || 'Nhà trọ',
    price: item.roomPrice ? formatCurrency(item.roomPrice) : item.price || '0',
    deposit: item.roomDeposit ? formatCurrency(item.roomDeposit) : item.deposit || '0',
    area: item.roomArea ? `${item.roomArea} m²` : item.area || 'Chưa có',
    type: item.roomType || item.type || 'Chưa xác định',
    status: normalizeOwnerStatus(item.roomStatus || item.status || 'AVAILABLE'),
    views: Number(item.roomView ?? item.views ?? 0),
    image: item.image || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
  };
}

function mapPostData(item) {
  return {
    id: String(item.postId ?? item.id ?? 'N/A'),
    title: item.postTitle || item.title || 'Tin đăng',
    room: item.roomId ? `R${item.roomId}` : (item.room || 'Chưa có'),
    date: item.postCreateAt ? new Date(item.postCreateAt).toLocaleDateString('vi-VN') : (item.date || 'Chưa có'),
    status: normalizeOwnerStatus(item.postStatus || item.status || 'PENDING'),
    views: Number(item.postView ?? item.views ?? 0)
  };
}

function mapServiceData(item) {
  return {
    id: String(item.serviceId ?? item.id ?? 'N/A'),
    room: item.roomId ? `R${item.roomId}` : 'Chưa có',
    service: item.serviceName || item.name || 'Dịch vụ',
    status: normalizeOwnerStatus(item.serviceStatus || item.status || 'ACTIVE')
  };
}

function mapAmenityData(item) {
  return {
    id: String(item.amenityId ?? item.id ?? 'N/A'),
    room: item.roomId ? `R${item.roomId}` : 'Chưa có',
    item: item.amenityName || item.name || 'Tiện nghi',
    status: normalizeOwnerStatus(item.amenityStatus || item.status || 'ACTIVE')
  };
}

function buildOwnerStats() {
  const rooms = ownerData.rooms || [];
  const motels = ownerData.motels || [];
  const posts = ownerData.posts || [];
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((room) => String(room.status).toUpperCase() === 'AVAILABLE').length;
  const rentedRooms = totalRooms - availableRooms;
  const pendingPosts = posts.filter((post) => String(post.status).toUpperCase() === 'PENDING').length;
  const totalViews = rooms.reduce((sum, room) => sum + Number(room.views || 0), 0);

  return [
    { label: 'Tổng số nhà trọ', value: String(motels.length), trend: '+0.0%', tone: 'green', icon: 'bi bi-building' },
    { label: 'Tổng số phòng trọ', value: String(totalRooms), trend: '+0.0%', tone: 'blue', icon: 'bi bi-door-open' },
    { label: 'Số phòng còn trống', value: String(availableRooms), trend: '+0.0%', tone: 'orange', icon: 'bi bi-house-add' },
    { label: 'Số phòng đã thuê', value: String(rentedRooms), trend: '+0.0%', tone: 'red', icon: 'bi bi-key' },
    { label: 'Tổng số tin đăng', value: String(posts.length), trend: '+0.0%', tone: 'green', icon: 'bi bi-file-earmark-text' },
    { label: 'Số tin đang chờ duyệt', value: String(pendingPosts), trend: '+0.0%', tone: 'orange', icon: 'bi bi-hourglass-split' },
    { label: 'Tổng lượt xem phòng', value: String(totalViews), trend: '+0.0%', tone: 'blue', icon: 'bi bi-eye' }
  ];
}

function buildOwnerActivities() {
  const rooms = ownerData.rooms || [];
  const posts = ownerData.posts || [];
  const recentRooms = rooms.slice(0, 2).map((room) => ({
    type: 'room-added',
    label: `Phòng ${room.id} được cập nhật trạng thái ${room.status === 'AVAILABLE' ? 'còn trống' : 'đã thuê'}`,
    time: 'Mới cập nhật'
  }));

  const recentPosts = posts.slice(0, 2).map((post) => ({
    type: 'post-added',
    label: `Tin đăng “${post.title}” đang ở trạng thái ${post.status}`,
    time: 'Mới nhất'
  }));

  return [...recentRooms, ...recentPosts].slice(0, 4);
}

function mapImageData(item) {
  return {
    id: String(item.imageId ?? item.id ?? 'N/A'),
    label: item.imageName || item.label || 'Ảnh',
    src: item.imageUrl || item.src || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
  };
}

async function loadOwnerData() {
  const [motelsResult, roomsResult, postsResult, servicesResult, amenitiesResult, roomServicesResult, roomAmenitiesResult, motelImagesResult, roomImagesResult, postImagesResult] = await Promise.allSettled([
    apiRequest('motels'),
    apiRequest('rooms'),
    apiRequest('posts'),
    apiRequest('services'),
    apiRequest('amenities'),
    apiRequest('room-service'),
    apiRequest('room-amenity'),
    apiRequest('motel-images'),
    apiRequest('room-images'),
    apiRequest('post-images')
  ]);

  ownerData.motels = motelsResult.status === 'fulfilled' ? extractApiResult(motelsResult.value).map(mapMotelData) : [];
  ownerData.rooms = roomsResult.status === 'fulfilled' ? extractApiResult(roomsResult.value).map(mapRoomData) : [];
  ownerData.posts = postsResult.status === 'fulfilled' ? extractApiResult(postsResult.value).map(mapPostData) : [];
  ownerData.roomServices = roomServicesResult.status === 'fulfilled' ? extractApiResult(roomServicesResult.value).map(mapServiceData) : [];
  ownerData.roomAmenities = roomAmenitiesResult.status === 'fulfilled' ? extractApiResult(roomAmenitiesResult.value).map(mapAmenityData) : [];
  ownerData.services = servicesResult.status === 'fulfilled' ? extractApiResult(servicesResult.value) : [];
  ownerData.amenities = amenitiesResult.status === 'fulfilled' ? extractApiResult(amenitiesResult.value) : [];
  ownerData.images = [
    ...(motelImagesResult.status === 'fulfilled' ? extractApiResult(motelImagesResult.value).map(mapImageData) : []),
    ...(roomImagesResult.status === 'fulfilled' ? extractApiResult(roomImagesResult.value).map(mapImageData) : []),
    ...(postImagesResult.status === 'fulfilled' ? extractApiResult(postImagesResult.value).map(mapImageData) : [])
  ];
  ownerData.stats = buildOwnerStats();
  ownerData.activities = buildOwnerActivities();
  ownerData.requests = [];
  ownerData.tenants = [];

  if (motelsResult.status === 'rejected' || roomsResult.status === 'rejected' || postsResult.status === 'rejected') {
    throw new Error('Không thể tải dữ liệu từ API. Vui lòng kiểm tra backend và endpoint /motels, /rooms và /posts.');
  }

  return ownerData;
}

function getPageKey() {
  const pageKey = document.body.dataset.page;
  if (pageKey) return pageKey;
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const file = path.replace('.html', '');
  return file === 'index' ? 'dashboard' : file;
}

function getNavRoute(pageKey) {
  const isNested = window.location.pathname.includes('/pages/');
  if (pageKey === 'dashboard') return isNested ? '../index.html' : 'index.html';
  return isNested ? `${pageKey}.html` : `pages/${pageKey}.html`;
}

function statusClass(status) {
  const map = {
    active: 'success',
    approved: 'success',
    pending: 'warning',
    rejected: 'danger',
    info: 'info',
    available: 'success',
    rented: 'info',
    maintenance: 'warning',
    neutral: 'neutral',
    default: 'neutral'
  };
  return map[status] || map.default;
}

function renderStatus(status, fallback = 'Không xác định') {
  const normalized = String(status || '').toUpperCase();
  const labelMap = {
    ACTIVE: 'Hoạt động',
    APPROVED: 'Đã duyệt',
    PENDING: 'Chờ xử lý',
    REJECTED: 'Từ chối',
    AVAILABLE: 'Còn trống',
    RENTED: 'Đã thuê',
    MAINTENANCE: 'Bảo trì',
    DEFAULT: 'Không xác định'
  };
  const key = normalized in labelMap ? normalized : fallback.toUpperCase();
  const text = labelMap[key] || fallback;
  return `<span class="status-badge ${statusClass(normalized.toLowerCase())}">${text}</span>`;
}

function initialsFromName(name) {
  return (name || 'Owner').trim().split(/\s+/).slice(0, 2).map(word => word[0].toUpperCase()).join('') || 'O';
}

function showToast(message, type = 'success') {
  const region = document.getElementById('toast-region');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  region.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 200);
  }, 2600);
}

function openModal(type) {
  const modal = document.getElementById('confirm-modal');
  if (!modal) return;
  modal.classList.add('open');
  modal.dataset.type = type;
}

function closeModal() {
  const modal = document.getElementById('confirm-modal');
  if (modal) modal.classList.remove('open');
}

function renderShell() {
  const pageKey = getPageKey();
  const meta = OWNER_PAGE_META[pageKey] || OWNER_PAGE_META.dashboard;
  const sidebar = `
    <aside class="owner-sidebar" id="owner-sidebar">
      <div class="brand">
        <div class="brand-mark">U</div>
        <div class="brand-text">
          UniLifeT
          <small>Owner Dashboard</small>
        </div>
      </div>
      <div class="sidebar-section">Menu</div>
      <nav class="side-nav">
        ${OWNER_NAV.map(item => `
          <a class="nav-item ${pageKey === item.key ? 'active' : ''}" href="${getNavRoute(item.key)}">
            <span class="nav-icon"><i class="${item.icon}"></i></span>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <a class="nav-item" href="../index.html">
          <span class="nav-icon"><i class="bi bi-house-door"></i></span>
          <span>Quay lại UniLifeT</span>
        </a>
        <button class="nav-item logout-item" type="button" data-action="logout">
          <span class="nav-icon"><i class="bi bi-box-arrow-right"></i></span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  `;

  const topbar = `
    <header class="topbar">
      <div class="topbar-left">
        <button class="menu-button" id="mobile-menu-toggle" type="button" aria-label="Toggle menu">
          <i class="bi bi-list"></i>
        </button>
        <div>
          <p class="breadcrumb">OWNER / ${meta.title}</p>
          <h1>${meta.title}</h1>
        </div>
      </div>
      <div class="topbar-actions">
        <button class="icon-button" type="button" aria-label="Thông báo">
          <i class="bi bi-bell"></i>
          <span class="badge">3</span>
        </button>
        <div class="user-pill">
          <div class="user-avatar">${initialsFromName(ownerUser.name)}</div>
          <div class="user-meta">
            <strong>${ownerUser.name}</strong>
            <span>${ownerUser.role}</span>
          </div>
        </div>
      </div>
    </header>
  `;

  const shell = document.getElementById('owner-app');
  shell.innerHTML = `
    <div class="owner-shell">
      ${sidebar}
      <main class="owner-main">
        ${topbar}
        <div class="page-body">
          <div id="owner-content"></div>
        </div>
      </main>
    </div>
    <div class="toast-region" id="toast-region"></div>
    <div class="modal-backdrop" id="confirm-modal">
      <div class="modal-card">
        <h3>Xác nhận</h3>
        <p>Bạn có chắc chắn muốn thực hiện thao tác này?</p>
        <div class="modal-actions">
          <button class="ghost-btn" type="button" data-close-modal="true">Hủy</button>
          <button class="danger-btn" type="button" data-confirm="true">Xác nhận</button>
        </div>
      </div>
    </div>
  `;

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebarEl = document.getElementById('owner-sidebar');
  mobileToggle?.addEventListener('click', () => {
    sidebarEl?.classList.toggle('open');
  });

  document.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
    showToast('Đăng xuất thành công', 'success');
  });

  document.querySelector('[data-close-modal="true"]')?.addEventListener('click', closeModal);
  document.querySelector('[data-confirm="true"]')?.addEventListener('click', () => {
    const type = document.getElementById('confirm-modal')?.dataset.type || 'action';
    showToast(`Đã xác nhận ${type}`, 'success');
    closeModal();
  });
}

function renderOverviewCards() {
  return `
    <div class="stats-grid">
      ${ownerData.stats.map((stat) => `
        <div class="card metric-card">
          <div class="metric-top">
            <div>
              <p class="metric-label">${stat.label}</p>
              <div class="metric-value">${stat.value}</div>
            </div>
            <div class="metric-icon ${stat.tone}"><i class="${stat.icon}"></i></div>
          </div>
          <span class="metric-trend ${stat.trend.startsWith('-') ? 'bad' : 'good'}">${stat.trend}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderDashboardPage() {
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow" style="margin:0 0 6px; color: var(--green); letter-spacing: 0.14em; text-transform: uppercase; font-size: 10px; font-weight: 800;">Owner dashboard</p>
        <h2>Nhà trọ & hoạt động cho thuê</h2>
      </div>
      <button class="primary-btn" type="button">+ Tạo tin mới</button>
    </div>
    ${renderOverviewCards()}
    <div class="row-grid">
      <div class="card panel">
        <div class="panel-header">
          <h3>Tỷ lệ phòng còn trống</h3>
          <span class="panel-sub">Hôm nay</span>
        </div>
        <div class="chart-wrap"><canvas id="occupancyChart"></canvas></div>
      </div>
      <div class="card panel">
        <div class="panel-header">
          <h3>Phòng theo trạng thái</h3>
          <span class="panel-sub">Đã cập nhật</span>
        </div>
        <div class="chart-wrap"><canvas id="statusChart"></canvas></div>
      </div>
    </div>
    <div class="row-grid">
      <div class="card panel">
        <div class="panel-header">
          <h3>Hoạt động gần đây</h3>
          <span class="panel-sub">Mới nhất</span>
        </div>
        <ul class="activity-list">
          ${ownerData.activities.map(item => `
            <li class="activity-item">
              <div class="activity-left">
                <div class="activity-dot"><i class="bi bi-activity"></i></div>
                <div class="activity-content">
                  <strong>${item.label}</strong>
                  <span>${item.time}</span>
                </div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="card panel">
        <div class="panel-header">
          <h3>Yêu cầu thuê mới</h3>
          <span class="panel-sub">3 yêu cầu</span>
        </div>
        <ul class="request-list">
          ${ownerData.requests.slice(0, 3).map(request => `
            <li class="request-item">
              <div class="request-left">
                <div class="user-avatar">${initialsFromName(request.sender)}</div>
                <div class="request-content">
                  <strong>${request.sender}</strong>
                  <span>${request.room} • ${request.motel}</span>
                </div>
              </div>
              ${renderStatus(request.status)}
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}

function renderGenericTable(title, columns, rows, actions = []) {
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow" style="margin:0 0 6px; color: var(--green); letter-spacing: 0.14em; text-transform: uppercase; font-size: 10px; font-weight: 800;">${title}</p>
        <h2>${OWNER_PAGE_META[getPageKey()].title}</h2>
      </div>
      <div class="toolbar">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input class="search-input" placeholder="Tìm kiếm..." />
        </div>
        <button class="primary-btn" type="button" data-open-form="new">+ Thêm mới</button>
      </div>
    </div>
    <div class="card table-card">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              ${columns.map(column => `<th>${column}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows.map((row) => `
              <tr>
                ${Object.values(row).map((value) => `<td>${value}</td>`).join('')}
                ${actions.length ? `<td><div class="row-actions">${actions.map((action) => `<button class="action-btn ${action.danger ? 'danger' : ''}" data-action="${action.key}" data-id="${row.id || row.name || 'item'}" type="button">${action.label}</button>`).join('')}</div></td>` : ''}
              </tr>
            `).join('') : `<tr><td colspan="${columns.length + (actions.length ? 1 : 0)}"><div class="empty-state">Không có dữ liệu phù hợp.</div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderMotelsPage() {
  const rows = ownerData.motels.map((item) => ({
    id: item.id,
    motel: `<div class="row-actions"><img class="room-thumb" src="${item.image}" alt="${item.name}" /><div><strong>${item.name}</strong><div class="muted">${item.address}</div></div></div>`,
    rooms: item.rooms,
    description: item.description,
    status: renderStatus(item.status),
    action: ''
  }));

  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Owner management</p>
        <h2>Quản lý nhà trọ</h2>
      </div>
      <div class="toolbar">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input class="search-input" placeholder="Tìm theo tên hoặc địa chỉ" />
        </div>
        <button class="primary-btn" type="button" data-open-form="new">+ Thêm nhà trọ</button>
      </div>
    </div>
    <div class="card table-card">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nhà trọ</th>
              <th>Số phòng</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${ownerData.motels.map((item) => `
              <tr>
                <td>${item.id}</td>
                <td>
                  <div style="display:flex; align-items:center; gap: 10px;">
                    <img class="room-thumb" src="${item.image}" alt="${item.name}" />
                    <div>
                      <strong>${item.name}</strong><br>
                      <span class="muted">${item.address}</span>
                    </div>
                  </div>
                </td>
                <td>${item.rooms}</td>
                <td>${item.description}</td>
                <td>${renderStatus(item.status)}</td>
                <td>
                  <div class="row-actions">
                    <button class="action-btn" data-action="view" data-id="${item.id}" type="button">Xem</button>
                    <button class="action-btn" data-action="edit" data-id="${item.id}" type="button">Sửa</button>
                    <button class="action-btn danger" data-action="delete" data-id="${item.id}" type="button">Xóa</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderRoomsPage() {
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Operations</p>
        <h2>Quản lý phòng trọ</h2>
      </div>
      <div class="toolbar">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input class="search-input" placeholder="Tìm phòng..." />
        </div>
        <button class="primary-btn" type="button" data-open-form="new">+ Thêm phòng</button>
      </div>
    </div>
    <div class="card table-card">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Phòng</th>
              <th>Nhà trọ</th>
              <th>Giá thuê</th>
              <th>Tiền cọc</th>
              <th>Diện tích</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Lượt xem</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${ownerData.rooms.map((room) => `
              <tr>
                <td>${room.id}</td>
                <td><img class="room-thumb" src="${room.image}" alt="${room.id}" /></td>
                <td>${room.motel}</td>
                <td>${room.price}</td>
                <td>${room.deposit}</td>
                <td>${room.area}</td>
                <td>${room.type}</td>
                <td>${renderStatus(room.status)}</td>
                <td>${room.views}</td>
                <td>
                  <div class="row-actions">
                    <button class="action-btn" data-action="status" data-id="${room.id}" type="button">Đổi trạng thái</button>
                    <button class="action-btn" data-action="view" data-id="${room.id}" type="button">Chi tiết</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderRoomServicesPage() {
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Room services</p>
        <h2>Quản lý dịch vụ phòng</h2>
      </div>
      <button class="primary-btn" type="button" data-open-form="new">+ Thêm dịch vụ</button>
    </div>
    <div class="card sheet">
      <div class="form-grid">
        <div class="field">
          <label>Chọn nhà trọ</label>
          <select class="filter-select">
            <option>Motel 23A</option>
            <option>Huyền Bảo Residence</option>
          </select>
        </div>
        <div class="field">
          <label>Chọn phòng</label>
          <select class="filter-select">
            <option>R101</option>
            <option>R102</option>
            <option>R103</option>
          </select>
        </div>
      </div>
    </div>
    <div class="card table-card" style="margin-top: 20px;">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Phòng</th>
              <th>Dịch vụ</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${ownerData.roomServices.map((item) => `
              <tr>
                <td>${item.id}</td>
                <td>${item.room}</td>
                <td>${item.service}</td>
                <td>${renderStatus(item.status)}</td>
                <td><button class="action-btn danger" data-action="remove-service" data-id="${item.id}" type="button">Xóa</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderRoomAmenitiesPage() {
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Amenities</p>
        <h2>Quản lý tiện nghi phòng</h2>
      </div>
      <button class="primary-btn" type="button" data-open-form="new">+ Thêm tiện nghi</button>
    </div>
    <div class="card sheet">
      <div class="form-grid">
        <div class="field">
          <label>Chọn nhà trọ</label>
          <select class="filter-select"><option>Motel 23A</option></select>
        </div>
        <div class="field">
          <label>Chọn phòng</label>
          <select class="filter-select"><option>R101</option></select>
        </div>
      </div>
    </div>
    <div class="card table-card" style="margin-top: 20px;">
      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>Phòng</th><th>Tiện nghi</th><th>Trạng thái</th><th>Thao tác</th></tr>
        </thead>
        <tbody>
          ${ownerData.roomAmenities.map((item) => `
            <tr>
              <td>${item.id}</td>
              <td>${item.room}</td>
              <td>${item.item}</td>
              <td>${renderStatus(item.status)}</td>
              <td><button class="action-btn danger" data-action="remove-amenity" data-id="${item.id}" type="button">Xóa</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderImagesPage() {
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Gallery</p>
        <h2>Quản lý hình ảnh</h2>
      </div>
      <div class="toolbar">
        <button class="secondary-btn" type="button">+ Chọn nhà trọ</button>
        <button class="primary-btn" type="button">+ Tải ảnh lên</button>
      </div>
    </div>
    <div class="card sheet">
      <div class="attachment-box">
        <div>
          <div style="font-size: 36px; margin-bottom: 8px;"><i class="bi bi-cloud-upload"></i></div>
          <strong>Đăng tải hình ảnh</strong>
          <p>Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB mỗi ảnh.</p>
          <label class="primary-btn" style="display: inline-block; cursor: pointer;">
            Chọn ảnh
            <input type="file" accept="image/*" multiple />
          </label>
        </div>
      </div>
    </div>
    <div class="card panel" style="margin-top: 20px;">
      <div class="panel-header">
        <h3>Thư viện ảnh</h3>
        <span class="panel-sub">${ownerData.images.length} ảnh</span>
      </div>
      <div class="image-grid">
        ${ownerData.images.map((image) => `
          <div class="image-card">
            <img src="${image.src}" alt="${image.label}" />
            <div class="image-card-body">
              <strong>${image.label}</strong>
              <button class="action-btn danger" type="button" data-action="delete-image" data-id="${image.id}">Xóa</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPostsPage() {
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Listings</p>
        <h2>Quản lý tin đăng</h2>
      </div>
      <button class="primary-btn" type="button" data-open-form="new">+ Tạo tin đăng</button>
    </div>
    <div class="card table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Phòng liên quan</th>
            <th>Ngày đăng</th>
            <th>Trạng thái</th>
            <th>Lượt xem</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${ownerData.posts.map((post) => `
            <tr>
              <td>${post.id}</td>
              <td><strong>${post.title}</strong></td>
              <td>${post.room}</td>
              <td>${post.date}</td>
              <td>${renderStatus(post.status)}</td>
              <td>${post.views}</td>
              <td>
                <div class="row-actions">
                  <button class="action-btn" data-action="edit-post" data-id="${post.id}" type="button">Sửa</button>
                  <button class="action-btn danger" data-action="delete-post" data-id="${post.id}" type="button">Xóa</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderRentalRequestsPage() {
  const requests = ownerData.requests || [];
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Applications</p>
        <h2>Yêu cầu thuê phòng</h2>
      </div>
      <div class="toolbar">
        <div class="search-box"><i class="bi bi-search"></i><input class="search-input" placeholder="Tìm yêu cầu..." /></div>
      </div>
    </div>
    <div class="card table-card">
      ${requests.length ? `
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Người yêu cầu</th>
              <th>Phòng</th>
              <th>Nhà trọ</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${requests.map((request) => `
              <tr>
                <td>${request.id}</td>
                <td>${request.sender}</td>
                <td>${request.room}</td>
                <td>${request.motel}</td>
                <td>${request.date}</td>
                <td>${renderStatus(request.status)}</td>
                <td>
                  <div class="row-actions">
                    <button class="action-btn" data-action="approve-request" data-id="${request.id}" type="button">Duyệt</button>
                    <button class="action-btn danger" data-action="reject-request" data-id="${request.id}" type="button">Từ chối</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `<div class="empty-state">Chưa có yêu cầu thuê nào từ API hiện tại.</div>`}
    </div>
  `;
}

function renderTenantsPage() {
  const tenants = ownerData.tenants || [];
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Tenants</p>
        <h2>Quản lý người thuê</h2>
      </div>
    </div>
    <div class="card table-card">
      ${tenants.length ? `
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Người thuê</th>
              <th>Phòng</th>
              <th>Nhà trọ</th>
              <th>Thời gian thuê</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${tenants.map((tenant) => `
              <tr>
                <td>${tenant.id}</td>
                <td>${tenant.name}</td>
                <td>${tenant.room}</td>
                <td>${tenant.motel}</td>
                <td>${tenant.lease}</td>
                <td>${renderStatus(tenant.status)}</td>
                <td><button class="action-btn" type="button" data-action="tenant-detail" data-id="${tenant.id}">Xem chi tiết</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `<div class="empty-state">Không có dữ liệu người thuê từ backend.</div>`}
    </div>
  `;
}

function renderStatisticsPage() {
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Reports</p>
        <h2>Thống kê chủ trọ</h2>
      </div>
      <div class="toolbar">
        <select class="filter-select" style="width: 170px; padding-left: 12px;">
          <option>Toàn bộ nhà trọ</option>
          <option>Motel 23A</option>
          <option>Huyền Bảo Residence</option>
        </select>
      </div>
    </div>
    <div class="stats-grid">
      <div class="card metric-card"><div class="metric-label">Tổng số nhà trọ</div><div class="metric-value">12</div><span class="metric-trend good">+3.2%</span></div>
      <div class="card metric-card"><div class="metric-label">Tổng số phòng</div><div class="metric-value">128</div><span class="metric-trend good">+8.5%</span></div>
      <div class="card metric-card"><div class="metric-label">Phòng còn trống</div><div class="metric-value">36</div><span class="metric-trend warn">+2.1%</span></div>
      <div class="card metric-card"><div class="metric-label">Tỷ lệ lấp đầy</div><div class="metric-value">72%</div><span class="metric-trend good">+4.7%</span></div>
    </div>
    <div class="row-grid">
      <div class="card panel"><div class="panel-header"><h3>Phòng theo trạng thái</h3><span class="panel-sub">Hiện tại</span></div><div class="chart-wrap"><canvas id="reportRoomsChart"></canvas></div></div>
      <div class="card panel"><div class="panel-header"><h3>Tin đăng theo trạng thái</h3><span class="panel-sub">Mới nhất</span></div><div class="chart-wrap"><canvas id="postsStatusChart"></canvas></div></div>
    </div>
  `;
}

function renderProfilePage() {
  return `
    <div class="page-header">
      <div>
        <p class="eyebrow">Profile</p>
        <h2>Hồ sơ chủ trọ</h2>
      </div>
      <button class="ghost-btn" type="button">Đổi mật khẩu</button>
    </div>
    <div class="card sheet">
      <div class="form-grid">
        <div class="field full-span">
          <div style="display:flex; align-items:center; gap:16px;">
            <div class="user-avatar" style="width:60px; height:60px; font-size: 22px;">${initialsFromName(ownerUser.name)}</div>
            <div>
              <div style="font-size: 22px; font-weight: 800;">${ownerUser.name}</div>
              <div class="muted">Chủ trọ • ${ownerUser.email}</div>
            </div>
          </div>
        </div>
        <div class="field">
          <label>Họ và tên</label>
          <input class="form-control" value="${ownerUser.name}" />
        </div>
        <div class="field">
          <label>Email</label>
          <input class="form-control" value="${ownerUser.email}" />
        </div>
        <div class="field">
          <label>Số điện thoại</label>
          <input class="form-control" value="0909 123 456" />
        </div>
        <div class="field">
          <label>Vai trò</label>
          <input class="form-control" value="OWNER" />
        </div>
        <div class="field full-span">
          <label>Địa chỉ</label>
          <textarea class="form-textarea">87 Lê Văn Việt, Quận 9, TP.HCM</textarea>
        </div>
      </div>
      <div class="modal-actions" style="margin-top:20px; justify-content:flex-start;">
        <button class="primary-btn" type="button">Lưu thông tin</button>
      </div>
    </div>
  `;
}

function renderContent() {
  const pageKey = getPageKey();
  const content = document.getElementById('owner-content');

  const renderMap = {
    dashboard: renderDashboardPage,
    motels: renderMotelsPage,
    rooms: renderRoomsPage,
    'room-services': renderRoomServicesPage,
    'room-amenities': renderRoomAmenitiesPage,
    images: renderImagesPage,
    posts: renderPostsPage,
    'rental-requests': renderRentalRequestsPage,
    tenants: renderTenantsPage,
    statistics: renderStatisticsPage,
    profile: renderProfilePage
  };

  content.innerHTML = renderMap[pageKey] ? renderMap[pageKey]() : renderDashboardPage();

  document.querySelectorAll('[data-open-form="new"]').forEach((button) => {
    button.addEventListener('click', () => showToast('Mở form thêm mới', 'success'));
  });

  document.querySelectorAll('[data-action]').forEach((button) => {
    const action = button.dataset.action;
    if (action === 'delete' || action === 'remove-service' || action === 'remove-amenity' || action === 'delete-image' || action === 'delete-post') {
      button.addEventListener('click', () => openModal(action));
    } else if (action === 'view' || action === 'edit' || action === 'status' || action === 'approve-request' || action === 'reject-request' || action === 'tenant-detail' || action === 'edit-post') {
      button.addEventListener('click', () => showToast(`Thao tác ${action} đã được kích hoạt`, 'success'));
    }
  });

  if (pageKey === 'dashboard') {
    const occupancyCtx = document.getElementById('occupancyChart');
    const statusCtx = document.getElementById('statusChart');
    if (occupancyCtx && window.Chart) {
      new Chart(occupancyCtx, {
        type: 'doughnut',
        data: {
          labels: ['Còn trống', 'Đã thuê'],
          datasets: [{ data: [36, 92], backgroundColor: ['#F59E0B', '#176B52'] }]
        },
        options: { cutout: '70%', maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      });
    }

    if (statusCtx && window.Chart) {
      new Chart(statusCtx, {
        type: 'bar',
        data: {
          labels: ['Chờ duyệt', 'Đã duyệt', 'Bị từ chối'],
          datasets: [{ label: 'Tin đăng', data: [8, 22, 3], backgroundColor: ['#F59E0B', '#176B52', '#DC2626'] }]
        },
        options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
      });
    }
  }

  if (pageKey === 'statistics') {
    const roomCtx = document.getElementById('reportRoomsChart');
    const postCtx = document.getElementById('postsStatusChart');
    if (roomCtx && window.Chart) {
      new Chart(roomCtx, {
        type: 'pie',
        data: {
          labels: ['Còn trống', 'Đã thuê', 'Bảo trì'],
          datasets: [{ data: [36, 92, 8], backgroundColor: ['#F59E0B', '#176B52', '#2563EB'] }]
        },
        options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      });
    }
    if (postCtx && window.Chart) {
      new Chart(postCtx, {
        type: 'bar',
        data: {
          labels: ['Chờ duyệt', 'Đã duyệt', 'Bị từ chối'],
          datasets: [{ data: [5, 18, 2], backgroundColor: ['#F59E0B', '#176B52', '#DC2626'] }]
        },
        options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  renderShell();

  try {
    await loadOwnerData();
    renderContent();
    showToast('Dữ liệu OWNER đã được tải từ API.', 'success');
  } catch (error) {
    renderContent();
    showToast(error.message || 'Không thể kết nối API.', 'error');
  }

  const sidebar = document.getElementById('owner-sidebar');
  if (window.innerWidth <= 900) {
    sidebar?.classList.remove('open');
  }
});

window.addEventListener('resize', () => {
  const sidebar = document.getElementById('owner-sidebar');
  if (window.innerWidth > 900) {
    sidebar?.classList.remove('open');
  }
});
