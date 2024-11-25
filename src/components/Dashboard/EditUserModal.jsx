import { useState } from 'react';
import PropTypes from 'prop-types';

const EditUserModal = ({ user, onClose }) => {
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phone || '',
        role: user.role || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Oryginalny kod wysyłający żądanie do backendu
        /*
        fetch(`/api/users/update/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (response.ok) {
                    alert('Dane użytkownika zostały zaktualizowane.');
                    onClose();
                } else {
                    console.error('Failed to update user data');
                }
            })
            .catch(error => console.error('Error updating user data:', error));
        */

        // Mockowanie akcji
        console.log(`Updating user ${user.username} with data:`, formData);
        alert('Dane użytkownika zostały zaktualizowane (mock).');
        onClose();
    };

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <h3>Edytuj Użytkownika {user.username}</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Imię:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Nazwisko:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Numer Telefonu:</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Rola:</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Wybierz rolę</option>
                            <option value="ROLE_FARM_OWNER">Właściciel Gospodarstwa</option>
                            <option value="ROLE_FARM_MANAGER">Manager Gospodarstwa</option>
                            <option value="ROLE_FARM_EQUIPMENT_OPERATOR">Operator Sprzętu</option>
                        </select>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <button type="submit">Zapisz Zmiany</button>
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
    width: '500px',
    maxHeight: '80%',
    overflowY: 'auto',
};

EditUserModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default EditUserModal;
