import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./paginas/Home";
import UserDetails from "./paginas/UserDetails";
import CreateUser from "./paginas/CreateUser";
import EditUser from "./paginas/EditUser";
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <div className="container mx-auto p-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<UserDetails />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/edit-user/:id" element={<EditUser />} />

      </Routes>
    </div>
  );
}

export default App;
