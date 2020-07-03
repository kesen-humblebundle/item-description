import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

import { getDescription } from "../utils/get_description";
import { getImages } from "../utils/get_images";

const Description = ({ productID }) => {
  let [description, setDescription] = useState("");

  useEffect(() => {
    let desc = getDescription(productID).then((resp) => {
      let paragraphs = resp.description
        .split("\n \r")
        .map((para, i) => (
          <ParagraphWrapper key={"p" + i}>{para}</ParagraphWrapper>
        ));

      setDescription(paragraphs);
      getImages().then((imageUrls) => {
        let images = imageUrls.map((url, i) => (
          <ImageWrapper key={"img" + i}>
            <img src={url} />
          </ImageWrapper>
        ));

        let descriptionArr = [];

        for (let i = 0; i < images.length; i++) {
          descriptionArr.push(images[i]);
          descriptionArr.push(paragraphs[i]);
        }

        setDescription(descriptionArr);
      });
    });
  }, []);
  return <DescWrapper>{description}</DescWrapper>;
};

export default Description;

const ParagraphWrapper = styled.p`
  width: 100%;
  margin-top: 15px;
  background-color: black;
  color: white;
`;

const ImageWrapper = styled.div`
  max-width: 600px;
`;

const DescWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: center;
`;
