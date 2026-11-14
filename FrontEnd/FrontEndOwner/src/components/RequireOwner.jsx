import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../api/client';

export default function RequireOwner() {
  return getToken() ? <Outlet /> : <Navigate to="/login" replace />;
}
