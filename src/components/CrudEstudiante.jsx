import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CrudEstudiante.css";

function CrudEstudiante() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [acudientes, setAcudientes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    acudiente_id: "",
    curso_id: "",
  });
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // Filtros
  const [filtroApellido, setFiltroApellido] = useState("");
  const [filtroAcudiente, setFiltroAcudiente] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("");

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => {
      const mensajeDiv = document.querySelector(".mensaje-exito");
      if (mensajeDiv) {
        mensajeDiv.classList.add("oculto");
      }
    }, 2500);
    setTimeout(() => setMensaje(""), 3000);
  };

  useEffect(() => {
    obtenerEstudiantes();
    obtenerAcudientes();
    obtenerCursos();
  }, []);

  const obtenerEstudiantes = async () => {
    const response = await axios.get("http://localhost:8000/api/obtener-estudiantes");
    setEstudiantes(response.data.estudiantes);
  };

  const obtenerAcudientes = async () => {
    const response = await axios.get("http://localhost:8000/api/obtener-acudientes");
    setAcudientes(response.data.acudientes);
  };

  const obtenerCursos = async () => {
    const response = await axios.get("http://localhost:8000/api/obtener-cursos");
    setCursos(response.data.cursos);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registrarEstudiante = async () => {
    await axios.post("http://localhost:8000/api/registrar-estudiantes", formData);
    setFormData({ nombre: "", apellido: "", acudiente_id: "", curso_id: "" });
    obtenerEstudiantes();
    mostrarMensaje("✅ Estudiante registrado con éxito");
  };

  const actualizarEstudiante = async () => {
    await axios.put(`http://localhost:8000/api/actualizar-estudiantes/${editId}`, formData);
    setEditId(null);
    setFormData({ nombre: "", apellido: "", acudiente_id: "", curso_id: "" });
    obtenerEstudiantes();
    mostrarMensaje("✏️ Estudiante actualizado correctamente");
  };

  const eliminarEstudiante = async (id) => {
    await axios.delete(`http://localhost:8000/api/eliminar-estudiantes/${id}`);
    obtenerEstudiantes();
    mostrarMensaje("🗑️ Estudiante eliminado");
  };

  const editarEstudiante = (estudiante) => {
    setEditId(estudiante.id);
    setFormData({
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      acudiente_id: estudiante.acudiente_id,
      curso_id: estudiante.curso_id,
    });
  };

  // Filtrar estudiantes
  const estudiantesFiltrados = estudiantes.filter((e) => {
    const apellidoMatch = e.apellido.toLowerCase().includes(filtroApellido.toLowerCase());
    const acudiente = acudientes.find((a) => a.id === e.acudiente_id);
    const acudienteNombre = acudiente ? `${acudiente.nombre} ${acudiente.apellido}`.toLowerCase() : "";
    const acudienteMatch = acudienteNombre.includes(filtroAcudiente.toLowerCase());
    const cursoMatch = filtroCurso === "" || e.curso_id == filtroCurso;
    return apellidoMatch && acudienteMatch && cursoMatch;
  });

  return (
    <>
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <div className="estudiante-container">
        <h2>{editId ? "Editar Estudiante" : "Registrar Estudiante"}</h2>
        <div className="estudiante-form">
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
          <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />

          <select name="acudiente_id" value={formData.acudiente_id} onChange={handleChange}>
            <option value="">Selecciona un acudiente</option>
            {acudientes.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
            ))}
          </select>

          <select name="curso_id" value={formData.curso_id} onChange={handleChange}>
            <option value="">Selecciona un curso</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>

          <button onClick={editId ? actualizarEstudiante : registrarEstudiante}>
            {editId ? "Actualizar" : "Registrar"}
          </button>
        </div>

        {/* Filtros */}
        <div className="estudiante-filtros">
          <input
            type="text"
            placeholder="Buscar por apellido"
            value={filtroApellido}
            onChange={(e) => setFiltroApellido(e.target.value)}
          />
          <input
            type="text"
            placeholder="Buscar por acudiente"
            value={filtroAcudiente}
            onChange={(e) => setFiltroAcudiente(e.target.value)}
          />
          <select value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
            <option value="">Todos los cursos</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>{curso.nombre}</option>
            ))}
          </select>
        </div>

        <div className="estudiante-table-container">
          <table className="estudiante-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Acudiente</th>
                <th>Curso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesFiltrados.map((e) => {
                const acudiente = acudientes.find((a) => a.id === e.acudiente_id);
                const curso = cursos.find((c) => c.id === e.curso_id);
                return (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.nombre}</td>
                    <td>{e.apellido}</td>
                    <td>{acudiente ? `${acudiente.nombre} ${acudiente.apellido}` : ""}</td>
                    <td>{curso ? curso.nombre : ""}</td>
                    <td>
                      <button className="edit-btn" onClick={() => editarEstudiante(e)}>Editar</button>
                      <button className="delete-btn" onClick={() => eliminarEstudiante(e.id)}>Eliminar</button>
                    </td>
                  </tr>
                );
              })}
              {estudiantesFiltrados.length === 0 && (
                <tr><td colSpan="6">No hay estudiantes que coincidan con la búsqueda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CrudEstudiante;
