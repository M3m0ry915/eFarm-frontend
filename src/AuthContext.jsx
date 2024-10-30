import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRoles, setUserRoles] = useState([]);
    const [username, setUsername] = useState('');
    const [expireCodeInfo, setExpireCodeInfo] = useState(null);

    useEffect(() => {
        const username = sessionStorage.getItem('username');
        const roles = sessionStorage.getItem('roles');
        const storedExpireCodeInfo = sessionStorage.getItem('expireCodeInfo');

        if (username && roles) {
            setIsAuthenticated(true);
            setUserRoles(JSON.parse(roles));
            setUsername(username);
            if (storedExpireCodeInfo) {
                setExpireCodeInfo(storedExpireCodeInfo);
            } else {
                setExpireCodeInfo(null);
            }
        }
    }, []);

    const handleLogin = (expireCodeInfoFromLogin) => {
        setIsAuthenticated(true);
        const roles = sessionStorage.getItem('roles');
        const username = sessionStorage.getItem('username');
        if (roles) {
            setUserRoles(JSON.parse(roles));
        }
        if (username) {
            setUsername(username);
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
        setUserRoles([]);
        setUsername('');
        setExpireCodeInfo(null);
        sessionStorage.clear();
    };

    const hasRole = (role) => {
        return userRoles.includes(role);
    };

    const hasAnyRole = (roles) => {
        return roles.some((role) => userRoles.includes(role));
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                userRoles,
                username,
                expireCodeInfo,
                handleLogin,
                handleLogout,
                handleExpireCodeInfoUpdate,
                hasRole,
                hasAnyRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );

};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};