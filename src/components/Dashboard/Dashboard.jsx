import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../AuthContext.jsx';

const Dashboard = () => {
    const { user, expireCodeInfo, handleLogout } = useAuth();
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
    };

    const handleUpdate = () => {
        navigate('/new-activation-code');
    };
    return (
        <div>
            <Navbar userRole={userRole} username={user.username} onLogout={handleLogout} />
            <div style={{ padding: '20px' }}>
                <h2>Witaj w panelu zarządzania, {user.username}!</h2>
                {showExpireCodeInfo && expireCodeInfo &&(
                    <div className="notification" style={{ border: '1px solid orange', padding: '10px', marginTop: '20px' }}>
                        <p>{expireCodeInfo}</p>
                        <button onClick={handleOk}>OK</button>
                        <button onClick={handleUpdate}>Aktualizuj</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
