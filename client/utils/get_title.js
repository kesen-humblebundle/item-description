import axios from "axios";

const API_URL =
  location.origin === "http://ec2-54-224-38-115.compute-1.amazonaws.com:5150"
    ? ""
    : "http://ec2-54-224-38-115.compute-1.amazonaws.com:5150";

export const getTitle = async (product_id) => {
  let title = await axios.get(`${API_URL}/description/title/${product_id}`);
  return title.data;
};
