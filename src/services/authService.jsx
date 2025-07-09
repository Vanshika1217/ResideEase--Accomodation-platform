import axios from "axios";

const API_URL = "https://backend-resideease.onrender.com/auth";

// User Login
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true } // Ensures cookies are sent
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Login failed" };
  }
};

// User Signup
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(
      `https://backend-resideease.onrender.com/auth/register`,
      { name, email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Signup failed" };
  }
};

// User Logout
export const logoutUser = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    throw error.response ? error.response.data : { message: "Logout failed" };
  }
};
