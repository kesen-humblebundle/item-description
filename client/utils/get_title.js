import axios from "axios";

export const getTitle = async (product_id) => {
  let title = await axios.get(`/description/title/${product_id}`);
  return title.data;
};
