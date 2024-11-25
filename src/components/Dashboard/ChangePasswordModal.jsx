import { useState } from 'react';
import PropTypes from 'prop-types';
import './ChangePasswordModal.css'; // Zaimportuj plik z CSS

const ChangePasswordModal = ({ user, onClose }) => {
    const [newPassword, setNewPassword] = useState('');

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Oryginalny kod wysyłający żądanie do backendu
        /*
        fetch(`/api/users/update-password/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ newPassword }),
        })
            .then(response => {
                if (response.ok) {
                    alert('Hasło zostało zmienione.');
                    onClose();
                } else {
                    console.error('Failed to change password');
                }
            })
            .catch(error => console.error('Error changing password:', error));
        */

        // Mockowanie akcji
        console.log(`Changing password for user ${user.username} to ${newPassword}`);
        alert('Hasło zostało zmienione (mock).');
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Zmień Hasło dla {user.username}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nowe Hasło:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="form-submit-button">Zmień Hasło</button>
                        <button type="button" onClick={onClose} className="form-cancel-button">
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ChangePasswordModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
