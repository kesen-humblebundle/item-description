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
            <DescImage src={url} />
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
  font-family: "Sofia Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  margin: 20px;
  background-color: #e4e7ed;
  color: #494f5c;
`;

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  max-width: 600px;
`;

const DescImage = styled.img`
  width: 100%;
  height: auto;
`;

const DescWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: center;
`;
