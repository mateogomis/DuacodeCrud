import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import "../styles/EditUser.css"; 

const EditUser = () => {
  const { id } = useParams();
  const { users, setUsers } = useUserContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  const isAlpha = (value) => /^[a-zA-Z\s]+$/.test(value); 
  const isEmailValid = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); 

  useEffect(() => {
    const userToEdit = users.find((u) => u.id === parseInt(id) || u.id === id);
    if (userToEdit) {
      setName(userToEdit.first_name);
      setJob(userToEdit.job || "");
      setEmail(userToEdit.email || ""); 
    }
  }, [id, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    setError(""); 

    try {
      const response = await axios.put(`https://reqres.in/api/users/${id}`, {
        name,
        job,
        email, 
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
      <h1 className="edit-user-title">Editar Usuario</h1>
      <button
          className="back-button"
          onClick={() => navigate("/")}
          >
          Volver al listado
        </button>
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
            {loading ? (
              <>
                Guardando <span className="dots-loading"><span>.</span><span>.</span><span>.</span></span>
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
