import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../../AuthContext.jsx';

const UpdateActivationCode = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        newActivationCode: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { handleExpireCodeInfoUpdate } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            return 'Nazwa użytkownika jest wymagana.';
        }
        if (!formData.password.trim()) {
            return 'Hasło jest wymagane.';
        }
        if (!formData.newActivationCode.trim()) {
            return 'Nowy kod aktywacyjny jest wymagany.';
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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccessMessage('Kod aktywacyjny został zaktualizowany pomyślnie.');
                handleExpireCodeInfoUpdate(null);
                setTimeout(() => {
                    navigate('/sign-in');
                }, 2000);
            } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Nie udało się zaktualizować kodu aktywacyjnego.');
            }
        } catch (error) {
            setErrorMessage(`Błąd: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Update Activation Code</h2>
            {!successMessage ? (
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleInputChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                <input type="text" name="newActivationCode" placeholder="New Activation Code" onChange={handleInputChange} />
                <button type="submit">Submit</button>
            </form>
            ) : (
                <div>
                    <p style={{ color: 'green' }}>{successMessage}</p>
                    <button onClick={() => navigate('/sign-in')}>
                        Przejdź do logowania
                    </button>
                </div>
            )}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default UpdateActivationCode;
