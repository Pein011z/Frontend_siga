import { useState } from "react";
import axios from "axios";
import logo from '../assets/siga-logo.png';
import './Login.css';
import { useNavigate } from "react-router-dom"; // al inicio


function Login() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/api/login", {
                correo,
                password,
            });

            const token = response.data.token;
            localStorage.setItem("token", token);

            // Obtener perfil del usuario
            const profileResponse = await axios.get("http://localhost:8000/api/perfil", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const rol = profileResponse.data.success.usuarios.rol_id;
            localStorage.setItem("rol", rol);

            if (rol === 2) {
                navigate("/Docente");
            } else if (rol === 1) {
                navigate("/Administrativo");
            } else {
                setError("Rol no autorizado.");
            }
        } catch (err) {
            console.error(err);
            setError("Correo o contraseña incorrectos");
        }
    };
    return (
        <section className="h-100 gradient-form" style={{ backgroundColor: '#eee' }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10">
                        <div className="card rounded-3 text-black">
                            <div className="row g-0">
                                <div className="col-lg-6">
                                    <div className="card-body p-md-5 mx-md-4">

                                        <div className="text-center">
                                            <img
                                                src={logo}
                                                style={{ width: '185px' }}
                                                alt="Logo SIGA"
                                            />
                                            <h4 className="mt-1 mb-5 pb-1">Sistema de Ingreso General Académico</h4>
                                        </div>

                                        <form>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="email"
                                                    id="form2Example11"
                                                    className="form-control"
                                                    placeholder="Correo electrónico"
                                                    value={correo}
                                                    onChange={(e) => setCorreo(e.target.value)}
                                                />
                                                <label className="form-label" htmlFor="form2Example11">Usuario</label>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="form2Example22"
                                                    className="form-control"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <label className="form-label" htmlFor="form2Example22">Contraseña</label>
                                            </div>

                                            {error && (
                                                <div className="alert alert-danger" role="alert">
                                                    {error}
                                                </div>
                                            )}

                                            <div className="text-center pt-1 mb-5 pb-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                                                    onClick={handleLogin}
                                                >
                                                    Ingresar
                                                </button>
                                            </div>
                                        </form>


                                    </div>
                                </div>

                                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                        <h4 className="mb-4">Bienvenido a SIGA</h4>
                                        <p className="small mb-0">
                                            El Sistema de Ingreso General Académico (SIGA) te permite registrar la asistencia de los estudiantes, controlar inasistencias y llevar un seguimiento académico más eficiente y organizado.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
