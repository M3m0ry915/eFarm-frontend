import { Link } from 'react-router-dom';
import './NotAuthorized.css'; // Importujemy plik CSS

const NotAuthorized = () => {
    return (
        <div className="not-authorized-container">
            <h2>Nie masz uprawnień do tej strony.</h2>
            <Link to="/dashboard">
                <button>Powrót do Dashboard</button>
            </Link>
        </div>
    );
};

export default NotAuthorized;
