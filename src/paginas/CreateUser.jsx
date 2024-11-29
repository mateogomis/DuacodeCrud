// src/paginas/CreateUser.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import BackButton from "../componentes/BackButton";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Para manejar errores
  const { users, setUsers } = useUserContext();
  const navigate = useNavigate();

  const isAlpha = (value) => /^[a-zA-Z\s]+$/.test(value); // Validar solo letras y espacios

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!name.trim() || !job.trim()) {
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

    setLoading(true);
    setError(""); // Limpiar errores previos si pasa la validación

    try {
      const response = await axios.post("https://reqres.in/api/users", {
        name,
        job,
      });

      const newUser = {
        id: response.data.id,
        first_name: name,
        last_name: "",
        email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
        avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(
          Math.random() * 10
        )}.jpg`,
        job,
      };

      setUsers([newUser, ...users]);
      navigate("/");
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Usuario</h1>
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
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Usuario"}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
