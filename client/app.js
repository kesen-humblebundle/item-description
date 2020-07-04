import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Description from "./src/description";

const App = () => {
  const [id, setId] = useState(1);

  useEffect(() => {
    let path = window.location.pathname;

    console.log(path);
  }, []);
  return (
    <AppWrapper>
      <Description productID={id} />
    </AppWrapper>
  );
};

export default App;

const AppWrapper = styled.div`
  background-color: #e4e7ed;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: space-around;
`;
