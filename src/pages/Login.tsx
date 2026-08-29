import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setError("");
    setLoading(true);

    try {

      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        { email, password }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (error: any) {

      setError(
        error.response?.data?.message ||
        "Error iniciando sesión"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">

      <div className="auth-card">

        <div className="auth-header">
          <div className="auth-logo">🔐</div>

          <div className="auth-badge">ACCESO SEGURO</div>

          <h1 className="auth-title">Iniciar sesión</h1>

          <p className="auth-subtitle">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        {error && (
          <div className="auth-message is-error">
            <span className="auth-message-icon">!</span>
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={login}>

          <div className="auth-input-group">
            <label className="auth-label" htmlFor="login-email">
              Correo electrónico
            </label>

            <input
              id="login-email"
              className="auth-input"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="login-password">
                Contraseña
              </label>

              <span className="auth-forgot">¿Olvidaste tu contraseña?</span>
            </div>

            <input
              id="login-password"
              className="auth-input"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>

        <div className="auth-divider">o</div>

        <Link
          className="auth-secondary"
          to="/register"
        >
          👤 Registrarme con reconocimiento facial
        </Link>

        <div className="auth-footer">
          <p className="auth-footer-text">
            ¿No tienes una cuenta?{" "}
            <Link className="auth-link" to="/register">
              Regístrate
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}

export default Login;
