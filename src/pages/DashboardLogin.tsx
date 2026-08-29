import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    return (
        <div className="dashboard">

            <div className="dashboard-card">

                <h1>
                    Bienvenido, {user.name} 👋
                </h1>

                <p>{user.email}</p>

                <p>
                    🔐 Sesión protegida mediante JWT
                </p>

                <button onClick={logout}>
                    Cerrar sesión
                </button>

            </div>

        </div>
    );
}

export default Dashboard;