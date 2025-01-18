import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import OnsTeam from './pages/OnsTeam';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AppointmentPage from "./pages/AppointmentPage";
import PrivateRoute from './components/PrivateRoute';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/staff" element={<OnsTeam />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/createappointment" element={<PrivateRoute><AppointmentPage /></PrivateRoute>} />
        <Route path="/myappointments" element={<PrivateRoute><MyAppointmentsPage /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
