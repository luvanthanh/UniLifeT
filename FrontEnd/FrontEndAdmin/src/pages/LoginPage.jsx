import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(""); setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const role = await login(String(form.get("username")).trim(), String(form.get("password")));
      if (role !== "ADMIN") { setError("Tài khoản đăng nhập không có role ADMIN."); return; }
      navigate(location.state?.from || "/", { replace: true });
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return <main className="login-page"><form className="login-card" onSubmit={submit}><div className="brand login-brand">UniLifeT <span>Admin</span></div><h1>Đăng nhập quản trị</h1><p>Đăng nhập bằng tài khoản có quyền ADMIN.</p><label className="field"><span>Tên đăng nhập</span><input name="username" autoComplete="username" required /></label><label className="field"><span>Mật khẩu</span><input name="password" type="password" autoComplete="current-password" required /></label>{error&&<div className="error-banner">{error}</div>}<button className="button primary full" disabled={busy}>{busy?"Đang đăng nhập…":"Đăng nhập"}</button><Link to="/" className="back-home">Về trang tổng quan</Link></form></main>;
}
