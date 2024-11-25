import { useState } from 'react';
import PropTypes from 'prop-types';
import './EditUserModal.css'; // Zaimportuj plik z CSS

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
        <div className="modal">
            <div className="modal-content">
                <h3>Edytuj Użytkownika {user.username}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Imię:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nazwisko:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Numer Telefonu:</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Rola:</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="form-select"
                            required
                        >
                            <option value="">Wybierz rolę</option>
                            <option value="ROLE_FARM_OWNER">Właściciel Gospodarstwa</option>
                            <option value="ROLE_FARM_MANAGER">Manager Gospodarstwa</option>
                            <option value="ROLE_FARM_EQUIPMENT_OPERATOR">Operator Sprzętu</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit" className="form-submit-button">Zapisz Zmiany</button>
                        <button type="button" onClick={onClose} className="form-cancel-button">Anuluj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditUserModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default EditUserModal;
