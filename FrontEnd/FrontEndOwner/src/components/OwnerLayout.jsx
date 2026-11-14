import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearToken } from '../api/client';

const links = [
  ['/', 'Tổng quan'], ['/motels', 'Nhà trọ'], ['/rooms', 'Phòng trọ'], ['/posts', 'Tin đăng'],
  ['/rental-requests', 'Yêu cầu thuê'], ['/appointments', 'Lịch xem phòng'], ['/tenants', 'Người thuê'],
  ['/amenities', 'Tiện nghi phòng'], ['/images', 'Hình ảnh'], ['/statistics', 'Thống kê'], ['/profile', 'Tài khoản'],
];

export default function OwnerLayout() {
  const navigate = useNavigate();
  function logout() { clearToken(); navigate('/login', { replace: true }); }
  return <div className="shell">
    <aside className="sidebar"><div className="brand">UniLifeT <small>Chủ nhà trọ</small></div>
      <nav>{links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}</nav>
      <button className="logout" onClick={logout}>Đăng xuất</button>
    </aside>
    <main className="main"><Outlet /></main>
  </div>;
}
