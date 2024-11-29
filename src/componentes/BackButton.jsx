import React from "react";
import { Link } from "react-router-dom";

const BackButton = () => {
  return (
    <Link
      to="/"
      className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
    >
      Volver al listado
    </Link>
  );
};

export default BackButton;
