import axios from "axios";

const BASE_URL = "http://localhost:9595/lostfound";
const FOUND_ITEM_URL = `${BASE_URL}/founditem`;

export const saveFoundItem = (item) => {

  const formData = new FormData();

  formData.append("itemName", item.itemName);
  formData.append("brand", item.brand);
  formData.append("category", item.category);
  formData.append("description", item.description);
  formData.append("location", item.location);
  formData.append("date", item.date);
  formData.append("image", item.imageFile);

  return axios.post(FOUND_ITEM_URL, formData, {
    withCredentials: true
  });
};

export const getAllFoundItems = () => {
  return axios.get(FOUND_ITEM_URL, {
    withCredentials: true
  });
};

export const deleteFoundItem = (id) => {
  return axios.delete(`${FOUND_ITEM_URL}/${id}`, {
    withCredentials: true
  });
};
