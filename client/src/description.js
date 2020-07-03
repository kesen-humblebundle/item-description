import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

import { getDescription } from "../utils/get_description";

const Description = ({ productID }) => {
  let [description, setDescription] = useState("");

  useEffect(() => {
    let desc = getDescription(productID).then((resp) => {
      let paragraphs = resp.description
        .split("\n \r")
        .map((para, i) => <ParagraphWrapper key={i}>{para}</ParagraphWrapper>);
      console.log(paragraphs);
      setDescription(paragraphs);
      console.log(resp);
    });
  }, []);
  return <div>{description}</div>;
};

export default Description;

const ParagraphWrapper = styled.p`
  width: 100%;
  margin-top: 15px;
  background-color: black;
  color: white;
`;
