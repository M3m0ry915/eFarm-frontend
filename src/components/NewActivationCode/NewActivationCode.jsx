import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { AuthContext } from '../../AuthContext.jsx';

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
        userRoles,
        username,
        handleLogout,
        handleExpireCodeInfoUpdate,
    } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/sign-in');
            return;
        }

        if (!userRoles.includes('ROLE_FARM_OWNER')) {
            navigate('/not-authorized');
            return;
        }

        setUserRole('OWNER');
    }, [navigate, isAuthenticated, userRoles]);

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
                //const data = await response.json();
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
        <div>
            <Navbar onLogout={handleLogout} userRole={userRole} username={username} />
            <div style={{ padding: '20px' }}>
                <h2>New Activation Code</h2>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>New Activation Code:</label>
                        <input
                            type="text"
                            name="newActivationCode"
                            value={formData.newActivationCode}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};


export default NewActivationCode;
