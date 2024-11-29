import axios from "axios";

const API_BASE_URL = "https://reqres.in/api";

export const fetchUsers = async (page = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};
