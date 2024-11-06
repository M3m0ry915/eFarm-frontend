import { Link } from 'react-router-dom';

const NotAuthorized = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Nie masz uprawnień do tej strony.</h2>
            <Link to="/dashboard">
                <button>Powrót do Dashboard</button>
            </Link>
        </div>
    );
};

export default NotAuthorized;
