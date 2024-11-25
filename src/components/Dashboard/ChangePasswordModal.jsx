import { useState } from 'react';
import PropTypes from 'prop-types';

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
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <h3>Zmień Hasło dla {user.username}</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nowe Hasło:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <button type="submit">Zmień Hasło</button>
                        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    width: '400px',
};

ChangePasswordModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
