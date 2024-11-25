import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../AuthContext.jsx';
import UserList from './UserList';
import './Dashboard.css'; // Dodanie pliku CSS dla stylów

const Dashboard = () => {
    const { user, expireCodeInfo, handleLogout, handleExpireCodeInfoUpdate } = useAuth();
    const [showExpireCodeInfo, setShowExpireCodeInfo] = useState(!!expireCodeInfo);
    const [userRole, setUserRole] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        //const username = sessionStorage.getItem('username');
        // if (!user.username || !user.roles) {
        //     navigate('/sign-in');
        // }
        const userRole = user.roles.includes('ROLE_FARM_OWNER')
            ? 'OWNER'
            : user.roles.includes('ROLE_FARM_MANAGER')
                ? 'MANAGER'
                : user.roles.includes('ROLE_FARM_EQUIPMENT_OPERATOR')
                    ? 'OPERATOR'
                    : 'OTHER_ROLE';
        setUserRole(userRole);
    }, [navigate, user]);

    const handleOk = () => {
        setShowExpireCodeInfo(false);
        handleExpireCodeInfoUpdate(null);
    };

    const handleUpdate = () => {
        navigate('/new-activation-code');
    };

    return (
        <div className="dashboard-container">
            <Navbar userRole={userRole} username={user.username} onLogout={handleLogout} />
            <div className="dashboard-content">
                <h2>Witaj w panelu zarządzania, {user.username}!</h2>

                {showExpireCodeInfo && expireCodeInfo && (
                    <div className="notification">
                        <p>{expireCodeInfo}</p>
                        <div className="notification-buttons">
                            <button onClick={handleOk} className="button-ok">OK</button>
                            <button onClick={handleUpdate} className="button-update">Aktualizuj</button>
                        </div>
                    </div>
                )}

                <div className="dashboard-segments">
                    <div className="segment">
                        <UserList />
                    </div>
                    {/* Segmenty 2-4: Można dodać później */}
                    {/* <div className="segment">Segment 2</div>
                    <div className="segment">Segment 3</div>
                    <div className="segment">Segment 4</div> */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
