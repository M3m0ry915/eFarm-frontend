import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div>
            <h1>Welcome to eFarm</h1>
            <Link to="/sign-in">Sign In</Link>
            <br />
            <Link to="/signup-farm">Create a New Farm</Link>
        </div>
    );
};

export default LandingPage;
