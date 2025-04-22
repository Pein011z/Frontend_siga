import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from '../assets/siga-logo.png';
import './Login.css';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);

        try {
          const perfilResponse = await fetch('http://localhost:8000/api/perfil', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${data.token}`,
              'Content-Type': 'application/json',
            },
          });

          const perfilData = await perfilResponse.json();

          if (!perfilResponse.ok) {
            throw new Error('No se pudo obtener el perfil');
          }

          const rol = perfilData.success.usuarios.rol_id;
          localStorage.setItem('rol', rol);

          let ruta;
          if (rol === 1) {
            ruta = '/Administrativo';
          } else if (rol === 2) {
            ruta = '/Docente';
          } else {
            throw new Error('Rol no autorizado');
          }

          Swal.fire({
            title: '¡Bienvenido a SIGA!',
            text: 'Ingreso exitoso.',
            imageUrl: logo,
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'Logo SIGA',
            confirmButtonText: 'Entrar al sistema',
            customClass: {
              confirmButton: 'btn btn-success',
              popup: 'p-4 rounded-4 shadow',
            },
            buttonsStyling: false,
          }).then(() => {
            navigate(ruta);
          });

        } catch (perfilError) {
          console.error(perfilError);
          Swal.fire({
            title: 'Error al obtener perfil',
            text: 'Hubo un problema al verificar el rol del usuario.',
            icon: 'error',
          });
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: data.error || 'Correo o contraseña incorrectos.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
        });
      }

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error del servidor',
        text: 'No se pudo conectar al servidor. Intenta más tarde.',
        icon: 'error',
      });
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
                      <img src={logo} style={{ width: '185px' }} alt="Logo SIGA" />
                      <h4 className="mt-1 mb-5 pb-1">Sistema de Ingreso General Académico</h4>
                    </div>

                    <form onSubmit={handleLogin}>
                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="form2Example11"
                          className="form-control"
                          placeholder="Correo electrónico"
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                          required
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
                          required
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
                          type="submit"
                          className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
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
};

export default Login;
