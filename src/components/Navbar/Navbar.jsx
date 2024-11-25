import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import './Navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeButton, setActiveButton] = useState(null);  // Dodajemy stan do śledzenia aktywnego przycisku
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    const handleUsernameClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/sign-in');
    };

    const userRole = user.roles.includes('ROLE_FARM_OWNER')
        ? 'OWNER'
        : user.roles.includes('ROLE_FARM_MANAGER')
            ? 'MANAGER'
            : user.roles.includes('ROLE_FARM_EQUIPMENT_OPERATOR')
                ? 'OPERATOR'
                : 'OTHER_ROLE';

    // Funkcja do ustawiania aktywnego przycisku
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);  // Ustawia przycisk jako aktywny
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/dashboard">
                    <button
                        className={`navbar-button ${activeButton === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('dashboard')}
                    >
                        <i className="fas fa-dashboard"></i> Gospodarstwo
                    </button>
                </Link>
                <Link to="#">
                    <button
                        className={`navbar-button ${activeButton === 'zabiegi' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('zabiegi')}
                    >
                        <i className="fas fa-seedling"></i> Zabiegi
                    </button>
                </Link>
                <Link to="/equipment">
                    <button
                        className={`navbar-button ${activeButton === 'sprzet' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('sprzet')}
                    >
                        <i className="fas fa-tractor"></i> Sprzęt
                    </button>
                </Link>
                <Link to="#">
                    <button
                        className={`navbar-button ${activeButton === 'finanse' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('finanse')}
                    >
                        <i className="fas fa-coins"></i> Finanse
                    </button>
                </Link>
                <Link to="#">
                    <button
                        className={`navbar-button ${activeButton === 'ewidencja' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('ewidencja')}
                    >
                        <i className="fas fa-file-alt"></i> Ewidencja
                    </button>
                </Link>
            </div>
            <div className="navbar-user-section">
                {(userRole === 'OWNER' || userRole === 'MANAGER') && (
                    <Link to="/signup-user">
                        <button className="navbar-button">
                            <i className="fas fa-user-plus"></i> Zarejestruj Użytkownika
                        </button>
                    </Link>
                )}
                <div className="navbar-username-container">
                    <span
                        onClick={handleUsernameClick}
                        className={`navbar-username ${showDropdown ? 'active' : ''}`}
                    >
                        {user.username}
                    </span>
                    {showDropdown && (
                        <div className="username-dropdown">
                            {(userRole === 'OWNER' || userRole === 'MANAGER') && (
                                <Link to="/farm-details" onClick={() => setShowDropdown(false)}>
                                    <div>szczegóły farmy</div>
                                </Link>
                            )}
                            <Link to="/change-password" onClick={() => setShowDropdown(false)}>
                                <div>zmiana hasła</div>
                            </Link>
                            {userRole === 'OWNER' && (
                                <Link to="/new-activation-code" onClick={() => setShowDropdown(false)}>
                                    <div>Aktualizacja kodu</div>
                                </Link>
                            )}
                            <div onClick={handleLogoutClick} style={{cursor: 'pointer'}}>
                                Wyloguj
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
