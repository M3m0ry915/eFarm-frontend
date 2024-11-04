import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../AuthContext.jsx';
import EquipmentForm from './EquipmentForm.jsx';

const EquipmentDetail = () => {
    const { id } = useParams();
    const [equipmentData, setEquipmentData] = useState(null);
    const [userRole, setUserRole] = useState('');
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [showEditForm, setShowEditForm] = useState(false);



    useEffect(() => {
        const userRole = user.roles.includes('ROLE_FARM_OWNER')
            ? 'OWNER'
            : user.roles.includes('ROLE_FARM_MANAGER')
                ? 'MANAGER'
                : user.roles.includes('ROLE_FARM_EQUIPMENT_OPERATOR')
                    ? 'OPERATOR'
                    : 'OTHER_ROLE';
        setUserRole(userRole);


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
    }, [navigate, user, id]);

    const handleDelete = async () => {
        if (window.confirm('Czy na pewno chcesz usunąć ten sprzęt?')) {
            try {
                const response = await fetch(`/api/equipment/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    alert('Sprzęt został usunięty.');
                    navigate('/equipment');
                } else {
                    const errorData = await response.json();
                    console.error('Failed to delete equipment:', errorData.message);
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error deleting equipment:', error);
                alert(`Error: ${error.message}`);
            }
        }
    };

    const handleEdit = () => {
        setShowEditForm(true);
    };

    const handleFormClose = () => {
        setShowEditForm(false);
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
    };

    if (!equipmentData) {
        return (
            <div>
                <Navbar onLogout={handleLogout} userRole={userRole} username={user.username} />
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
            <Navbar onLogout={handleLogout} userRole={userRole} username={user.username} />
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
                {(userRole === 'OWNER' || userRole === 'MANAGER') && (
                    <>
                        <button onClick={handleEdit} style={{ marginLeft: '10px' }}>
                            Edytuj
                        </button>
                        <button onClick={handleDelete} style={{ marginLeft: '10px' }}>
                            Usuń
                        </button>
                    </>
                )}
            </div>
            {showEditForm && (
                <EquipmentForm onClose={handleFormClose} equipmentData={equipmentData} />
            )}
        </div>
    );
};

export default EquipmentDetail;
