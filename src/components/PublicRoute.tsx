import { Navigate, Outlet } from 'react-router-dom';
import { useData } from '../context/DataContext';

function PublicRoute() {
  const { authToken } = useData();
  
  return authToken ? <Navigate to="/expenses" replace /> : <Outlet />;
}

export default PublicRoute;