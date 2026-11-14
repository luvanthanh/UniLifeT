import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  ["/", "Tổng quan"],
  ["/users", "Người dùng"],
  ["/owners", "Chủ trọ"],
  ["/motels", "Nhà trọ"],
  ["/rooms", "Phòng trọ"],
  ["/posts", "Tin đăng"],
  ["/universities", "Trường đại học"],
  ["/services", "Dịch vụ"],
  ["/amenities", "Tiện nghi"],
  ["/rental-requests", "Yêu cầu thuê"],
  ["/viewing-appointments", "Lịch xem phòng"],
  ["/reviews", "Đánh giá phòng"],
  ["/contracts", "Hợp đồng thuê"]
];

export default function AdminLayout() {
  const { logout } = useAuth();
  return <div className="admin-layout">
    <aside className="sidebar">
      <NavLink to="/" className="brand">UniLifeT <span>Admin</span></NavLink>
      <nav>{links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}</nav>
      <button className="logout" onClick={logout}>Đăng xuất</button>
    </aside>
    <div className="admin-main"><header className="topbar"><span>Khu vực quản trị</span><span>UniLifeT</span></header><Outlet /></div>
  </div>;
}
