import React, { useState } from "react";
import {
  FaShieldAlt,
  FaUser,
  FaChalkboardTeacher,
  FaUsers,
  FaSchool,
  FaUserGraduate,
  FaFolderOpen,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Administrativo.css";
import CrudRol from "./CrudRol";
import CrudAcudiente from "./CrudAcudiente";
import CrudEstudiante from "./CrudEstudiante";
import CrudCurso from "./CrudCurso";
import CrudUsuario from "./CrudUsuario";
import CrudDocente from "./CrudDocente";
import CrudAdministrativo from "./CrudAdministrativo";
import logo from '../assets/siga-logo.png';

function Administrativo() {
  const [seccionActiva, setSeccionActiva] = useState("usuario");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const renderSeccion = () => {
    switch (seccionActiva) {
      case "rol":
        return <CrudRol />;
      case "usuario":
        return <CrudUsuario />;
      case "docente":
        return <CrudDocente />;
      case "acudiente":
        return <CrudAcudiente />;
      case "curso":
        return <CrudCurso />;
      case "estudiante":
        return <CrudEstudiante />;
      case "administrativo":
        return <CrudAdministrativo />;
      default:
        return <h2>Seleccione una sección</h2>;
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <img
            src={logo}
            alt="Logo SIGA"
          />
          <h3>Admin Panel</h3>
        </div>

        <button onClick={() => setSeccionActiva("rol")}>
          <FaShieldAlt /> Rol
        </button>
        <button onClick={() => setSeccionActiva("usuario")}>
          <FaUser /> Usuario
        </button>
        <button onClick={() => setSeccionActiva("docente")}>
          <FaChalkboardTeacher /> Docente
        </button>
        <button onClick={() => setSeccionActiva("acudiente")}>
          <FaUsers /> Acudiente
        </button>
        <button onClick={() => setSeccionActiva("curso")}>
          <FaSchool /> Curso
        </button>
        <button onClick={() => setSeccionActiva("estudiante")}>
          <FaUserGraduate /> Estudiante
        </button>
        <button onClick={() => setSeccionActiva("administrativo")}>
          <FaFolderOpen /> Administrativo
        </button>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </div>

      <div className="main-content">{renderSeccion()}</div>
    </div>
  );
}

export default Administrativo;
