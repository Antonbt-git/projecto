import { Routes, Route } from 'react-router-dom';
import MainLayouts from '../layouts/MainLayouts';

import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import Contact from '../pages/contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashborad from '../components/Dashboard';
import DashboradLogin from '../pages/DashboardLogin';
import Verify from '../pages/Verify';


function AppRoutes() {
    return (
        <Routes>
            {/* 1. RUTAS CON DISEÑO (Tienen el Navbar y el Footer) */}
            <Route element={<MainLayouts />}>
                <Route path='/' element={<Home />} />
                <Route path='nosotros' element={<About />} />
                <Route path='servicios' element={<Services />} />
                <Route path='contacto' element={<Contact />} />
            </Route>

            {/* 2. RUTAS INDEPENDIENTES (Pantalla completa, sin Navbar ni Footer) */}
            <Route path='register' element={<Register />} />
            <Route path='verify' element={<Verify />} />
            <Route path='login' element={<Login />} />
            <Route path='dashboardlogin' element={<DashboradLogin />} />
            <Route path='dashboard' element={<Dashborad />} />
        </Routes>
    );
}
export default AppRoutes;