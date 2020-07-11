import React from "react";
import ReactDOM from "react-dom";

import DescRoot from "./src/components/DescRoot";
import TitleRoot from "./src/components/TitleRoot";

import "./index.css";

ReactDOM.render(<DescRoot />, document.querySelector("#desc"));
ReactDOM.render(<TitleRoot />, document.querySelector("#Title"));
