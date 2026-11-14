import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatNumber } from "../api/client.js";

const cards = [
  ["Người dùng", "/users", "users"],
  ["Chủ trọ", "/owners", "owners"],
  ["Nhà trọ", "/motels", "motels"],
  ["Phòng", "/rooms", "rooms"],
  ["Tin đăng", "/posts", "posts"],
  ["Yêu cầu thuê", "/rental-requests", "rentalRequests"],
  ["Lịch xem phòng", "/viewing-appointments", "appointments"],
  ["Đánh giá phòng", "/reviews", "reviews"],
  ["Hợp đồng thuê", "/contracts", "contracts"]
];

export default function DashboardPage() {
  const [data, setData] = useState(null); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true); setError("");
    const paths = ["/users", "/users", "/motels", "/rooms", "/posts", "/rental-requests/admin", "/viewing-appointments/admin", "/room-reviews/admin", "/user-room"];
    const results = await Promise.allSettled(paths.map(path => api.list(path)));
    const failed = results.find(result => result.status === "rejected");
    setData(Object.fromEntries(cards.map(([, , key], index) => [key, results[index].status === "fulfilled" ? results[index].value : null])));
    if (failed) setError(failed.reason.message);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  const owners = data?.users?.filter(user => user.userRole === "OWNER") || [];
  return <main className="content"><div className="page-title"><div><h1>Tổng quan</h1><p>Số liệu tổng hợp từ các API UniLifeT.</p></div><button className="button secondary" onClick={load}>Tải lại</button></div>
    {error && <div className="error-banner">Một số API không tải được: {error}</div>}
    {loading ? <div className="empty-state panel">Đang tải dữ liệu…</div> : <div className="stats-grid">{cards.map(([label, href, key])=><Link className="stat-card" to={href} key={key}><span>{label}</span><strong>{key === "owners" ? formatNumber(owners.length) : data?.[key] ? formatNumber(data[key].length) : "—"}</strong><small>{data?.[key] ? "Dữ liệu hiện tại" : "API chưa trả dữ liệu"}</small></Link>)}</div>}
    <section className="panel dashboard-note"><h2>Quản lý dữ liệu</h2><p>Chọn một mục trong thanh điều hướng để xem và thao tác trên dữ liệu API.</p></section>
  </main>;
}
