import { useTheme } from '../context/ThemeContext';
import '../styles/SeccionesEmpresa.css';

function Contact() {
  const { theme } = useTheme();

  return (
    <div id="on-empresas" data-theme={theme}>
      {/* ================= CONTACTANOS ================= */}
      <section className="contacto" id="contactanos">
        <div className="contacto-copy">
          <div className="eyebrow">Contáctanos</div>
          <h2>
            Internet para empresas <span className="accent">+</span> ciberseguridad y cloud
          </h2>
          <p className="lead">
            Conéctate a una red robusta y estable, con seguridad avanzada y despliegue de
            servicios en la nube con latencia menor a 2ms.
          </p>

          <div className="bullets">
            <div className="bullet">
              <div className="mark" />
              <p>
                <strong>Red propia 100% fibra óptica</strong> con enlace dedicado y velocidad
                simétrica.
              </p>
            </div>
            <div className="bullet">
              <div className="mark" />
              <p>
                <strong>Soluciones de ciberseguridad</strong> perimetral y protección de red.
              </p>
            </div>
            <div className="bullet">
              <div className="mark" />
              <p>
                <strong>Infraestructura cloud local</strong> con beneficios y descuentos
                exclusivos.
              </p>
            </div>
          </div>
        </div>

        <div className="form-panel">
          <h3>
            Ingresa los datos de tu empresa para que uno de nuestros expertos se ponga en contacto
            contigo.
          </h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="field">
              <label>Nombres</label>
              <input type="text" placeholder="Ej. María" />
            </div>
            <div className="field">
              <label>Apellidos</label>
              <input type="text" placeholder="Ej. Torres" />
            </div>
            <div className="field">
              <label>RUC</label>
              <input type="text" placeholder="20XXXXXXXXX" />
            </div>
            <div className="field">
              <label>Teléfono / Celular</label>
              <input type="tel" placeholder="9XX XXX XXX" />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="nombre@empresa.com" />
            </div>
            <div className="field">
              <label>Servicios a contratar</label>
              <select defaultValue="">
                <option value="" disabled>
                  Selecciona un servicio
                </option>
                <option>Conectividad</option>
                <option>Ciberseguridad</option>
                <option>Cloud</option>
                <option>Data Center</option>
              </select>
            </div>
            <button className="submit-btn" type="submit">
              Solicitar cotización
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Contact;
