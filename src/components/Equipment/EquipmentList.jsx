import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../AuthContext.jsx';
import EquipmentForm from './EquipmentForm.jsx';

const EquipmentList = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userRole, setUserRole] = useState('');
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const userRole = user.roles.includes('ROLE_FARM_OWNER')
            ? 'OWNER'
            : user.roles.includes('ROLE_FARM_MANAGER')
                ? 'MANAGER'
                : user.roles.includes('ROLE_FARM_EQUIPMENT_OPERATOR')
                    ? 'OPERATOR'
                    : 'OTHER_ROLE';
        setUserRole(userRole);
        fetchEquipmentList('');
    }, [navigate, user]);

    const fetchEquipmentList = async (query) => {
        try {
            const url = query.length >= 3 ? `/api/equipment/all?searchQuery=${encodeURIComponent(query)}` : '/api/equipment/all';
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setEquipmentList(data);
            } else {
                console.error('Failed to fetch equipment list');
            }
        } catch (error) {
            console.error('Error fetching equipment list:', error);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length >= 3 || query.length === 0) {
            fetchEquipmentList(query);
        }
    };

    const handleEquipmentClick = (equipmentId) => {
        navigate(`/equipment/${equipmentId}`);
    };
    const handleAddEquipment = () => {
        setShowAddForm(true);
    };

    const handleFormClose = () => {
        setShowAddForm(false);
        fetchEquipmentList('');
    };
    return (
        <div>
            <Navbar onLogout={handleLogout} userRole={userRole} username={user.username} />
            <div style={{ padding: '20px' }}>
                <h2>Lista Sprzętu</h2>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <input
                    type="text"
                    placeholder="Wyszukaj (minimum 3 znaki)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
                />
                {(userRole === 'OWNER' || userRole === 'MANAGER') && (
                    <button onClick={handleAddEquipment} style={{ padding: '8px 16px' }}>
                        Dodaj Sprzęt
                    </button>
                )}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Nazwa Sprzętu</th>
                        <th style={tableHeaderStyle}>Kategoria</th>
                        <th style={tableHeaderStyle}>Marka</th>
                        <th style={tableHeaderStyle}>Model</th>
                    </tr>
                    </thead>
                    <tbody>
                    {equipmentList.map((equipment) => (
                        <tr
                            key={equipment.equipmentId}
                            style={{cursor: 'pointer'}}
                            onClick={() => handleEquipmentClick(equipment.equipmentId)}
                        >
                            <td style={tableCellStyle} data-label="Nazwa Sprzętu">
                                {equipment.equipmentName}
                            </td>
                            <td style={tableCellStyle} data-label="Kategoria">
                                {equipment.category}
                            </td>
                            <td style={tableCellStyle} data-label="Marka">
                                {equipment.brand}
                            </td>
                            <td style={tableCellStyle} data-label="Model">
                                {equipment.model}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {showAddForm && (
                <EquipmentForm onClose={handleFormClose} />
            )}
        </div>
    );
};

const tableHeaderStyle = {
    borderBottom: '2px solid #ddd',
    padding: '8px',
    textAlign: 'left',
};

const tableCellStyle = {
    borderBottom: '1px solid #ddd',
    padding: '8px',
};


export default EquipmentList;
