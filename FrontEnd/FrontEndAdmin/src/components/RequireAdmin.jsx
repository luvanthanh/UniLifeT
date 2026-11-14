import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RequireAdmin({ children }) {
  const { token, role } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role !== "ADMIN") return <main className="access-denied"><h1>Không có quyền quản trị</h1><p>Tài khoản hiện tại không có role ADMIN.</p></main>;
  return children;
}
