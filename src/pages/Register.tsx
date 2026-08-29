import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FaceCamera from "../components/FaceCamera";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [descriptor, setDescriptor] = useState<number[] | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const register = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;

        if (!name || !email || !password) {
            setError("Completa todos los campos");
            return;
        }

        if (!descriptor || descriptor.length !== 128) {
            setError("Primero debes registrar correctamente tu rostro");
            return;
        }

        setError("");
        setLoading(true);

        try {

            await axios.post(
                "http://localhost:4000/api/auth/register",
                {
                    name,
                    email,
                    password,
                    faceDescriptor: descriptor
                }
            );

            localStorage.setItem("verifyEmail", email);

            navigate("/verify");

        } catch (error: any) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Error registrando usuario"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-shell">

            <div className="auth-card">

                <div className="auth-header">
                    <div className="auth-logo">👤</div>

                    <div className="auth-badge">NUEVA CUENTA</div>

                    <h1 className="auth-title">Crear cuenta</h1>

                    <p className="auth-subtitle">
                        Registra tus datos y verifica tu rostro
                    </p>
                </div>

                {error && (
                    <div className="auth-message is-error">
                        <span className="auth-message-icon">!</span>
                        <span>{error}</span>
                    </div>
                )}

                {descriptor && !error && (
                    <div className="auth-message is-success">
                        <span className="auth-message-icon">✓</span>
                        <span>Rostro registrado correctamente</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={register}>

                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="register-name">
                            Nombre completo
                        </label>

                        <input
                            id="register-name"
                            className="auth-input"
                            placeholder="Tu nombre y apellido"
                            autoComplete="name"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="register-email">
                            Correo electrónico
                        </label>

                        <input
                            id="register-email"
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
                        <label className="auth-label" htmlFor="register-password">
                            Contraseña
                        </label>

                        <input
                            id="register-password"
                            className="auth-input"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">
                            Verificación facial
                        </label>

                        <FaceCamera
                            onDetected={setDescriptor}
                        />
                    </div>

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creando cuenta..." : "Crear cuenta"}
                    </button>

                </form>

                <div className="auth-footer">
                    <p className="auth-footer-text">
                        ¿Ya tienes cuenta?{" "}
                        <Link className="auth-link" to="/">
                            Iniciar sesión
                        </Link>
                    </p>
                </div>

            </div>

        </div>
    );
}

export default Register;
