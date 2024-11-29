// src/paginas/EditUser.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import BackButton from "../componentes/BackButton";

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
      <BackButton /> {/* Botón para volver */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Nombre</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Trabajo</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Correo Electrónico</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
};

export default EditUser;
