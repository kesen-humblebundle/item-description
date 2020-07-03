//require("dotenv").config();
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const US_API = "https://api.unsplash.com/";

const App = ({ productId }) => {
  let [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get(US_API + "photos/random", {
        headers: {
          Authorization: ` Client-ID ${process.env.REACT_APP_US_ACCESS_KEY}`,
        },
        params: {
          query: "video game",
          count: 3,
        },
      })
      .then((resp) => {
        console.log(resp.data);
        let newImages = resp.data.map((imgData) => imgData.urls.small);

        setImages(newImages);
      });
  }, []);

  return (
    <DescWrapper>
      {images && images.map((image, i) => <img src={image} key={i} />)}
    </DescWrapper>
  );
};

export default App;

const DescWrapper = styled.div`
  width: 100%;
  margin: 15px;
`;
