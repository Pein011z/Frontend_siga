import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CrudUsuario.css";

function CrudUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rolId, setRolId] = useState("");
  const [editando, setEditando] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => {
      const mensajeDiv = document.querySelector(".mensaje-exito");
      if (mensajeDiv) {
        mensajeDiv.classList.add("oculto");
      }
    }, 2500);

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  };


  const apiUrl = "http://localhost:8000/api";

  useEffect(() => {
    obtenerUsuarios();
    obtenerRoles();
  }, []);

  const obtenerUsuarios = async () => {
    const res = await axios.get(`${apiUrl}/obtener-usuarios`);
    setUsuarios(res.data.usuarios);
  };

  const obtenerRoles = async () => {
    const res = await axios.get(`${apiUrl}/obtener-roles`);
    setRoles(res.data.roles);
  };

  const limpiar = () => {
    setCorreo("");
    setPassword("");
    setRolId("");
    setEditando(false);
    setIdSeleccionado(null);
  };

  const registrar = async () => {
    await axios.post(`${apiUrl}/registrar-usuario`, {
      correo,
      password,
      rol_id: rolId,
    });
    obtenerUsuarios();
    limpiar();
    mostrarMensaje("✅ Usuario registrado con éxito");
  };

  const actualizar = async () => {
    const data = {
      correo,
      rol_id: rolId,
    };

    if (password.trim() !== "") {
      data.password = password;
    }

    await axios.put(`${apiUrl}/actualizar-usuario/${idSeleccionado}`, data);
    obtenerUsuarios();
    limpiar();
    mostrarMensaje("✏️ Usuario actualizado correctamente");
  };

  const eliminar = async (id) => {
    await axios.delete(`${apiUrl}/eliminar-usuario/${id}`);
    obtenerUsuarios();
    mostrarMensaje("🗑️ Usuario eliminado");
  };

  const seleccionar = (usuario) => {
    setCorreo(usuario.correo);
    setRolId(usuario.rol_id);
    setPassword("");
    setEditando(true);
    setIdSeleccionado(usuario.id);
  };

  return (
    <>
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      <div className="acudiente-container">
        <h2>Gestión de Usuarios</h2>

        <div className="acudiente-form">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select value={rolId} onChange={(e) => setRolId(e.target.value)}>
            <option value="">Seleccionar Rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
          {!editando ? (
            <button onClick={registrar}>Registrar</button>
          ) : (
            <>
              <button onClick={actualizar}>Actualizar</button>
              <button onClick={limpiar}>Cancelar</button>
            </>
          )}
        </div>

        <div className="acudiente-table-container">
          <table className="acudiente-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.correo}</td>
                  <td>{u.rol_id}</td>
                  <td>
                    <button className="edit-btn" onClick={() => seleccionar(u)}>
                      Editar
                    </button>
                    <button className="delete-btn" onClick={() => eliminar(u.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default CrudUsuario;
