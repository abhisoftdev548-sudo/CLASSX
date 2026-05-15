import { Navigate } from 'react-router-dom';
import useClass from '../features/classroom/hooks/useClass';
import ProtectedRoute from './ProtectedRoute';

const ProtectedClassRoute = ({ children, requiredRoles = ['teacher', 'creator'] }) => {
  const { activeClass, loading } = useClass();

  // First check if user is authenticated
  return (
    <ProtectedRoute>
      {loading ? (
        <div className='h-screen w-screen flex items-center justify-center'>
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : activeClass && requiredRoles.includes(activeClass.role) ? (
        children
      ) : (
        <Navigate to="/dashboard" replace />
      )}
    </ProtectedRoute>
  );
};

export default ProtectedClassRoute;
