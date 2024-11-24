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
import LandingPage from './components/LandingPage/LandingPage';
//import AddLandparcel from './components/AddLandparcel/AddLandparcel';
import './App.css';
import "leaflet/dist/leaflet.css";
import { AuthProvider } from './AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/signup-farm" element={<SignupFarm />} />
                        <Route element={<ProtectedRoute />} >
                            <Route path='dashboard' element={<Dashboard />} />
                            <Route path="/update-activation-code" element={<UpdateActivationCode />} />
                            <Route path="/change-password" element={<ChangePassword />} />
                        </Route>
                        <Route element={<ProtectedRoute requiredRoles={['ROLE_FARM_OWNER', 'ROLE_FARM_MANAGER']} />}>
                            <Route path="/signup-user" element={<SignupUser />} />
                            <Route path="/farm-details" element={<FarmDetails />} />
                            <Route path="/new-activation-code" element={<NewActivationCode />} />
                            <Route path="/equipment" element={<EquipmentList />} />
                            <Route path="/equipment/:id" element={<EquipmentDetail />} />
                        </Route>
                        <Route path="/not-authorized" element={<NotAuthorized />} />

                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
