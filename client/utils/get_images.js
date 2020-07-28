import axios from "axios";
const IMAGE_API =
  "http://ec2-52-14-126-227.us-east-2.compute.amazonaws.com:3001/api/";

export const getImages = async () => {
  const product_id = window.location.pathname.replace("/", "");

  let images = await axios.get(IMAGE_API + product_id, {
    params: {
      type: "description_images",
    },
  });

  console.log(images.data);

  return images.data;
};
