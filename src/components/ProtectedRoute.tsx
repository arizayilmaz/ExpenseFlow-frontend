import { Navigate, Outlet } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Spinner } from './common/Spinner'; // Yükleme ikonu bileşenimiz

/**
 * Bu bileşen, altındaki rotaları kimlik doğrulamasına karşı korur.
 * Kullanıcı giriş yapmamışsa, onu login sayfasına yönlendirir.
 * Giriş yapmışsa, gitmek istediği sayfayı gösterir.
 */
function ProtectedRoute() {
  const { authToken, isLoading } = useData();

  // Context, ilk başta token'ı ve kullanıcı durumunu kontrol ederken
  // isLoading true olur. Bu sırada bir bekleme ekranı gösteriyoruz.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Yükleme bittiğinde:
  // Eğer authToken varsa (kullanıcı giriş yapmışsa), Outlet'i (yani istenen sayfayı) göster.
  // Eğer authToken yoksa, kullanıcıyı login sayfasına yönlendir.
  return authToken ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;