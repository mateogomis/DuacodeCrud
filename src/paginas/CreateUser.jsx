import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import "../styles/CreateUser.css";

const CreateUser = () => {
    const [name, setName] = useState("");
    const [job, setJob] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Estado de carga
    const { users, setUsers } = useUserContext();
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!name.trim() || !job.trim()) {
        setError("Todos los campos son obligatorios");
        return;
      }
  
      setLoading(true); // Inicia el estado de carga
  
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
        setError("Hubo un error al intentar crear el usuario. Inténtalo de nuevo.");
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };
  
    return (
      <div className="create-user-container">
        <div className="create-user-card">
          <h2 className="create-user-title">Crear Usuario</h2>
           {/* Botón para volver al listado */}
           <a href="/" className="back-button">
            Volver al listado
          </a>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Trabajo</label>
              <input
                type="text"
                className="form-control"
                value={job}
                onChange={(e) => setJob(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={`create-user-button ${loading ? "loading" : ""}`}
              disabled={loading} // Desactiva el botón mientras se carga
            >
              {loading ? "Creando" : "Crear Usuario"}{" "}
              {loading && <span className="dots">...</span>} {/* Puntos suspensivos */}
            </button>
          </form>
  
         
        </div>
      </div>
    );
  };
  
  export default CreateUser;