import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../AuthContext.jsx';
import EquipmentForm from './EquipmentForm';
import './EquipmentList.css';  // Dodanie pliku CSS

const EquipmentList = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userRole, setUserRole] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editEquipmentData, setEditEquipmentData] = useState(null);
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
        },
        {
            equipmentId: 2,
            equipmentName: 'Kombajn New Holland',
            category: 'Kombajny',
            brand: 'New Holland',
            model: 'CX7.90',
            capacity: 9.0,
        },
        {
            equipmentId: 3,
            equipmentName: 'Pług Lemken',
            category: 'Pługi',
            brand: 'Lemken',
            model: 'Juwel 8',
            workingWidth: 3.5,
        },
        // Dodaj więcej mockowanych danych
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

        // Oryginalny kod pobierający listę sprzętu z backendu
        /*
        fetchEquipmentList('');
        */

        // Użycie mockowanych danych
        fetchMockEquipmentList('');
    }, [navigate, isAuthenticated, user]);

    const fetchMockEquipmentList = (query) => {
        const filteredData = mockEquipmentData.filter((equipment) =>
            equipment.equipmentName.toLowerCase().includes(query.toLowerCase())
        );
        setEquipmentList(filteredData);
    };
    /*
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
    */
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length >= 3 || query.length === 0) {
            // Oryginalny kod
            // fetchEquipmentList(query);

            // Użycie mockowanych danych
            fetchMockEquipmentList(query);
        }
    };

    const handleEquipmentClick = (equipmentId) => {
        navigate(`/equipment/${equipmentId}`);
    };

    const handleAddEquipment = () => {
        setEditEquipmentData(null);
        setShowForm(true);
    };

    const handleEditEquipment = (equipment) => {
        setEditEquipmentData(equipment);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        // Po zamknięciu formularza, odśwież listę sprzętu
        // fetchEquipmentList(searchQuery);
        fetchMockEquipmentList(searchQuery);
    };

    return (
        <div>
            <Navbar userRole={userRole} username={username} />
            <div className="equipment-list-container">
                <h2>Lista Sprzętu</h2>
                <button onClick={handleAddEquipment} className="navbar-button add-equipment-button">
                    Dodaj Sprzęt
                </button>
                <input
                    type="text"
                    placeholder="Wyszukaj (minimum 3 znaki)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <table className="equipment-table">
                    <thead>
                    <tr>
                        <th className="table-header">Nazwa Sprzętu</th>
                        <th className="table-header">Kategoria</th>
                        <th className="table-header">Marka</th>
                        <th className="table-header">Model</th>
                        <th className="table-header">Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {equipmentList.map((equipment) => (
                        <tr key={equipment.equipmentId}>
                            <td
                                className="table-cell"
                                onClick={() => handleEquipmentClick(equipment.equipmentId)}
                            >
                                {equipment.equipmentName}
                            </td>
                            <td className="table-cell">{equipment.category}</td>
                            <td className="table-cell">{equipment.brand}</td>
                            <td className="table-cell">{equipment.model}</td>
                            <td className="table-cell">
                                <button onClick={() => handleEditEquipment(equipment)} className="navbar-button edit-button">
                                    Edytuj
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {showForm && (
                    <EquipmentForm onClose={closeForm} equipmentData={editEquipmentData} />
                )}
            </div>
        </div>
    );
};

export default EquipmentList;
