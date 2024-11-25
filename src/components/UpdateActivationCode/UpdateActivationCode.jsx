import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateActivationCode.css'; // Importujemy plik CSS

const UpdateActivationCode = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        newActivationCode: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
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
        <div className="update-activation-container">
            <h2>Aktualizacja kodu aktywacyjnego</h2>
            {!successMessage ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Nazwa użytkownika"
                        onChange={handleInputChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Hasło"
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="newActivationCode"
                        placeholder="Nowy kod aktywacyjny"
                        onChange={handleInputChange}
                    />
                    <button type="submit">Zaktualizuj kod</button>
                </form>
            ) : (
                <div>
                    <p className="success-message">{successMessage}</p>
                    <button
                        className="sign-in-button"
                        onClick={() => navigate('/sign-in')}>
                        Przejdź do logowania
                    </button>
                </div>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default UpdateActivationCode;
