import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = (requiredRoles) => {
    const { user,loading } = useAuth();
    console.log('ProtectedRoute:', user);
    if(loading) {
        return <div>Loading...</div>
    }

    if (!user.username || !user.roles) {
        return <Navigate to="/sign-in" />;
    }
    if (!user || !user.username || !user.roles) {
        return <Navigate to="/sign-in" />;
    }
    if (requiredRoles && !user.roles.some(role => requiredRoles.includes(role))) {
        return <Navigate to="/not-authorized" />;
    }
    return <Outlet />;
};

export default ProtectedRoute;