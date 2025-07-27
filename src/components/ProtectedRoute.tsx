import { Navigate, Outlet } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Spinner } from './common/Spinner';

function ProtectedRoute() {
  const { authToken, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return authToken ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;