import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CrudAcudiente.css"; // Reutilizamos este estilo

const CrudDocente = () => {
  const [docentes, setDocentes] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [nuevoDocente, setNuevoDocente] = useState({
    usuario_id: "",
    nombre: "",
    apellido: "",
  });

  const [editandoId, setEditandoId] = useState(null);
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

  useEffect(() => {
    obtenerDocentes();
    obtenerUsuariosDisponibles();
  }, []);

  const obtenerDocentes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/docentes");
      setDocentes(response.data);
    } catch (error) {
      console.error("Error al obtener docentes:", error);
    }
  };

  const obtenerUsuariosDisponibles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/usuarios-disponibles-docentes"
      );
      setUsuariosDisponibles(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios disponibles:", error);
    }
  };

  const registrarDocente = async () => {
    try {
      await axios.post("http://localhost:8000/api/docentes", nuevoDocente);
      setNuevoDocente({ usuario_id: "", nombre: "", apellido: "" });
      obtenerDocentes();
      obtenerUsuariosDisponibles();
      mostrarMensaje("✅ Docente registrado con éxito");
    } catch (error) {
      console.error("Error al registrar docente:", error);
    }
  };

  const actualizarDocente = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/docentes/${id}`, nuevoDocente);
      setNuevoDocente({ usuario_id: "", nombre: "", apellido: "" });
      setEditandoId(null);
      obtenerDocentes();
      mostrarMensaje("✏️ Docente actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar docente:", error);
    }
  };

  const eliminarDocente = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/docentes/${id}`);
      obtenerDocentes();
      obtenerUsuariosDisponibles();
      mostrarMensaje("🗑️ Docente eliminado");
    } catch (error) {
      console.error("Error al eliminar docente:", error);
    }
  };

  const handleChange = (e) => {
    setNuevoDocente({ ...nuevoDocente, [e.target.name]: e.target.value });
  };

  const comenzarEdicion = (docente) => {
    setNuevoDocente({
      usuario_id: docente.usuario_id,
      nombre: docente.nombre,
      apellido: docente.apellido,
    });
    setEditandoId(docente.id);
  };

  return (
    <>
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}


      <div className="acudiente-container">
        <h2>Gestión de Docentes</h2>
        <div className="acudiente-form">
          <select
            name="usuario_id"
            value={nuevoDocente.usuario_id}
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
            value={nuevoDocente.nombre}
            onChange={handleChange}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={nuevoDocente.apellido}
            onChange={handleChange}
          />
          <button onClick={editandoId ? () => actualizarDocente(editandoId) : registrarDocente}>
            {editandoId ? "Actualizar" : "Registrar"}
          </button>
        </div>

        <div className="acudiente-table-container">
          <table className="acudiente-table">
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
              {docentes.map((docente) => (
                <tr key={docente.id}>
                  <td>{docente.id}</td>
                  <td>{docente.usuario_id}</td>
                  <td>{docente.nombre}</td>
                  <td>{docente.apellido}</td>
                  <td>
                    <button className="edit-btn" onClick={() => comenzarEdicion(docente)}>
                      Editar
                    </button>
                    <button className="delete-btn" onClick={() => eliminarDocente(docente.id)}>
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

export default CrudDocente;
