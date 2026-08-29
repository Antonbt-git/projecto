import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const login = async () => {
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
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>Iniciar sesión</h1>

                <p className="subtitle">
                    Accede a tu cuenta
                </p>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button onClick={login}>
                    Iniciar sesión
                </button>

                <div className="separator">
                    o
                </div>

                <Link
                    className="face-button"
                    to="/register"
                >
                    👤 Registrarme con reconocimiento facial
                </Link>

                <p>
                    ¿No tienes una cuenta?
                    <Link to="/register">
                        {" "}Registrarse
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;

