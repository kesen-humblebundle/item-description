import axios from "axios";
const US_API = "https://api.unsplash.com/";
const GIPHY_API = "https://api.giphy.com/v1/gifs/search";

export const getImages = async () => {
  //   let images = axios.get(US_API + "photos/random", {
  //     headers: {
  //       Authorization: ` Client-ID ${process.env.REACT_APP_US_ACCESS_KEY}`,
  //     },
  //     params: {
  //       query: "video game",
  //       count: 3,
  //     },
  //   });

  let images = await axios.get(GIPHY_API, {
    params: {
      api_key: process.env.REACT_APP_GIPHY_KEY,
      limit: 3,
      q: "video game",
    },
  });

  return images.data.data.map((imgData) => imgData.images.original.url);
};
