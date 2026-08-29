import { NavLink, Link } from "react-router-dom";
import NavThemeToggle from "./NavThemeToggle";

function Navbar() {

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <h1 className="logo">ON <span>EMPRESAS</span></h1>

        <nav>
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/nosotros">Nosotros</NavLink>
          <NavLink to="/servicios">Servicios</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
        </nav>

        <NavThemeToggle />

        <Link to="/Login" className="btn-login">
          Iniciar sesión
        </Link>

      </div>
    </header>
  );
}

export default Navbar;