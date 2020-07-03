//require("dotenv").config();
import React from "react";
import axios from "axios";
import styled from "styled-components";

import Description from "./src/description";

const App = () => {
  return (
    <AppWrapper>
      <Description productID="1" />
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
