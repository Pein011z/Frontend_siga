import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CrudAdministrativo.css";

const CrudAdministrativo = () => {
  const [administrativos, setAdministrativos] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [nuevoAdministrativo, setNuevoAdministrativo] = useState({
    usuario_id: "",
    nombre: "",
    apellido: "",
  });
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

  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    obtenerAdministrativos();
    obtenerUsuariosDisponibles();
  }, []);

  const obtenerAdministrativos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/administrativos");
      setAdministrativos(response.data);
    } catch (error) {
      console.error("Error al obtener administrativos:", error);
    }
  };

  const obtenerUsuariosDisponibles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/usuarios-disponibles-administrativos");
      setUsuariosDisponibles(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios disponibles:", error);
    }
  };

  const registrarAdministrativo = async () => {
    try {
      await axios.post("http://localhost:8000/api/administrativos", nuevoAdministrativo);
      setNuevoAdministrativo({ usuario_id: "", nombre: "", apellido: "" });
      obtenerAdministrativos();
      obtenerUsuariosDisponibles();
      mostrarMensaje("✅ Administrador registrado con éxito");
    } catch (error) {
      console.error("Error al registrar administrativo:", error);
    }
  };

  const actualizarAdministrativo = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/administrativos/${id}`, nuevoAdministrativo);
      setNuevoAdministrativo({ usuario_id: "", nombre: "", apellido: "" });
      setEditandoId(null);
      obtenerAdministrativos();
      mostrarMensaje("✏️ Administrador actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar administrativo:", error);
    }
  };

  const eliminarAdministrativo = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/administrativos/${id}`);
      obtenerAdministrativos();
      obtenerUsuariosDisponibles();
      mostrarMensaje("🗑️ Administrador eliminado");
    } catch (error) {
      console.error("Error al eliminar administrativo:", error);
    }
  };

  const handleChange = (e) => {
    setNuevoAdministrativo({ ...nuevoAdministrativo, [e.target.name]: e.target.value });
  };

  const comenzarEdicion = (administrativo) => {
    setNuevoAdministrativo({
      usuario_id: administrativo.usuario_id,
      nombre: administrativo.nombre,
      apellido: administrativo.apellido,
    });
    setEditandoId(administrativo.id);
  };

  return (
    <>
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      <div className="administrativo-container">
        <h2>Gestión de Administrativos</h2>
        <div className="administrativo-form">
          <select
            name="usuario_id"
            value={nuevoAdministrativo.usuario_id}
            onChange={handleChange}
            disabled={editandoId !== null}
          >
            <option value="">Selecciona un usuario</option>
            {usuariosDisponibles.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.id} - {usuario.correo}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={nuevoAdministrativo.nombre}
            onChange={handleChange}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={nuevoAdministrativo.apellido}
            onChange={handleChange}
          />
          <button onClick={editandoId ? () => actualizarAdministrativo(editandoId) : registrarAdministrativo}>
            {editandoId ? "Actualizar" : "Registrar"}
          </button>
        </div>

        <div className="administrativo-table-container">
          <table className="administrativo-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {administrativos.map((administrativo) => (
                <tr key={administrativo.id}>
                  <td>{administrativo.id}</td>
                  <td>{administrativo.usuario_id}</td>
                  <td>{administrativo.nombre}</td>
                  <td>{administrativo.apellido}</td>
                  <td>
                    <button className="edit-btn" onClick={() => comenzarEdicion(administrativo)}>
                      Editar
                    </button>
                    <button className="delete-btn" onClick={() => eliminarAdministrativo(administrativo.id)}>
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
};

export default CrudAdministrativo;
