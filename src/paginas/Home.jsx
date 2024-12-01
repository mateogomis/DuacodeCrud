import React, { useEffect, useState } from "react";
import { fetchUsers } from "../servicios/apiService";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import "../styles/styles.css";

const Home = () => {
  const { users, setUsers } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [message, setMessage] = useState("");

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
    if (deletingUserId) return; // Si ya hay un usuario en proceso de eliminación, no hace nada
  
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (!confirmed) return;
  
    setDeletingUserId(id); // Marca el usuario como en proceso de eliminación
  
    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(
          `Error de la API al eliminar el usuario. Código de estado: ${response.status}`
        );
      }
  
      setUsers(users.filter((user) => user.id !== id));
      setMessage("Usuario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setMessage(
        `Hubo un problema al intentar eliminar el usuario. Detalles: ${
          error.message || "Error desconocido"
        }`
      );
    } finally {
      setDeletingUserId(null); // Restablece el estado al finalizar
    }
  };  

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="text-center text-lg">Cargando usuarios...</p>;
  }

  return (
    <div className="container">
      <div className="text-center mb-6">
        <h1 className="title">Gestión de Usuarios</h1>
          <Link to="/create-user" className="button-create">
            <i className="bi bi-person-add" style={{ fontSize: '1.2rem', marginRight: '8px' }}></i>
            Crear Usuario
          </Link>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar mb-6">
        <input
          type="text"
          placeholder="Buscar usuario por nombre..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Lista de usuarios filtrados */}
      <div className="user-list-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map((user) => (
            <div key={user.id} className="card text-center">
              <img
                src={user.avatar}
                alt={user.first_name}
                className="rounded-full"
              />
              <h2 className="card-title">
                {user.first_name} {user.last_name}
              </h2>
              <p className="card-text">{user.email}</p>
              <div className="card-buttons">
                <Link to={`/user/${user.id}`} className="button button-details">
                  <i className="fa fa-info-circle"></i> Ver Detalles
                </Link>
                <Link
                  to={`/edit-user/${user.id}`}
                  className="button button-edit"
                >
                  <i className="fa fa-edit"></i> Editar
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="button button-delete"
                  disabled={deletingUserId === user.id} // Deshabilita el botón si se está eliminando
                >
                  <i className="fa fa-trash"></i>{" "}
                  {deletingUserId === user.id ? (
                    <>
                      Eliminando<span className="dots"><span>.</span><span>.</span><span>.</span></span>
                    </>
                  ) : (
                    "Eliminar"
                  )}
                </button>                          
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensaje si no se encuentran resultados */}
      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No se encontraron usuarios que coincidan con la búsqueda.
        </p>
      )}
    </div>
  );
};

export default Home;
