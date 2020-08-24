import axios from "axios";

export const getDescription = async (product_id) => {
  let desc = await axios.get(`/description/${product_id}`);
  return desc.data;
};
