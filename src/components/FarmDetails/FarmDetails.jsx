import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../AuthContext.jsx';
import './FarmDetails.css'; // Importujemy plik CSS

const FarmDetails = () => {
    const [farmData, setFarmData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        farmName: '',
        farmNumber: '',
        feedNumber: '',
        sanitaryRegisterNumber: '',
        street: '',
        buildingNumber: '',
        zipCode: '',
        city: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userRole, setUserRole] = useState('');
    const { user, userRoles, username, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/sign-in');
            return;
        }

        const role = user.roles.includes('ROLE_FARM_OWNER')
            ? 'OWNER'
            : user.roles.includes('ROLE_FARM_MANAGER')
                ? 'MANAGER'
                : user.roles.includes('ROLE_FARM_EQUIPMENT_OPERATOR')
                    ? 'OPERATOR'
                    : 'OTHER_ROLE';
        setUserRole(role);

        // Oryginalny kod pobierający dane gospodarstwa z backendu
        /*
        fetchFarmDetails();
        */

        // Użycie mockowanych danych
        fetchMockFarmDetails();
    }, [navigate, isAuthenticated, userRoles, user]);

    // Oryginalna funkcja pobierająca dane z backendu
    /*
    const fetchFarmDetails = async () => {
        try {
            const response = await fetch('/api/farm/details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setFarmData(data);
                setFormData({
                    farmName: data.farmName || '',
                    farmNumber: data.farmNumber || '',
                    feedNumber: data.feedNumber || '',
                    sanitaryRegisterNumber: data.sanitaryRegisterNumber || '',
                    street: data.street || '',
                    buildingNumber: data.buildingNumber || '',
                    zipCode: data.zipCode || '',
                    city: data.city || ''
                });
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to fetch farm details.');
            }
        } catch (error) {
            setErrorMessage(`Error: ${error.message}`);
        }
    };
    */

    // Funkcja pobierająca mockowane dane
    const fetchMockFarmDetails = () => {
        // Mockowane dane gospodarstwa
        const mockFarmData = {
            farmName: 'Gospodarstwo Rolne Kowalski',
            farmNumber: 'FARM12345',
            feedNumber: 'FEED67890',
            sanitaryRegisterNumber: 'SANITARY54321',
            street: 'Wiejska',
            buildingNumber: '12A',
            zipCode: '00-001',
            city: 'Warszawa',
            activationCodeExpireDate: '2024-12-31', // Jeśli potrzebne
        };

        setFarmData(mockFarmData);
        setFormData({
            farmName: mockFarmData.farmName || '',
            farmNumber: mockFarmData.farmNumber || '',
            feedNumber: mockFarmData.feedNumber || '',
            sanitaryRegisterNumber: mockFarmData.sanitaryRegisterNumber || '',
            street: mockFarmData.street || '',
            buildingNumber: mockFarmData.buildingNumber || '',
            zipCode: mockFarmData.zipCode || '',
            city: mockFarmData.city || ''
        });
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCancelEdit = () => {
        setFormData({
            farmName: farmData.farmName || '',
            farmNumber: farmData.farmNumber || '',
            feedNumber: farmData.feedNumber || '',
            sanitaryRegisterNumber: farmData.sanitaryRegisterNumber || '',
            street: farmData.street || '',
            buildingNumber: farmData.buildingNumber || '',
            zipCode: farmData.zipCode || '',
            city: farmData.city || ''
        });
        setEditMode(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Oryginalny kod wysyłający dane do backendu
        /*
        try {
            const response = await fetch('/api/farm/details', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccessMessage('Farm details updated successfully.');
                setFarmData({
                    ...farmData,
                    ...formData,
                });
                setEditMode(false);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to update farm details.');
            }
        } catch (error) {
            setErrorMessage(`Error: ${error.message}`);
        }
        */

        // Mockowanie akcji zapisu danych
        // Symulujemy udane zapisanie danych i aktualizujemy stan
        setSuccessMessage('Dane gospodarstwa zostały zaktualizowane.');
        setFarmData({
            ...farmData,
            ...formData,
        });
        setEditMode(false);
    };

    return (
        <div className="farm-details-container">
            <Navbar userRole={userRole} username={username} />
            <h2>Szczegóły Gospodarstwa</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {farmData ? (
                editMode ? (
                    // Formularz w trybie edycji
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Nazwa Gospodarstwa:</label>
                            <input
                                type="text"
                                name="farmName"
                                value={formData.farmName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Numer Gospodarstwa:</label>
                            <input
                                type="text"
                                name="farmNumber"
                                value={formData.farmNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Numer Paszowy:</label>
                            <input
                                type="text"
                                name="feedNumber"
                                value={formData.feedNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Numer Rejestru Sanitarnego:</label>
                            <input
                                type="text"
                                name="sanitaryRegisterNumber"
                                value={formData.sanitaryRegisterNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Ulica:</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Numer Budynku:</label>
                            <input
                                type="text"
                                name="buildingNumber"
                                value={formData.buildingNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Kod Pocztowy:</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Miasto:</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-buttons">
                            <button type="submit">Zapisz Zmiany</button>
                            <button type="button" onClick={handleCancelEdit}>
                                Anuluj
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="farm-details">
                        <p><strong>Nazwa Gospodarstwa:</strong> {farmData.farmName}</p>
                        <p><strong>Numer Gospodarstwa:</strong> {farmData.farmNumber}</p>
                        <p><strong>Numer Paszowy:</strong> {farmData.feedNumber}</p>
                        <p><strong>Numer Rejestru Sanitarnego:</strong> {farmData.sanitaryRegisterNumber}</p>
                        <p><strong>Ulica:</strong> {farmData.street}</p>
                        <p><strong>Numer Budynku:</strong> {farmData.buildingNumber}</p>
                        <p><strong>Kod Pocztowy:</strong> {farmData.zipCode}</p>
                        <p><strong>Miasto:</strong> {farmData.city}</p>
                        {userRole === 'OWNER' && farmData.activationCodeExpireDate && (
                            <p><strong>Kod Aktywacyjny Wygasa:</strong> {farmData.activationCodeExpireDate}</p>
                        )}
                        {(userRole === 'OWNER' || userRole === 'MANAGER') && (
                            <button className="edit-button" onClick={toggleEditMode}>Edytuj Dane Gospodarstwa</button>
                        )}
                    </div>
                )
            ) : (
                <div className="loading-container">Ładowanie danych gospodarstwa...</div>
            )}
        </div>
    );
};

export default FarmDetails;
