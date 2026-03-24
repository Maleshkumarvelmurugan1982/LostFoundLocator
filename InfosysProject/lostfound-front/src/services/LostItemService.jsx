import axios from "axios";

const BASE_URL = "http://localhost:9595/lostfound";
const LOST_ITEM_URL = `${BASE_URL}/lostitem`;

// ================= AUTH HEADER HELPER =================
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ================= SAVE LOST ITEM WITH IMAGE =================
export const saveLostItem = (lostItem) => {
  const formData = new FormData();
  formData.append("itemName", lostItem.itemName);
  formData.append("brand", lostItem.brand || "");
  formData.append("category", lostItem.category || "");
  formData.append("description", lostItem.description || "");
  formData.append("location", lostItem.location || "");
  formData.append("date", lostItem.date || "");
  formData.append("image", lostItem.imageFile);

  return axios.post(LOST_ITEM_URL, formData, {
    headers: {
      ...getAuthHeader(),
      // Do NOT set Content-Type here — axios sets it automatically for FormData
    },
    withCredentials: true,
  });
};

// ================= GET ITEMS (ROLE BASED) =================
// Admin → all items
// Student → only their items
export const getLostItems = () => {
  return axios.get(LOST_ITEM_URL, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
};

// ================= GET LOST ITEM BY ID =================
export const getLostItemById = (id) => {
  return axios.get(`${LOST_ITEM_URL}/${id}`, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
};

// ================= DELETE LOST ITEM =================
export const deleteLostItem = (id) => {
  return axios.delete(`${LOST_ITEM_URL}/${id}`, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
};
