import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Verify() {

    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const email =
        localStorage.getItem("verifyEmail");

    const verify = async () => {

        try {

            await axios.post(
                "http://localhost:4000/api/auth/verify",
                {
                    email,
                    code
                }
            );

            setMessage("Cuenta verificada correctamente");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error: any) {

            setMessage(
                error.response?.data?.message ||
                "Código incorrecto"
            );
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>Verifica tu correo</h1>

                <p>
                    Hemos enviado un código de seguridad
                    a:
                </p>

                <strong>{email}</strong>

                <input
                    className="code-input"
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={e =>
                        setCode(e.target.value)
                    }
                />

                <button onClick={verify}>
                    Verificar código
                </button>

                {message && (
                    <p>{message}</p>
                )}

            </div>

        </div>
    );
}

export default Verify;