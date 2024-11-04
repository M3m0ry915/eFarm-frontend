import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
  const { user,loading } = useAuth();
  console.log('ProtectedRoute:', user);
  if(loading) {
    return <div>Loading...</div>
  }

  if (!user.username || !user.roles) {
    return <Navigate to="/sign-in" />;
  }
  return <Outlet />;
};
  
export default ProtectedRoute;