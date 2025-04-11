import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CrudAcudiente.css";

function CrudAcudiente() {
  const [acudientes, setAcudientes] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    obtenerAcudientes();
  }, []);

  const obtenerAcudientes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/obtener-acudientes");
      setAcudientes(response.data.acudientes);
    } catch (error) {
      console.error("Error al obtener acudientes:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const registrarAcudiente = async () => {
    try {
      await axios.post("http://localhost:8000/api/registrar-acudientes", formData);
      setFormData({ nombre: "", apellido: "", correo: "" });
      obtenerAcudientes();
    } catch (error) {
      console.error("Error al registrar acudiente:", error);
    }
  };

  const actualizarAcudiente = async () => {
    try {
      await axios.put(`http://localhost:8000/api/actualizar-acudientes/${editId}`, formData);
      setEditId(null);
      setFormData({ nombre: "", apellido: "", correo: "" });
      obtenerAcudientes();
    } catch (error) {
      console.error("Error al actualizar acudiente:", error);
    }
  };

  const eliminarAcudiente = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/eliminar-acudientes/${id}`);
      obtenerAcudientes();
    } catch (error) {
      console.error("Error al eliminar acudiente:", error);
    }
  };

  const handleEdit = (acudiente) => {
    setEditId(acudiente.id);
    setFormData({
      nombre: acudiente.nombre,
      apellido: acudiente.apellido,
      correo: acudiente.correo,
    });
  };

  return (
    <div className="acudiente-container">
      <h2>{editId ? "Editar Acudiente" : "Registrar Acudiente"}</h2>

      <div className="acudiente-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleInputChange}
        />
        <button onClick={editId ? actualizarAcudiente : registrarAcudiente}>
          {editId ? "Actualizar" : "Registrar"}
        </button>
      </div>

      <div className="acudiente-table-container">
        <table className="acudiente-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {acudientes.map((acudiente) => (
              <tr key={acudiente.id}>
                <td>{acudiente.id}</td>
                <td>{acudiente.nombre}</td>
                <td>{acudiente.apellido}</td>
                <td>{acudiente.correo}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(acudiente)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => eliminarAcudiente(acudiente.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {acudientes.length === 0 && (
              <tr>
                <td colSpan="5">No hay acudientes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CrudAcudiente;
