import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { AuthContext } from '../../AuthContext.jsx';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const { isAuthenticated, userRoles, username } = useContext(AuthContext);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/sign-in');
            return;
        }

        if (userRoles.includes('ROLE_FARM_OWNER')) {
            setUserRole('OWNER');
        } else if (userRoles.includes('ROLE_FARM_MANAGER')) {
            setUserRole('MANAGER');
        } else if (userRoles.includes('ROLE_FARM_EQUIPMENT_OPERATOR')) {
            setUserRole('OPERATOR');
        } else {
            setUserRole('OTHER_ROLE');
        }
    }, [navigate, isAuthenticated, userRoles]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (!formData.currentPassword) {
            return 'Aktualne hasło jest wymagane.';
        }
        if (!formData.newPassword) {
            return 'Nowe hasło jest wymagane.';
        }
        if (formData.newPassword.length < 6 || formData.newPassword.length > 40) {
            return 'Nowe hasło musi mieć od 6 do 40 znaków.';
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
            return 'Nowe hasła nie są identyczne.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            if (response.ok) {
                setSuccessMessage('Hasło zostało zmienione pomyślnie.');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Nie udało się zmienić hasła.');
            }
        } catch (error) {
            setErrorMessage(`Błąd: ${error.message}`);
        }
    };

    return (
        <div>
            <Navbar userRole={userRole} username={username} />
            <div style={{ padding: '20px' }}>
                <h2>Zmień hasło</h2>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Aktualne hasło:</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Nowe hasło:</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Potwierdź nowe hasło:</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit">Zmień hasło</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
