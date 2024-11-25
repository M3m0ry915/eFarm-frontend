import { Link } from 'react-router-dom';
import './LandingPage.css'; // Zaimportowanie stylów

const LandingPage = () => {
    return (
        <div className="landing-page">
            <h1>Welcome to eFarm</h1>
            <Link to="/sign-in">Sign In</Link>
            <Link to="/signup-farm">Create a New Farm</Link>
        </div>
    );
};

export default LandingPage;
