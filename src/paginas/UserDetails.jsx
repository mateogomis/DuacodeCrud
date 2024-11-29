// src/paginas/UserDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import BackButton from "../componentes/BackButton";

const UserDetails = () => {
  const { id } = useParams();
  const { users } = useUserContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const foundUser = users.find((u) => u.id === parseInt(id) || u.id === id);

      if (foundUser) {
        setUser(foundUser);
        setLoading(false);
      } else {
        try {
          const response = await axios.get(`https://reqres.in/api/users/${id}`);
          setUser(response.data.data);
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
    return <p className="text-center">Cargando detalles del usuario...</p>;
  }

  if (!user) {
    return <p className="text-center text-red-500">No se encontró el usuario.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Detalles del Usuario: {user.first_name} {user.last_name}
      </h1>
      <BackButton /> {/* Botón para volver */}
      <img
        src={user.avatar || "https://via.placeholder.com/150"}
        alt={user.first_name}
        className="rounded-full w-32 h-32 mx-auto mb-4"
      />
      <p className="text-center text-lg">Email: {user.email}</p>
      {user.job && <p className="text-center text-lg">Trabajo: {user.job}</p>}
    </div>
  );
};

export default UserDetails;
