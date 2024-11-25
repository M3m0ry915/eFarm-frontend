import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupFarm.css'; // Importujemy plik CSS

const SignupFarm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        farmName: '',
        activationCode: ''
    });
    const [responseMessage, setResponseMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (formData.firstName.length < 3 || formData.firstName.length > 30) {
            return 'First name must be between 3 and 30 characters.';
        }
        if (formData.lastName.length < 3 || formData.lastName.length > 40) {
            return 'Last name must be between 3 and 40 characters.';
        }
        if (formData.username.length < 3 || formData.username.length > 30) {
            return 'Username must be between 3 and 30 characters.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email) || formData.email.length > 50) {
            return 'Email must be a valid address and less than 50 characters.';
        }
        if (formData.password.length < 6 || formData.password.length > 40) {
            return 'Password must be between 6 and 40 characters.';
        }
        if (formData.phoneNumber && (formData.phoneNumber.length < 6 || formData.phoneNumber.length > 20)) {
            return 'Phone number must be between 6 and 20 characters.';
        }
        if (formData.farmName.length < 6 || formData.farmName.length > 45) {
            return 'Farm name must be between 6 and 45 characters.';
        }
        if (formData.activationCode.length < 6 || formData.activationCode.length > 45) {
            return 'Activation code must be between 6 and 45 characters.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage('');
        setErrorMessage('');

        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            const response = await fetch('/api/auth/signupfarm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await response.json();
                setResponseMessage('Registration successful!');
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error: ${errorData.message || 'Failed to register'}`);
            }
        } catch (error) {
            setErrorMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="signup-farm-container">
            <h2>Register Farm</h2>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    onChange={handleInputChange}
                    className="form-input"
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    onChange={handleInputChange}
                    className="form-input"
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleInputChange}
                    className="form-input"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleInputChange}
                    className="form-input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleInputChange}
                    className="form-input"
                />
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    onChange={handleInputChange}
                    className="form-input"
                />
                <input
                    type="text"
                    name="farmName"
                    placeholder="Farm Name"
                    onChange={handleInputChange}
                    className="form-input"
                />
                <input
                    type="text"
                    name="activationCode"
                    placeholder="Activation Code"
                    onChange={handleInputChange}
                    className="form-input"
                />
                <button type="submit" className="submit-button">Submit</button>
            </form>
            {responseMessage && <p className="success-message">{responseMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default SignupFarm;
