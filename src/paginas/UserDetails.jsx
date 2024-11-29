import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import "../styles/UserDetails.css";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users } = useUserContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const foundUser = users.find((u) => u.id === parseInt(id) || u.id === id);

      if (foundUser) {
        setUser({ ...foundUser, job: foundUser.job || "Sin asignar" });
        setLoading(false);
      } else {
        try {
          const response = await axios.get(`https://reqres.in/api/users/${id}`);
          const fetchedUser = response.data.data;
          setUser({ ...fetchedUser, job: fetchedUser.job || "Sin asignar" });
        } catch (error) {
          console.error("Error al obtener los detalles del usuario:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [id, users]);

  if (loading) {
    return (
      <div className="user-details-container">
        <p className="text-center text-xl font-semibold text-blue-500 animate-pulse">
          Cargando detalles del usuario...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-details-container">
        <p className="text-center text-red-500">No se encontró el usuario.</p>
      </div>
    );
  }

  return (
    <div className="user-details-container">
      <div className="user-details-card">
        <img
          src={user.avatar || "https://via.placeholder.com/150"}
          alt={`${user.first_name} ${user.last_name}`}
          className="user-avatar"
        />
        <h1 className="user-name">{user.first_name} {user.last_name}</h1>
        <p className="user-email">{user.email}</p>
        <div className="user-info">
          <p><strong>Trabajo:</strong> {user.job}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
        <button
          className="user-action-button"
          onClick={() => navigate("/")}
        >
          Volver al listado
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
