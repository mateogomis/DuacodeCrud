import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Gestión de Usuarios. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
