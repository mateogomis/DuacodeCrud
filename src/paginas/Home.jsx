import React, { useEffect, useState } from "react";
import { fetchUsers } from "../servicios/apiService";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import "../styles/styles.css"; // Importar estilos personalizados

const Home = () => {
  const { users, setUsers } = useUserContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data.data);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    if (users.length === 0) {
      getUsers();
    } else {
      setLoading(false);
    }
  }, [users, setUsers]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (!confirmed) return;

    try {
      // Identificar si el usuario es local (sin ID válido para la API)
      if (typeof id !== "number" || id < 0) {
        console.log("Usuario local eliminado.");
        setUsers(users.filter((user) => user.id !== id));
        return;
      }

      // Llamada a la API para usuarios con ID válido
      const response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Error de la API al eliminar el usuario. Código de estado: ${response.status}`
        );
      }

      // Actualizar la lista de usuarios después de la eliminación
      setUsers(users.filter((user) => user.id !== id));
      alert("Usuario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      alert(
        "Hubo un problema al intentar eliminar el usuario. Por favor, inténtalo nuevamente."
      );
    }
  };

  if (loading) {
    return <p className="text-center text-lg">Cargando usuarios...</p>;
  }

  return (
    <div className="container">
      <div className="text-center mb-6">
        <h1 className="title">Gestión de Usuarios</h1>
        <Link to="/create-user" className="button-create">
          Crear Usuario
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((user) => (
          <div key={user.id} className="card text-center">
            <img
              src={user.avatar}
              alt={user.first_name}
              className="rounded-full"
            />
            <h2 className="card-title">{user.first_name} {user.last_name}</h2>
            <p className="card-text">{user.email}</p>
            <div className="card-buttons">
              <Link to={`/user/${user.id}`} className="button button-details">
                <i className="fa fa-info-circle"></i> Ver Detalles
              </Link>
              <Link to={`/edit-user/${user.id}`} className="button button-edit">
                <i className="fa fa-edit"></i> Editar
              </Link>
              <button
                onClick={() => handleDelete(user.id)}
                className="button button-delete"
              >
                <i className="fa fa-trash"></i> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
