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

    const navigate = useNavigate();

    const register = async () => {

    if (!name || !email || !password) {
        setError("Completa todos los campos");
        return;
    }

    if (!descriptor || descriptor.length !== 128) {
        setError("Primero debes registrar correctamente tu rostro");
        return;
    }

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
    }
};

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>Crear cuenta</h1>

                <p className="subtitle">
                    Registra tus datos y tu rostro
                </p>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <input
                    placeholder="Nombre completo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

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

                <FaceCamera
                    onDetected={setDescriptor}
                />

                <button onClick={register}>
                    Crear cuenta
                </button>

                <p>
                    ¿Ya tienes cuenta?
                    <Link to="/">
                        {" "}Iniciar sesión
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;