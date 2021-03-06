import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Description from "./Description";

const DescRoot = () => {
  const [id, setId] = useState(1);

  useEffect(() => {
    let path = window.location.pathname;

    path = path.slice(1);

    setId(path);
  }, []);
  return (
    <AppWrapper>
      <Description productID={id} />
    </AppWrapper>
  );
};

export default DescRoot;

const AppWrapper = styled.div`
  background-color: #e4e7ed;
  padding: 20px 0;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: space-around;
`;
