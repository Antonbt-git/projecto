import { useTheme } from '../context/ThemeContext';
import '../styles/SeccionesEmpresa.css';

function About() {
  const { theme } = useTheme();

  return (
    <div id="on-empresas" data-theme={theme}>
      {/* ================= NOSOTROS ================= */}
      <section className="nosotros" id="nosotros">
        <div className="nosotros-hero">
          <div className="inner">
            <div className="eyebrow">Nosotros</div>
            <h2>Más de 20 años liderando la evolución digital</h2>
            <p>
              Acompañamos a las empresas más importantes del país con infraestructura propia,
              soporte experto y soluciones pensadas para entornos exigentes.
            </p>

            <div className="stat-row">
              <div className="stat-card">
                <div className="num">+20</div>
                <div className="lbl">años de experiencia</div>
              </div>
              <div className="stat-card">
                <div className="num">+12,000</div>
                <div className="lbl">clientes activos</div>
              </div>
              <div className="stat-card">
                <div className="num">+800</div>
                <div className="lbl">colaboradores</div>
              </div>
              <div className="stat-card">
                <div className="num">4</div>
                <div className="lbl">data centers</div>
              </div>
              <div className="stat-card">
                <div className="num">1</div>
                <div className="lbl">CyberSOC propio</div>
              </div>
              <div className="stat-card">
                <div className="num">24x7</div>
                <div className="lbl">soporte propio</div>
              </div>
            </div>
          </div>
        </div>

        <div className="clientes">
          <h2>
            Empresas de distintos sectores <span className="accent">confían en nosotros</span>
          </h2>
          <p className="lead">
            Impulsamos la productividad y continuidad de negocio de miles de empresas con
            infraestructura, soporte experto y soluciones diseñadas para entornos exigentes.
          </p>
          <div className="logo-grid">
            <div className="logo-card">Sector Educación</div>
            <div className="logo-card">Sector Financiero</div>
            <div className="logo-card">Sector Retail</div>
            <div className="logo-card">Sector Salud</div>
            <div className="logo-card">Sector Industrial</div>
            <div className="logo-card">Sector Entretenimiento</div>
            <div className="logo-card">Sector Energía</div>
            <div className="logo-card">Sector Público</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
