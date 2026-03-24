import axios from "axios";

const BASE_URL     = "http://localhost:9595/lostfound";
const ROLE_URL     = "http://localhost:9595/lostfound/role";
const USER_URL     = "http://localhost:9595/lostfound/user";
const LOGOUT_URL   = "http://localhost:9595/lostfound/logout";
const STD_URL      = "http://localhost:9595/lostfound/student"; // ✅ uncommented
const ME_URL       = "http://localhost:9595/lostfound/me";
const LOGIN_URL    = "http://localhost:9595/lostfound/login";
const REGISTER_URL = "http://localhost:9595/lostfound/register";

// ================= REGISTER =================
export const registerNewUser = (user) => {
  return axios.post(REGISTER_URL, user, {
    withCredentials: true
  });
};

// ================= LOGIN =================
export const login = (userId, password) => {
  return axios.get(`${LOGIN_URL}/${userId}/${password}`, {
    withCredentials: true
  });
};

// ================= GET ROLE =================
export const getRole = () => {
  return axios.get(ROLE_URL, {
    withCredentials: true
  });
};

// ================= GET USERNAME =================
export const getUserId = () => {
  return axios.get(USER_URL, {
    withCredentials: true
  });
};

// ================= GET FULL USER =================
export const getUser = () => {
  return axios.get(ME_URL, {
    withCredentials: true
  });
};

// ================= STUDENT API =================
export const getStudent = () => {
  return axios.get(STD_URL, {   // ✅ now works
    withCredentials: true
  });
};

// ================= LOGOUT =================
export const logout = () => {
  return axios.post(LOGOUT_URL, {}, {
    withCredentials: true
  });
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = (username, newPassword) => {
  return axios.post(
    `http://localhost:9595/lostfound/forgot-password/${username}/${newPassword}`
  );
};

// ================= GET CURRENT USER =================
export const getCurrentUser = () => {
  return axios.get(`${BASE_URL}/me`, {
    withCredentials: true,
  });
};
