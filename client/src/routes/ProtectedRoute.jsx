import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuth from '../features/auth/hooks/useAuth';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitialized, firebaseLoginSync } = useAuth();
  const [firebaseChecked, setFirebaseChecked] = useState(false);

  useEffect(() => {
    // Sync Firebase session with backend if needed
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user && !isAuthenticated && isInitialized) {
        try {
          const idToken = await user.getIdToken();
          await firebaseLoginSync(idToken);
        } catch (error) {
          console.error("Firebase sync error", error);
        }
      }
      setFirebaseChecked(true);
    });

    return () => unsubscribe();
  }, [isAuthenticated, isInitialized, firebaseLoginSync]);

  // Jab tak auth check nahi ho jata, loading dikhao
  if (!isInitialized || !firebaseChecked) return <div className='h-screen w-screen flex items-center justify-center '>
    <div className="loading loading-spinner loading-lg"></div>
  </div>;

  // Agar user nahi hai, login pe bhej do
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;