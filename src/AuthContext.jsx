import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        username: '',
        roles: []
    })
    const [expireCodeInfo, setExpireCodeInfo] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const username = sessionStorage.getItem('username');
            const roles = sessionStorage.getItem('roles');
            const storedExpireCodeInfo = sessionStorage.getItem('expireCodeInfo');
            
            if (username && roles) {
                setIsAuthenticated(true);
                setUser({
                    username: username,
                    roles: JSON.parse(roles)
                });
                if (storedExpireCodeInfo && storedExpireCodeInfo !== 'null') {
                    setExpireCodeInfo(storedExpireCodeInfo);
                } else {
                    setExpireCodeInfo(null);
                }
            }
            setLoading(false);
        }
        checkAuthStatus();
    }, []);

    const handleLogin = (expireCodeInfoFromLogin) => {
        setIsAuthenticated(true);
        const roles = sessionStorage.getItem('roles');
        const username = sessionStorage.getItem('username');
        if (roles && username) {
            setUser({
                username: username,
                roles: JSON.parse(roles)
            });
        }
        if (expireCodeInfoFromLogin) {
            setExpireCodeInfo(expireCodeInfoFromLogin);
        } else {
            setExpireCodeInfo(null);
        }
    };

    const handleExpireCodeInfoUpdate = (newExpireCodeInfo) => {
        setExpireCodeInfo(newExpireCodeInfo);
        sessionStorage.setItem('expireCodeInfo', newExpireCodeInfo);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                console.log('Logged out from backend');
            } else {
                console.error('Failed to log out from backend');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
        setIsAuthenticated(false);
        setUser(null);
        setExpireCodeInfo(null);
        sessionStorage.clear();
    };

    // const hasRole = (role) => {
    //     return user.roles.includes(role);
    // };

    // const hasAnyRole = (roles) => {
    //     return user.roles.some((role) => userRoles.includes(role));
    // };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                expireCodeInfo,
                loading,
                handleLogin,
                handleLogout,
                handleExpireCodeInfoUpdate
            }}
        >
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    return useContext(AuthContext);
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
