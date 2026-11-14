import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function ProfilePage() {
  const [user, setUser] = useState(null); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { api.me().then(setUser).catch(e => setError(e.message)).finally(() => setLoading(false)); }, []);
  return <main className="content"><div className="page-title"><div><h1>Tài khoản quản trị</h1><p>Thông tin tài khoản đang đăng nhập.</p></div></div><section className="panel profile-card">{loading ? "Đang tải…" : error ? <div className="error-banner">{error}</div> : user && <dl><dt>Mã người dùng</dt><dd>{user.userId ?? "—"}</dd><dt>Tên đăng nhập</dt><dd>{user.userName}</dd><dt>Email</dt><dd>{user.userEmail || "—"}</dd><dt>Số điện thoại</dt><dd>{user.userPhone || "—"}</dd><dt>Vai trò</dt><dd>{user.userRole}</dd></dl>}</section></main>;
}
