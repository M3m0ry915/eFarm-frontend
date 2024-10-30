import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import SignupFarm from './components/SignupFarm/SignupFarm';
import SignIn from './components/SignIn/SignIn';
import Dashboard from './components/Dashboard/Dashboard';
import SignupUser from './components/SignupUser/SignupUser';
import UpdateActivationCode from './components/UpdateActivationCode/UpdateActivationCode';
import NotAuthorized from './components/NotAuthorized/NotAuthorized';
import FarmDetails from './components/FarmDetails/FarmDetails';
import ChangePassword from './components/ChangePassword/ChangePassword';
import NewActivationCode from './components/NewActivationCode/NewActivationCode';
import EquipmentList from './components/Equipment/EquipmentList';
import EquipmentDetail from './components/Equipment/EquipmentDetail';
//import AddLandparcel from './components/AddLandparcel/AddLandparcel';
import './App.css';
import "leaflet/dist/leaflet.css";
import { AuthProvider } from './AuthContext.jsx';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/signup-user" element={<SignupUser />} />
                        <Route path="/farm-details" element={<FarmDetails />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/new-activation-code" element={<NewActivationCode />} />
                        <Route path="/equipment" element={<EquipmentList />} />
                        <Route path="/equipment/:id" element={<EquipmentDetail />} />
                        <Route path="/signup-farm" element={<SignupFarm />} />
                        <Route path="/update-activation-code" element={<UpdateActivationCode />} />
                        <Route path="/not-authorized" element={<NotAuthorized />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;