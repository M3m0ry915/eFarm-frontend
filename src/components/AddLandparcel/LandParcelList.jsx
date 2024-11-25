import { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import AddLandparcel from './AddLandparcel';
import EditLandparcel from './EditLandparcel';

const LandParcelList = () => {
    const [parcels, setParcels] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [minArea, setMinArea] = useState(0);
    const [maxArea, setMaxArea] = useState(1000);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editParcelData, setEditParcelData] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [parcelToDelete, setParcelToDelete] = useState(null);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/sign-in');
            return;
        }

        const userRole = user.roles.includes('ROLE_FARM_OWNER') || user.roles.includes('ROLE_FARM_MANAGER');
        if (!userRole) {
            navigate('/unauthorized');
            return;
        }

        fetchParcels();
    }, [isAuthenticated, user, navigate]);

    const fetchParcels = async () => {
        try {
            const params = new URLSearchParams();
            if (searchQuery.length >= 3) {
                params.append('searchString', searchQuery);
            }
            params.append('minArea', minArea);
            params.append('maxArea', maxArea);

            // Oryginalny kod pobierający listę działek z backendu
            /*
            const response = await fetch(`/api/landparcel/all?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setParcels(data);
            } else {
                console.error('Failed to fetch parcels');
            }
            */

            // Mockowane dane działek
            const mockParcels = [
                {
                    id: 1,
                    commune: 'Gmina A',
                    landparcelNumber: '123/45',
                    area: 10.5,
                    landOwnershipStatus: 'STATUS_PRIVATELY_OWNED',
                    longitude: 20.12345,
                    latitude: 52.12345,
                },
                {
                    id: 2,
                    commune: 'Gmina B',
                    landparcelNumber: '678/90',
                    area: 15.2,
                    landOwnershipStatus: 'STATUS_LEASED',
                    longitude: 20.12345,
                    latitude: 52.12345,
                },
                // Dodaj więcej mockowanych działek
            ];

            // Filtruj mockowane dane na podstawie parametrów
            const filteredParcels = mockParcels.filter((parcel) => {
                const matchesSearch = searchQuery.length < 3 || parcel.landparcelNumber.includes(searchQuery);
                const matchesArea = parcel.area >= minArea && parcel.area <= maxArea;
                return matchesSearch && matchesArea;
            });

            setParcels(filteredParcels);
        } catch (error) {
            console.error('Error fetching parcels:', error);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length >= 3 || query.length === 0) {
            fetchParcels();
        }
    };

    const handleMinAreaChange = (e) => {
        setMinArea(Number(e.target.value));
    };

    const handleMaxAreaChange = (e) => {
        setMaxArea(Number(e.target.value));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchParcels();
    };

    const handleAddParcel = () => {
        setShowAddForm(true);
    };

    const handleEditParcel = (parcel) => {
        setEditParcelData(parcel);
    };

    const handleDeleteParcel = (parcel) => {
        setParcelToDelete(parcel);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteParcel = async () => {
        // Oryginalny kod wysyłający żądanie usunięcia do backendu
        /*
        try {
            const response = await fetch(`/api/landparcel/${parcelToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                fetchParcels();
                setShowDeleteConfirm(false);
                setParcelToDelete(null);
            } else {
                console.error('Failed to delete parcel');
            }
        } catch (error) {
            console.error('Error deleting parcel:', error);
        }
        */

        // Mockowanie akcji usunięcia
        setParcels(prevParcels => prevParcels.filter(parcel => parcel.id !== parcelToDelete.id));
        setShowDeleteConfirm(false);
        setParcelToDelete(null);
    };

    const closeAddForm = () => {
        setShowAddForm(false);
        fetchParcels();
    };

    const closeEditForm = () => {
        setEditParcelData(null);
        fetchParcels();
    };

    return (
        <div>
            <h3>Lista Działek</h3>
            <button onClick={handleAddParcel} style={{ marginBottom: '10px' }}>
                Dodaj Działkę
            </button>
            <form onSubmit={handleFilterSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Wyszukaj (minimum 3 znaki)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ width: '30%', padding: '8px', marginRight: '10px' }}
                />
                <label>Min. Powierzchnia [ha]:</label>
                <input
                    type="number"
                    value={minArea}
                    onChange={handleMinAreaChange}
                    style={{ width: '10%', padding: '8px', margin: '0 10px' }}
                />
                <label>Max. Powierzchnia [ha]:</label>
                <input
                    type="number"
                    value={maxArea}
                    onChange={handleMaxAreaChange}
                    style={{ width: '10%', padding: '8px', margin: '0 10px' }}
                />
                <button type="submit">Filtruj</button>
            </form>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={tableHeaderStyle}>Gmina</th>
                    <th style={tableHeaderStyle}>Numer Działki</th>
                    <th style={tableHeaderStyle}>Powierzchnia [ha]</th>
                    <th style={tableHeaderStyle}>Status Własności</th>
                    <th style={tableHeaderStyle}>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {parcels.map((parcel) => (
                    <tr key={parcel.id}>
                        <td style={tableCellStyle}>{parcel.commune}</td>
                        <td style={tableCellStyle}>{parcel.landparcelNumber}</td>
                        <td style={tableCellStyle}>{parcel.area}</td>
                        <td style={tableCellStyle}>{parcel.landOwnershipStatus}</td>
                        <td style={tableCellStyle}>
                            <button onClick={() => handleEditParcel(parcel)}>Edytuj</button>
                            <button onClick={() => handleDeleteParcel(parcel)}>Usuń</button>
                            {/* Przyciski do dodatkowych akcji */}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showAddForm && (
                <AddLandparcel onClose={closeAddForm} />
            )}

            {editParcelData && (
                <EditLandparcel onClose={closeEditForm} parcelData={editParcelData} />
            )}

            {showDeleteConfirm && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <p>Czy na pewno chcesz usunąć tę działkę?</p>
                        <button onClick={confirmDeleteParcel}>Tak</button>
                        <button onClick={() => setShowDeleteConfirm(false)}>Nie</button>
                    </div>
                </div>
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
    textAlign: 'center',
};

export default LandParcelList;
