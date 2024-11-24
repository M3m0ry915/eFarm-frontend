import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../AuthContext.jsx';

const EquipmentDetail = () => {
    const { id } = useParams();
    const [equipmentData, setEquipmentData] = useState(null);
    const [userRole, setUserRole] = useState('');
    const { userRoles, username, isAuthenticated } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/sign-in');
            return;
        }

        // Set userRole based on userRoles
        if (userRoles.includes('ROLE_FARM_OWNER')) {
            setUserRole('OWNER');
        } else if (userRoles.includes('ROLE_FARM_MANAGER')) {
            setUserRole('MANAGER');
        } else if (userRoles.includes('ROLE_FARM_EQUIPMENT_OPERATOR')) {
            setUserRole('OPERATOR');
        } else {
            setUserRole('OTHER_ROLE');
        }

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
    }, [isAuthenticated, userRoles, navigate, id]);



    if (!equipmentData) {
        return (
            <div>
                <Navbar userRole={userRole} username={username} />
                <div style={{ padding: '20px' }}>
                    <p>Loading equipment details...</p>
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
            <div style={{ padding: '20px' }}>
                <h2>Szczegóły Sprzętu</h2>
                <div>
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
                    {power !== null && (
                        <p>
                            <strong>Moc:</strong> {power}
                        </p>
                    )}
                    {capacity !== null && (
                        <p>
                            <strong>Pojemność:</strong> {capacity}
                        </p>
                    )}
                    {workingWidth !== null && (
                        <p>
                            <strong>Szerokość Robocza:</strong> {workingWidth}
                        </p>
                    )}
                    {insurancePolicyNumber !== null && (
                        <p>
                            <strong>Numer Polisy Ubezpieczeniowej:</strong> {insurancePolicyNumber}
                        </p>
                    )}
                    {insuranceExpirationDate !== null && (
                        <p>
                            <strong>Data Wygaśnięcia Ubezpieczenia:</strong> {insuranceExpirationDate}
                        </p>
                    )}
                    {inspectionExpireDate !== null && (
                        <p>
                            <strong>Data Wygaśnięcia Przeglądu:</strong> {inspectionExpireDate}
                        </p>
                    )}
                </div>
                <button onClick={() => navigate('/equipment')}>Powrót do listy sprzętu</button>
            </div>
        </div>
    );
};

export default EquipmentDetail;
