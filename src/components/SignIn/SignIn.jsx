import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext.jsx';

const SignIn = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            return 'Username is required.';
        }
        if (!formData.password.trim()) {
            return 'Password is required.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await response.json();


            if (response.status === 403) {
                const message = data.message || '';
                if (message.includes('Gospodarstwo jest nieaktywne. Podaj nowy kod aktywacyjny.')) {
                    setErrorMessage(message);
                    setTimeout(() => {
                        navigate('/update-activation-code');
                    }, 2000);
                } else if (message.includes('Gospodarstwo jest nieaktywne. Kod aktywacyjny wygasł.')) {
                    setErrorMessage(message);
                    sessionStorage.clear();
                } else {
                    setErrorMessage(message || 'Access denied.');
                    sessionStorage.clear();
                }
            } else if (response.ok) {
                sessionStorage.setItem('username', data.username);
                sessionStorage.setItem('roles', JSON.stringify(data.roles));
                const expireCodeInfo = data.expireCodeInfo || null;
                sessionStorage.setItem('expireCodeInfo', expireCodeInfo);
                handleLogin(expireCodeInfo);
                navigate('/dashboard');
            } else {
            setErrorMessage(data.message || 'Invalid login credentials.');
            }
        } catch (error) {
        setErrorMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleInputChange}
                />
                <button type="submit">Submit</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default SignIn;
