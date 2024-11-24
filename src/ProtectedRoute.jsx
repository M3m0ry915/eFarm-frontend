import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ requiredRoles = [] }) => {
    sessionStorage.setItem('username', 'exampleUser');
    sessionStorage.setItem('password', 'password');
    sessionStorage.setItem('roles', JSON.stringify(['ROLE_FARM_OWNER']));
    sessionStorage.setItem('expireCodeInfo', 'Kod aktywacyjny wygasa za 3 dni.');

    const { user, loading } = useAuth();
    console.log('ProtectedRoute:', user);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !user.username || !user.roles) {
        return <Navigate to="/sign-in" />;
    }

    if (requiredRoles.length > 0 && !user.roles.some(role => requiredRoles.includes(role))) {
        return <Navigate to="/not-authorized" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
