import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { getTitle } from "../../utils/get_title";

const TitleRoot = ({ pathname }) => {
  const [id, setId] = useState(21);
  const [title, setTitle] = useState("");

  useEffect(() => {
    let path = pathname;

    path = path.slice(1);

    setId(path);

    getTitle(path).then((newTitle) => {
      console.log(newTitle);
      setTitle(newTitle);
      console.log(title);
    });
  }, [pathname]);
  return <Title>{title}</Title>;
};

export default TitleRoot;

const Title = styled.div`
  color: #a1a7b3;
  text-transform: uppercase;
  font-size: 24px;
  font-weight: 900;
  margin-top: 30px;
`;
