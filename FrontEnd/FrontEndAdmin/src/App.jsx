import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import ResourcePage from "./components/ResourcePage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { resources } from "./pages/resources.js";

function AdminRoutes() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
      <Route index element={<DashboardPage />} />
      <Route path="profile" element={<ProfilePage />} />
      {Object.entries(resources).map(([path, config]) => <Route key={path} path={path} element={<ResourcePage config={config} />} />)}
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

export default function App() {
  return <AuthProvider><AdminRoutes /></AuthProvider>;
}
