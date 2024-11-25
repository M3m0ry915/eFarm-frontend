import { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import AddLandparcel from './AddLandparcel';
import EditLandparcel from './EditLandparcel';
import './LandParcelList.css'; // Zaimportowanie pliku z CSS

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
        <div className="user-list-container">
            <h3>Lista Działek</h3>
            <button onClick={handleAddParcel} className="action-button">
                Dodaj Działkę
            </button>
            <form onSubmit={handleFilterSubmit} className="filter-form">
                <input
                    type="text"
                    placeholder="Wyszukaj (minimum 3 znaki)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <label>Min. Powierzchnia [ha]:</label>
                <input
                    type="number"
                    value={minArea}
                    onChange={handleMinAreaChange}
                    className="filter-input"
                />
                <label>Max. Powierzchnia [ha]:</label>
                <input
                    type="number"
                    value={maxArea}
                    onChange={handleMaxAreaChange}
                    className="filter-input"
                />
                <button type="submit" className="action-button">Filtruj</button>
            </form>
            <table className="user-list-table">
                <thead>
                <tr>
                    <th className="table-header">Gmina</th>
                    <th className="table-header">Numer Działki</th>
                    <th className="table-header">Powierzchnia [ha]</th>
                    <th className="table-header">Status Własności</th>
                    <th className="table-header">Akcje</th>
                </tr>
                </thead>
                <tbody>
                {parcels.map((parcel) => (
                    <tr key={parcel.id} className="table-row">
                        <td className="table-cell">{parcel.commune}</td>
                        <td className="table-cell">{parcel.landparcelNumber}</td>
                        <td className="table-cell">{parcel.area}</td>
                        <td className="table-cell">{parcel.landOwnershipStatus}</td>
                        <td className="table-cell">
                            <button onClick={() => handleEditParcel(parcel)} className="action-button">Edytuj</button>
                            <button onClick={() => handleDeleteParcel(parcel)} className="action-button">Usuń</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showAddForm && <AddLandparcel onClose={closeAddForm} />}
            {editParcelData && <EditLandparcel onClose={closeEditForm} parcelData={editParcelData} />}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>Czy na pewno chcesz usunąć tę działkę?</p>
                        <button onClick={confirmDeleteParcel} className="modal-confirm-button">Tak</button>
                        <button onClick={() => setShowDeleteConfirm(false)} className="modal-cancel-button">Nie</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandParcelList;
