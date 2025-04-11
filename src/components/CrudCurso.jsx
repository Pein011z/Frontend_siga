import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CrudCurso.css';

const CrudCurso = () => {
  const [cursos, setCursos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const obtenerCursos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/obtener-cursos');
      setCursos(response.data.cursos);
    } catch (error) {
      console.error('Error al obtener cursos:', error);
    }
  };

  useEffect(() => {
    obtenerCursos();
  }, []);

  const registrarCurso = async () => {
    try {
      if (editandoId) {
        await axios.put(`http://localhost:8000/api/actualizar-cursos/${editandoId}`, {
          nombre,
        });
      } else {
        await axios.post('http://localhost:8000/api/registrar-cursos', { nombre });
      }
      setNombre('');
      setEditandoId(null);
      obtenerCursos();
    } catch (error) {
      console.error('Error al registrar/editar curso:', error);
    }
  };

  const editarCurso = (curso) => {
    setNombre(curso.nombre);
    setEditandoId(curso.id);
  };

  const eliminarCurso = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/eliminar-cursos/${id}`);
      obtenerCursos();
    } catch (error) {
      console.error('Error al eliminar curso:', error);
    }
  };

  return (
    <div className="acudiente-container">
      <h2>Gestión de Cursos</h2>
      <div className="acudiente-form">
        <input
          type="text"
          placeholder="Nombre del curso"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button onClick={registrarCurso}>
          {editandoId ? 'Actualizar' : 'Registrar'}
        </button>
      </div>

      <div className="acudiente-table-container">
        <table className="acudiente-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso.id}>
                <td>{curso.id}</td>
                <td>{curso.nombre}</td>
                <td>
                  <button className="edit-btn" onClick={() => editarCurso(curso)}>Editar</button>
                  <button className="delete-btn" onClick={() => eliminarCurso(curso.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {cursos.length === 0 && (
              <tr>
                <td colSpan="3">No hay cursos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrudCurso;
