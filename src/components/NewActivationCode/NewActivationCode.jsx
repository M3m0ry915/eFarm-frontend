import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../AuthContext.jsx';
import './NewActivationCode.css'; // Importujemy plik CSS

const NewActivationCode = () => {
    const [formData, setFormData] = useState({
        password: '',
        newActivationCode: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userRole, setUserRole] = useState('');
    const {
        isAuthenticated,
        userRoles = [],
        username,
        user,
        handleLogout,
        handleExpireCodeInfoUpdate,
    } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Nowy kod aktywacyjny';
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/sign-in');
            return;
        }

        if (!user.roles.includes('ROLE_FARM_OWNER')) {
            navigate('/not-authorized');
            return;
        }

        setUserRole('OWNER');
    }, [navigate, isAuthenticated, userRoles, user]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (!formData.password.trim()) {
            return 'Password is required.';
        }
        if (!formData.newActivationCode.trim()) {
            return 'New Activation Code is required.';
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
            const response = await fetch('/api/auth/update-activation-code', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    password: formData.password,
                    newActivationCode: formData.newActivationCode,
                }),
            });

            if (response.ok) {
                setSuccessMessage('Activation code updated successfully.');
                handleExpireCodeInfoUpdate(null);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to update activation code.');
            }
        } catch (error) {
            setErrorMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="new-activation-code-container">
            <Navbar onLogout={handleLogout} userRole={userRole} username={username} />
            <div>
                <h2>Aktualizacja kodu</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Hasło:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Nowy kod:</label>
                        <input
                            type="text"
                            name="newActivationCode"
                            value={formData.newActivationCode}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit">Zatwierdź</button>
                </form>
            </div>
        </div>
    );
};

export default NewActivationCode;
