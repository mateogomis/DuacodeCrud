import React, { useEffect, useState } from "react";
import { fetchUsers } from "../servicios/apiService";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const Home = () => {
  const { users, setUsers } = useUserContext(); // Accede al contexto global
  const [loading, setLoading] = useState(true);

  // Cargar usuarios desde la API solo la primera vez
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers(); // Llamada a la API

        // Añadir el campo "job" con un valor predeterminado
        const usersWithJob = data.data.map((user) => ({
          ...user,
          job: "No especificado", // Valor predeterminado para el campo trabajo
        }));

        setUsers(usersWithJob); // Guardar los usuarios en el contexto global
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    // Solo cargar usuarios si la lista está vacía
    if (users.length === 0) {
      getUsers();
    } else {
      setLoading(false); // Ya hay usuarios en el contexto
    }
  }, [users, setUsers]);

  // Manejar eliminación de usuarios
  const handleDelete = async (id) => {
    try {
      // Simulación de eliminación (si tienes una API, utiliza su endpoint DELETE)
      await fetch(`https://reqres.in/api/users/${id}`, { method: "DELETE" });

      // Actualizar el estado eliminando el usuario
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  if (loading) {
    return <p className="text-center">Cargando usuarios...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Listado de Usuarios</h1>
      <Link
        to="/create-user"
        className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Crear Usuario
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="border p-4 rounded shadow">
            <img
              src={user.avatar || "https://via.placeholder.com/150"}
              alt={user.first_name}
              className="rounded-full w-16 h-16 mx-auto mb-2"
            />
            <h2 className="text-center text-lg font-bold">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-center text-sm">{user.email}</p>
            <div className="mt-4 flex justify-center space-x-4">
              {/* Botón "Ver Detalles" */}
              <Link
                to={`/user/${user.id}`}
                className="text-blue-500 hover:underline"
              >
                Ver detalles
              </Link>
              {/* Botón "Editar" */}
              <Link
                to={`/edit-user/${user.id}`}
                className="text-green-500 hover:underline"
              >
                Editar
              </Link>
              {/* Botón "Eliminar" */}
              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
