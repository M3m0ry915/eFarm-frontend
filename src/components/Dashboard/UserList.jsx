import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext.jsx';
import ChangePasswordModal from './ChangePasswordModal';
import EditUserModal from './EditUserModal';
import './UserList.css'; // Dodanie pliku CSS dla stylów

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [userRole, setUserRole] = useState('');
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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

        // Oryginalny kod pobierający listę użytkowników z backendu
        /*
        fetch('/api/users/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
        */

        // Mockowane dane użytkowników
        const mockUsers = [
            {
                id: 1,
                username: 'jan_kowalski',
                role: 'ROLE_FARM_MANAGER',
                email: 'jan.kowalski@example.com',
                firstName: 'Jan',
                lastName: 'Kowalski',
                phone: '+48123456789',
                active: true,
            },
            {
                id: 2,
                username: 'anna_nowak',
                role: 'ROLE_FARM_EQUIPMENT_OPERATOR',
                email: 'anna.nowak@example.com',
                firstName: 'Anna',
                lastName: 'Nowak',
                phone: '+48987654321',
                active: false,
            },
        ];
        setUsers(mockUsers);
    }, [navigate, isAuthenticated, userRole, user]);

    const toggleActiveStatus = (userId) => {
        // Oryginalny kod wysyłający żądanie do backendu
        /*
        fetch(`/api/users/toggle-active/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(response => {
                if (response.ok) {
                    // Aktualizuj stan użytkowników po zmianie statusu
                    setUsers(prevUsers =>
                        prevUsers.map(user =>
                            user.id === userId ? { ...user, active: !user.active } : user
                        )
                    );
                } else {
                    console.error('Failed to toggle user active status');
                }
            })
            .catch(error => console.error('Error toggling user active status:', error));
        */

        // Mockowanie akcji
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, active: !user.active } : user
            )
        );
    };

    const handleChangePassword = (user) => {
        setSelectedUser(user);
        setShowChangePasswordModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditUserModal(true);
    };

    const closeModals = () => {
        setShowChangePasswordModal(false);
        setShowEditUserModal(false);
        setSelectedUser(null);
    };

    return (
        <div className="user-list-container">
            <h3>Lista Użytkowników</h3>
            <table className="user-list-table">
                <thead>
                <tr>
                    <th className="table-header">Imię</th>
                    <th className="table-header">Nazwisko</th>
                    <th className="table-header">Rola</th>
                    <th className="table-header">Aktywny</th>
                    <th className="table-header">Akcje</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="table-row">
                        <td className="table-cell">{user.firstName}</td>
                        <td className="table-cell">{user.lastName}</td>
                        <td className="table-cell">{user.role}</td>
                        <td className="table-cell">{user.active ? 'Tak' : 'Nie'}</td>
                        <td className="table-cell">
                            <button className="action-button" onClick={() => toggleActiveStatus(user.id)}>
                                {user.active ? 'Dezaktywuj' : 'Aktywuj'}
                            </button>
                            <button className="action-button" onClick={() => handleChangePassword(user)}>
                                Zmień Hasło
                            </button>
                            <button className="action-button" onClick={() => handleEditUser(user)}>
                                Edytuj
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modale do zmiany hasła i edycji użytkownika */}
            {showChangePasswordModal && (
                <ChangePasswordModal user={selectedUser} onClose={closeModals} />
            )}
            {showEditUserModal && (
                <EditUserModal user={selectedUser} onClose={closeModals} />
            )}
        </div>
    );
};

export default UserList;
