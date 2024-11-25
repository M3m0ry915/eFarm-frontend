import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../AuthContext.jsx';
import './EquipmentDetail.css'; // Dodanie pliku CSS dla stylów

const EquipmentDetail = () => {
    const { id } = useParams();
    const [equipmentData, setEquipmentData] = useState(null);
    const [userRole, setUserRole] = useState('');
    const { user, username, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const mockEquipmentData = [
        {
            equipmentId: 1,
            equipmentName: 'Traktor John Deere',
            category: 'Traktory',
            brand: 'John Deere',
            model: 'JD 5075E',
            power: 75,
            insurancePolicyNumber: 'PL123456',
            insuranceExpirationDate: '2025-12-31',
            inspectionExpireDate: '2024-12-31',
        },
        {
            equipmentId: 2,
            equipmentName: 'Kombajn New Holland',
            category: 'Kombajny',
            brand: 'New Holland',
            model: 'CX7.90',
            capacity: 9.0,
            insurancePolicyNumber: 'PL654321',
            insuranceExpirationDate: '2025-06-30',
            inspectionExpireDate: '2024-06-30',
        },
    ];

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

        // Oryginalny kod pobierający szczegóły sprzętu z backendu
        /*
        const fetchEquipmentDetail = async () => {
            try {
                const response = await fetch(`/api/equipment/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setEquipmentData(data);
                } else {
                    console.error('Failed to fetch equipment details');
                }
            } catch (error) {
                console.error('Error fetching equipment details:', error);
            }
        };

        fetchEquipmentDetail();
        */

        // Użycie mockowanych danych
        const fetchMockEquipmentDetail = () => {
            const equipment = mockEquipmentData.find((eq) => eq.equipmentId === parseInt(id));
            if (equipment) {
                setEquipmentData(equipment);
            } else {
                console.error('Equipment not found');
            }
        };

        fetchMockEquipmentDetail();
    }, [isAuthenticated, navigate, id, user]);

    if (!equipmentData) {
        return (
            <div>
                <Navbar userRole={userRole} username={username} />
                <div className="loading-container">
                    <p>Ładowanie szczegółów sprzętu...</p>
                </div>
            </div>
        );
    }

    const {
        equipmentName,
        category,
        brand,
        model,
        power,
        capacity,
        workingWidth,
        insurancePolicyNumber,
        insuranceExpirationDate,
        inspectionExpireDate,
    } = equipmentData;

    return (
        <div>
            <Navbar userRole={userRole} username={username} />
            <div className="detail-container">
                <h2>Szczegóły Sprzętu</h2>
                <div className="equipment-details">
                    <p>
                        <strong>Nazwa Sprzętu:</strong> {equipmentName}
                    </p>
                    <p>
                        <strong>Kategoria:</strong> {category}
                    </p>
                    <p>
                        <strong>Marka:</strong> {brand}
                    </p>
                    <p>
                        <strong>Model:</strong> {model}
                    </p>
                    {power !== undefined && (
                        <p>
                            <strong>Moc:</strong> {power}
                        </p>
                    )}
                    {capacity !== undefined && (
                        <p>
                            <strong>Pojemność:</strong> {capacity}
                        </p>
                    )}
                    {workingWidth !== undefined && (
                        <p>
                            <strong>Szerokość Robocza:</strong> {workingWidth}
                        </p>
                    )}
                    {insurancePolicyNumber && (
                        <p>
                            <strong>Numer Polisy Ubezpieczeniowej:</strong> {insurancePolicyNumber}
                        </p>
                    )}
                    {insuranceExpirationDate && (
                        <p>
                            <strong>Data Wygaśnięcia Ubezpieczenia:</strong> {insuranceExpirationDate}
                        </p>
                    )}
                    {inspectionExpireDate && (
                        <p>
                            <strong>Data Wygaśnięcia Przeglądu:</strong> {inspectionExpireDate}
                        </p>
                    )}
                </div>
                <button onClick={() => navigate('/equipment')} className="back-button">
                    Powrót do listy sprzętu
                </button>
            </div>
        </div>
    );
};

export default EquipmentDetail;
