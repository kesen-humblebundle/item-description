const US_API = "https://api.unsplash.com/";

export const get_images = async () => {
  let images = axios.get(US_API + "photos/random", {
    headers: {
      Authorization: ` Client-ID ${process.env.REACT_APP_US_ACCESS_KEY}`,
    },
    params: {
      query: "video game",
      count: 3,
    },
  });

  return images.data.map((imgData) => imgData.urls.small);
};
