import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../AuthContext.jsx';
import UserList from './UserList';

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
        <div>
            <Navbar userRole={userRole} username={user.username} onLogout={handleLogout}/>
            <div style={{padding: '20px'}}>
                <h2>Witaj w panelu zarządzania, {user.username}!</h2>
                {showExpireCodeInfo && expireCodeInfo && (
                    <div className="notification"
                         style={{border: '1px solid orange', padding: '10px', marginTop: '20px'}}>
                        <p>{expireCodeInfo}</p>
                        <button onClick={handleOk}>OK</button>
                        <button onClick={handleUpdate}>Aktualizuj</button>
                    </div>
                )}
            </div>
            <div style={dashboardStyle}>
                {/* Segment 1: Lista użytkowników */}
                <div style={segmentStyle}>
                    <UserList/>
                </div>
                {/* Segmenty 2-4: Możesz dodać je później */}
                {/* <div style={segmentStyle}>Segment 2</div>
                <div style={segmentStyle}>Segment 3</div>
                <div style={segmentStyle}>Segment 4</div> */}
            </div>
        </div>
    );
};

const dashboardStyle = {
    display: 'flex',
    flexWrap: 'wrap',
};

const segmentStyle = {
    flex: '1 1 50%', // Dwa segmenty w rzędzie
    boxSizing: 'border-box',
    padding: '10px',
};
export default Dashboard;
