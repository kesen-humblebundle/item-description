import axios from "axios";

export const getDescription = async (product_id) => {
  let desc = await axios.get(`/description/${product_id}`);
  console.log(desc.data.description);
  return desc.data;
};
