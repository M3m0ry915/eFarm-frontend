import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../AuthContext.jsx';

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { user, handleLogout } = useAuth();

    const handleUsernameClick = () => {
        setShowDropdown(!showDropdown);
    };
    const userRole = user.roles.includes('ROLE_FARM_OWNER')
        ? 'OWNER'
        : user.roles.includes('ROLE_FARM_MANAGER')
            ? 'MANAGER'
            : user.roles.includes('ROLE_FARM_EQUIPMENT_OPERATOR')
                ? 'OPERATOR'
                : 'OTHER_ROLE';

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f8f8' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/dashboard">
                    <button>Gospodarstwo</button>
                </Link>
                <Link to="#">
                    <button>Zabiegi</button>
                </Link>
                <Link to="/equipment">
                    <button>Sprzęt</button>
                </Link>
                <Link to="#">
                    <button>Finanse</button>
                </Link>
                <Link to="#">
                    <button>Ewidencja</button>
                </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                {(userRole === 'OWNER' || userRole === 'MANAGER') && (
                    <Link to="/signup-user">
                        <button>Zarejestruj Użytkownika</button>
                    </Link>
                )}
                <div style={{ position: 'relative' }}>
          <span onClick={handleUsernameClick} style={{ cursor: 'pointer' }}>
            {user.username}
          </span>
                    {showDropdown && (
                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                zIndex: 1,
                            }}
                        >
                            {(userRole === 'OWNER' || userRole === 'MANAGER') && (
                                <Link to="/farm-details" onClick={() => setShowDropdown(false)}>
                                    <div style={{ padding: '10px' }}>Farm Details</div>
                                </Link>
                            )}
                            <Link to="/change-password" onClick={() => setShowDropdown(false)}>
                                <div style={{ padding: '10px' }}>Change Password</div>
                            </Link>
                            {userRole === 'OWNER' && (
                                <Link to="/new-activation-code" onClick={() => setShowDropdown(false)}>
                                    <div style={{ padding: '10px' }}>New Activation Code</div>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
                <button onClick={handleLogout}>Wyloguj</button>
            </div>
        </nav>
    );
};
export default Navbar;
