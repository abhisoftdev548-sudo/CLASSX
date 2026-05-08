import { Navigate } from 'react-router-dom';
import useAuth from '../features/auth/hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return <div className='h-screen w-screen flex items-center justify-center '>
    <div className="loading loading-spinner loading-lg"></div>
  </div>;

  // Agar user already logged-in hai, toh usse wapas login/signup pe mat jaane do
  if (isAuthenticated) return <Navigate to="/dashboard/profile" replace />;

  return children;
};

export default PublicRoute;