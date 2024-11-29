import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import "../styles/EditUser.css"; // Importar estilos personalizados

const EditUser = () => {
  const { id } = useParams();
  const { users, setUsers } = useUserContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [email, setEmail] = useState(""); // Estado para email
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Para manejar errores

  const isAlpha = (value) => /^[a-zA-Z\s]+$/.test(value); // Validar solo letras y espacios
  const isEmailValid = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Validar formato de email

  useEffect(() => {
    const userToEdit = users.find((u) => u.id === parseInt(id) || u.id === id);
    if (userToEdit) {
      setName(userToEdit.first_name);
      setJob(userToEdit.job || "");
      setEmail(userToEdit.email || ""); // Precargar email
    }
  }, [id, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!name.trim() || !job.trim() || !email.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!isAlpha(name)) {
      setError("El nombre solo puede contener letras y espacios");
      return;
    }

    if (!isAlpha(job)) {
      setError("El trabajo solo puede contener letras y espacios");
      return;
    }

    if (!isEmailValid(email)) {
      setError("El correo electrónico no es válido");
      return;
    }

    setLoading(true);
    setError(""); // Limpiar errores previos si pasa la validación

    try {
      const response = await axios.put(`https://reqres.in/api/users/${id}`, {
        name,
        job,
        email, // Incluir email en la petición
      });

      setUsers(
        users.map((u) =>
          u.id === id || u.id === parseInt(id)
            ? { ...u, first_name: name, job, email }
            : u
        )
      );
      navigate("/");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-user-container">
      <div className="edit-user-card">
        <a href="/" className="back-button">
          Volver al listado
        </a>
        <h1 className="edit-user-title">Editar Usuario</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Trabajo</label>
            <input
              type="text"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="edit-user-button"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
