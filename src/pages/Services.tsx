import { useTheme } from '../context/ThemeContext';
import '../styles/SeccionesEmpresa.css';

function Services() {
  const { theme } = useTheme();

  return (
    <div id="on-empresas" data-theme={theme}>
      {/* ================= SERVICIOS ================= */}
      <section className="servicios" id="servicios">
        <div className="head">
          <div className="eyebrow">Servicios</div>
          <h2>
            Todo lo que tu empresa <span className="accent">necesita</span>, en un solo lugar
          </h2>
          <p className="lead">
            Conectividad, seguridad e infraestructura cloud diseñadas para que tu operación no se
            detenga nunca.
          </p>
        </div>

        <div className="servicios-grid">
          <div className="serv-card">
            <div className="serv-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </svg>
            </div>
            <h3>Conectividad</h3>
            <p>Enlaces dedicados de fibra óptica con velocidad simétrica y alta disponibilidad.</p>
          </div>

          <div className="serv-card">
            <div className="serv-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Ciberseguridad</h3>
            <p>Protección perimetral y monitoreo activo frente a amenazas, 24 horas al día.</p>
          </div>

          <div className="serv-card">
            <div className="serv-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="6" rx="1" />
                <rect x="2" y="15" width="20" height="6" rx="1" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
            </div>
            <h3>Data Center</h3>
            <p>Red de data centers propios en el país con latencia menor a 2 milisegundos.</p>
          </div>

          <div className="serv-card">
            <div className="serv-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              </svg>
            </div>
            <h3>Cloud</h3>
            <p>Infraestructura cloud local con despliegue ágil y beneficios exclusivos.</p>
          </div>

          <div className="serv-card">
            <div className="serv-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3>Soporte 24x7</h3>
            <p>Atención técnica y consultiva especializada en español, todos los días del año.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
